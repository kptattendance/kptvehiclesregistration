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
