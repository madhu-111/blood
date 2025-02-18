import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const app = express();
const PORT = 5001

// Middleware
app.use(express.json());
app.use(cors()); // Allow frontend to access backend

// MongoDB Atlas connection
const MONGO_URI = process.env.MONGO_URI; // Get MongoDB URI from .env

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Donor Schema
const donorSchema = new mongoose.Schema({
  name: String,
  age: Number,
  number: String,
  bloodType: String,
  location: String, // Added location field
});

const Donor = mongoose.model("Donor", donorSchema);

// ➤ Route to add a new donor
app.post("/donors", async (req, res) => {
  try {
    const newDonor = new Donor(req.body);
    await newDonor.save();
    res.status(201).json(newDonor);
  } catch (error) {
    res.status(500).json({ error: "Error saving donor" });
  }
});

// ➤ Route to get all donors
app.get("/donors", async (req, res) => {
  try {
    const donors = await Donor.find();
    res.json(donors);
  } catch (error) {
    res.status(500).json({ error: "Error fetching donors" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
