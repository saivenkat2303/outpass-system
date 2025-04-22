const mongoose = require("mongoose");

const outpassSchema = new mongoose.Schema({
  name: String,
  rollno: String,
  college: String,
  year: String,
  parentMobile: String,
  studentMobile: String,
  dateOfOuting: String,
  dateOfReturn: String,
  reason: String,
  approved: { type: Boolean, default: false },
});

module.exports = mongoose.model("Outpass", outpassSchema);
