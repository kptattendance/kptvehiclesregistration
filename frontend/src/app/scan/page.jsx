"use client";
import { useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { motion } from "framer-motion";
import LoadOverlay from "../../components/LoadOverlay";
import RoleGuard from "../../components/RoleGuard";

export default function ScanPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [previewImage, setPreviewImage] = useState("");
  const [detectedPlate, setDetectedPlate] = useState("");
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState(null);

  const { getToken } = useAuth();

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
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          setDetectedPlate(res.data.detectedPlate);
          setVehicle(res.data.vehicle);
        } catch (err) {
          console.error(err);
          alert(
            err.response?.data?.error ||
              "Error sending to server. Please try again."
          );
        } finally {
          setLoading(false);
          stopCamera();
        }
      },
      "image/jpeg",
      0.9
    );
  }

  return (
    <RoleGuard allowedRoles={["admin", "user"]}>
      {/* 👇 REMOVE min-h-screen, ADD flex-grow */}
      <div className="flex flex-col items-center flex-grow p-4 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
        <h1 className="text-3xl font-extrabold mb-6 mt-6 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Scan Vehicle Plate
        </h1>

        <video
          ref={videoRef}
          className="border rounded w-full max-w-md mb-2"
          autoPlay
          muted
        />

        <canvas ref={canvasRef} style={{ display: "none" }} />

        <div className="flex gap-2 mt-2">
          <button
            onClick={startCamera}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Start Camera
          </button>
          <button
            onClick={stopCamera}
            disabled={!stream}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
          >
            Stop Camera
          </button>
          <button
            onClick={captureAndScan}
            disabled={loading || !stream}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Scanning..." : "Capture & Scan"}
          </button>
        </div>

        {detectedPlate && (
          <div className="mt-4 p-4 bg-gray-100 rounded w-full max-w-md">
            <h2 className="text-xl font-semibold mb-2">Detected Plate:</h2>
            <p className="text-lg font-mono">{detectedPlate}</p>

            {vehicle ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-6 w-full max-w-md"
              >
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
                  <div className="h-40 bg-gray-100 flex items-center justify-center">
                    <img
                      src={vehicle.ownerImage || "/car-placeholder.png"}
                      alt="Vehicle"
                      className="h-full object-cover"
                    />
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      Vehicle Details
                    </h3>
                    <ul className="space-y-2">
                      <li>
                        <span className="font-semibold">Owner:</span>{" "}
                        {vehicle.ownerName}
                      </li>
                      {vehicle.rollNo?.startsWith("103") && (
                        <li>
                          <span className="font-semibold">Roll No:</span>{" "}
                          {vehicle.rollNo}
                        </li>
                      )}

                      <li>
                        <span className="font-semibold">Department:</span>{" "}
                        {vehicle.department?.toUpperCase()}
                      </li>
                      <li>
                        <span className="font-semibold">Phone:</span>{" "}
                        {vehicle.phone}
                      </li>
                      <li>
                        <span className="font-semibold">Email:</span>{" "}
                        {vehicle.email}
                      </li>
                      <li>
                        <span className="font-semibold">Driving License:</span>{" "}
                        {vehicle.drivingLicenseNumber}
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            ) : (
              <p className="text-red-600 mt-2">No matching vehicle in DB.</p>
            )}
          </div>
        )}

        <LoadOverlay loading={loading} message="Scanning vehicle plate..." />
      </div>
    </RoleGuard>
  );
}
