import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { body, validationResult } from "express-validator";

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI; // Get MongoDB URI from .env

// Middleware
app.use(express.json());
app.use(cors()); // Allow frontend to access backend
app.use(morgan("dev")); // Log requests to console

// MongoDB Atlas connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Donor Schema
const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  number: { type: String, required: true },
  bloodType: { type: String, required: true },
  location: { type: String, required: true },
});

const Donor = mongoose.model("Donor", donorSchema);

// ➤ Route to add a new donor with validation
app.post(
  "/donors",
  [
    body("name").isString().notEmpty().withMessage("Name is required"),
    body("age").isInt({ min: 18 }).withMessage("Age must be 18 or above"),
    body("number").isMobilePhone().withMessage("Invalid phone number"),
    body("bloodType")
      .isIn(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"])
      .withMessage("Invalid blood type"),
    body("location").notEmpty().withMessage("Location is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newDonor = new Donor(req.body);
      await newDonor.save();
      res.status(201).json({ message: "Donor added successfully!", newDonor });
    } catch (error) {
      res.status(500).json({ error: "Error saving donor" });
    }
  }
);

// ➤ Route to get all donors
app.get("/donors", async (req, res) => {
  try {
    const donors = await Donor.find();
    res.json(donors);
  } catch (error) {
    res.status(500).json({ error: "Error fetching donors" });
  }
});

// ➤ Route to delete a donor
app.delete("/donors/:id", async (req, res) => {
  try {
    const donor = await Donor.findByIdAndDelete(req.params.id);
    if (!donor) {
      return res.status(404).json({ error: "Donor not found" });
    }
    res.json({ message: "Donor deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting donor" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
