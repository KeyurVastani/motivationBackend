const express = require("express");
const cors = require("cors");
require("dotenv").config();
const multer = require("multer");

const connectDB = require("./config/db.config");
const uploadRoutes = require("./routes/quotes.routes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", ({ res, req }) => {
  res.json({ msg: "get api working" });
});

app.use("/v1/api/motivations", uploadRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File size too large",
        error: "File must be less than 5MB",
      });
    }
    return res.status(400).json({
      message: "File upload error",
      error: err.message,
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation error",
      error: err.message,
    });
  }

  res.status(500).json({
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
