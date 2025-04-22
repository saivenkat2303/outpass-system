const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// New schema
const logSchema = new mongoose.Schema({
  rollno: String,
  action: String, // "IN" or "OUT"
  timestamp: { type: Date, default: Date.now },
});

const SecurityLog = mongoose.model("SecurityLog", logSchema);

// Record entry/exit
router.post("/log", async (req, res) => {
  const { rollno, action } = req.body;
  const newLog = new SecurityLog({ rollno, action });
  await newLog.save();
  res.status(201).json({ message: "Logged" });
});

// Get logs
router.get("/logs", async (req, res) => {
  const logs = await SecurityLog.find();
  res.status(200).json(logs);
});

module.exports = router;
