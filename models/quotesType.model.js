const mongoose = require("mongoose");

const quoteTypeSchema = new mongoose.Schema({
  backgroundUrl: { type: String },
  type: { type: String },
  subType: { type: Array },
  s3ImageName: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("QuotesType", quoteTypeSchema);
