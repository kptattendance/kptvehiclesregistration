import axios from "axios";
import Vehicle from "../models/Vehicle.js";
import Tesseract from "tesseract.js";

export const scanPlate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // Send to Plate Recognizer
    const apiUrl = "https://api.platerecognizer.com/v1/plate-reader/";
    const plateRes = await axios.post(
      apiUrl,
      {
        upload: req.file.buffer.toString("base64"),
      },
      {
        headers: {
          Authorization: `Token ${process.env.PLATE_RECOGNIZER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const results = plateRes.data.results;

    if (!results || results.length === 0) {
      const {
        data: { text },
      } = await Tesseract.recognize(req.file.buffer, "eng");
      const detectedPlate = text.replace(/\s+/g, "").toUpperCase();
      return res.json({ detectedPlate, vehicle: null });
    }

    const detectedPlate = results[0].plate.toUpperCase();

    // Look up in DB
    const vehicle = await Vehicle.findOne({ vehicleNumber: detectedPlate });

    res.json({
      detectedPlate,
      vehicle: vehicle || null,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Server error scanning plate" });
  }
};

export const searchVehicleByPlate = async (req, res) => {
  try {
    const { plate } = req.query;
    console.log("am near srach controller");

    if (!plate) {
      return res.status(400).json({ error: "Plate number is required" });
    }

    console.log(plate);
    const cleanPlate = plate.replace(/\s+/g, ""); // remove spaces
    const vehicle = await Vehicle.findOne({
      vehicleNumber: { $regex: cleanPlate, $options: "i" },
    });

    if (!vehicle) {
      return res.status(404).json({ message: "No matching vehicle found" });
    }

    return res.status(200).json({ vehicle });
  } catch (err) {
    console.error("Manual search error:", err);
    return res
      .status(500)
      .json({ error: err.message || "Error searching for vehicle" });
  }
};
