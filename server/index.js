require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Remove trailing slash safety
const AI_ENGINE_URL = (process.env.AI_ENGINE_URL || "").replace(/\/$/, "");

// Health route
app.get("/", (req, res) => {
  res.send("FutureSight API Running 🚀");
});

app.get("/predict", (req, res) => {
  res.send("FutureSight /predict endpoint is online. Use POST to send data. 🚀");
});

// MAIN ROUTE
app.post("/predict", async (req, res) => {
  try {
    console.log("Forwarding to AI:", `${AI_ENGINE_URL}/predict`);
    console.log("Request body:", req.body);

    const response = await axios.post(
      `${AI_ENGINE_URL}/predict`,
      req.body,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);

  } catch (error) {
    console.error("FULL ERROR:", error.response?.data || error.message);

    res.status(500).json({
      error: "AI request failed",
      details: error.response?.data || error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});