const express = require("express");
const router = express.Router();
const Outpass = require("../models/outpassModel");
const { sendSMS } = require("../utils/smsService");
const PDFDocument = require("pdfkit");

// Student requests outpass
router.post("/request", async (req, res) => {
  try {
    const outpass = new Outpass(req.body);
    await outpass.save();

    // Notify warden
    await sendSMS(
      req.body.parentMobile,
      `Outpass requested by ${req.body.name} (${req.body.rollno}). Please call and confirm.`
    );

    res.status(201).json({ message: "Outpass request submitted." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Warden approves
router.put("/approve/:id", async (req, res) => {
  try {
    await Outpass.findByIdAndUpdate(req.params.id, { approved: true });
    res.status(200).json({ message: "Outpass approved" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Generate PDF
router.get("/pdf/:id", async (req, res) => {
  try {
    const outpass = await Outpass.findById(req.params.id);
    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=outpass-${outpass._id}.pdf`);

    doc.pipe(res);
    doc.fontSize(20).text("Hostel Outpass", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Name: ${outpass.name}`);
    doc.text(`Roll No: ${outpass.rollno}`);
    doc.text(`College: ${outpass.college}`);
    doc.text(`Year: ${outpass.year}`);
    doc.text(`Parent Mobile: ${outpass.parentMobile}`);
    doc.text(`Student Mobile: ${outpass.studentMobile}`);
    doc.text(`Date of Outing: ${outpass.dateOfOuting}`);
    doc.text(`Date of Return: ${outpass.dateOfReturn}`);
    doc.text(`Reason: ${outpass.reason}`);
    doc.text(`Approved: ${outpass.approved ? "Yes" : "No"}`);
    doc.end();
  } catch (err) {
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

module.exports = router;
