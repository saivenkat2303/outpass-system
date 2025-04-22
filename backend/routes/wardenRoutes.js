const express = require("express");
const router = express.Router();
const Outpass = require("../models/outpassModel");

// Get all outpasses
router.get("/all", async (req, res) => {
  try {
    const data = await Outpass.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
