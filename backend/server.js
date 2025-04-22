const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

// Load .env variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB connected");
}).catch((err) => {
  console.log("MongoDB error:", err);
});

// Import Routes (we'll create them soon)
const outpassRoutes = require("./routes/outpassRoutes");
const wardenRoutes = require("./routes/wardenRoutes");
const securityRoutes = require("./routes/securityRoutes");

app.use("/api/outpass", outpassRoutes);
app.use("/api/warden", wardenRoutes);
app.use("/api/security", securityRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
