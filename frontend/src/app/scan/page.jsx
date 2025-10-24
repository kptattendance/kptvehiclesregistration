"use client";
import { useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { motion } from "framer-motion";
import { Camera, Search, Car, Phone, Mail, User } from "lucide-react";
import LoadOverlay from "../../components/LoadOverlay";
import RoleGuard from "../../components/RoleGuard";

export default function ScanPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { getToken } = useAuth();

  const [previewImage, setPreviewImage] = useState("");
  const [detectedPlate, setDetectedPlate] = useState("");
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState(null);
  const [manualPlate, setManualPlate] = useState("");

  async function startCamera() {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      videoRef.current.srcObject = newStream;
      videoRef.current.play();
      setStream(newStream);
    } catch (err) {
      console.error("Camera error", err);
      alert("Camera access denied or not available.");
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setStream(null);
    }
  }

  async function captureAndScan() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !stream) {
      alert("Camera is not started!");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    canvas.toBlob(
      async (blob) => {
        if (!blob) return;
        setLoading(true);
        setDetectedPlate("");
        setVehicle(null);

        const formData = new FormData();
        formData.append("ownerImage", blob, "capture.jpg");
        setPreviewImage(URL.createObjectURL(blob));

        try {
          const token = await getToken();
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/scan`,
            formData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setDetectedPlate(res.data.detectedPlate);
          setVehicle(res.data.vehicle);
        } catch (err) {
          console.error(err);
          alert(err.response?.data?.error || "Error sending to server.");
        } finally {
          setLoading(false);
          stopCamera();
        }
      },
      "image/jpeg",
      0.9
    );
  }

  async function handleManualSearch() {
    let input = manualPlate.trim().toUpperCase().replace(/[\s-]/g, ""); // ✅ Clean input

    if (!input) {
      alert("Please enter a vehicle plate number.");
      return;
    }

    try {
      setLoading(true);
      setDetectedPlate("");
      setVehicle(null);

      const token = await getToken();
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/scan/findByPlate?plate=${input}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDetectedPlate(input);
      setVehicle(res.data.vehicle || null);
      if (!res.data.vehicle) alert("No matching vehicle in DB.");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error searching in database.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <RoleGuard allowedRoles={["admin", "user"]}>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-3xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-4 sm:p-8 border border-gray-100"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Smart Vehicle Plate Scanner
          </h1>

          {/* Camera Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-full aspect-video bg-gray-200 rounded-xl overflow-hidden shadow-inner border border-gray-300">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
              />
            </div>

            <canvas ref={canvasRef} style={{ display: "none" }} />

            <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 justify-center">
              <button
                onClick={startCamera}
                className="flex items-center gap-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
              >
                <Camera size={18} /> Start Camera
              </button>
              <button
                onClick={stopCamera}
                disabled={!stream}
                className="flex items-center gap-2 bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 text-sm sm:text-base"
              >
                Stop
              </button>
              <button
                onClick={captureAndScan}
                disabled={loading || !stream}
                className="flex items-center gap-2 bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 text-sm sm:text-base"
              >
                {loading ? "Scanning..." : "Capture & Scan"}
              </button>
            </div>
          </div>

          {/* Manual Search */}
          <div className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200 shadow-inner mb-6 w-full">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={manualPlate}
                onChange={(e) => setManualPlate(e.target.value.toUpperCase())}
                placeholder="Enter vehicle plate number"
                className="flex-1 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-center uppercase text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleManualSearch}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 text-sm sm:text-base"
              >
                <Search size={18} /> {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>

          {/* Results */}
          {detectedPlate && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-gray-200 rounded-2xl shadow-lg p-4 sm:p-6"
            >
              <h2 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800 text-center sm:text-left">
                Detected Plate:{" "}
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-base sm:text-lg">
                  {detectedPlate}
                </span>
              </h2>

              {vehicle ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="flex justify-center">
                    <img
                      src={vehicle.ownerImage || "/car-placeholder.png"}
                      alt="Vehicle"
                      className="h-40 sm:h-48 w-40 sm:w-48 object-cover rounded-xl border border-gray-300 shadow-md"
                    />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-700 text-center md:text-left">
                      Vehicle Information
                    </h3>
                    <ul className="space-y-2 text-sm sm:text-base text-gray-600">
                      <li className="flex items-center gap-2 justify-center md:justify-start">
                        <User size={16} className="text-blue-600" />{" "}
                        <span>{vehicle.ownerName}</span>
                      </li>
                      {vehicle.rollNo && (
                        <li className="text-center md:text-left">
                          <strong>Roll No:</strong> {vehicle.rollNo}
                        </li>
                      )}
                      <li className="text-center md:text-left">
                        <strong>Department:</strong>{" "}
                        {vehicle.department?.toUpperCase() || "—"}
                      </li>
                      <li className="flex items-center gap-2 justify-center md:justify-start">
                        <Phone size={16} className="text-green-600" />{" "}
                        {vehicle.phone}
                      </li>
                      {vehicle.email && (
                        <li className="flex items-center gap-2 justify-center md:justify-start">
                          <Mail size={16} className="text-purple-600" />{" "}
                          {vehicle.email}
                        </li>
                      )}
                      <li className="text-center md:text-left">
                        <strong>License:</strong>{" "}
                        {vehicle.drivingLicenseNumber || "—"}
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-red-600 mt-2 text-center font-medium">
                  No matching vehicle found.
                </p>
              )}
            </motion.div>
          )}
        </motion.div>

        <LoadOverlay loading={loading} message="Processing vehicle plate..." />
      </div>
    </RoleGuard>
  );
}
