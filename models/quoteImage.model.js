const mongoose = require("mongoose");

const quoteImageSchema = new mongoose.Schema({
  url: { type: String },
  type: { type: String },
  subType: { type: String },
  text: { type: String },
  language: { type: String, enum: ["english", "hindi", "gujarati"] },
  s3ImageName: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Quotes", quoteImageSchema);
