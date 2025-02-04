// const File = require('../models/file.model');
const { uploadToS3, deleteFromS3 } = require("../utils/s3Service");
const QuotesData = require("../models/quoteImage.model");

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const fileName = `${Date.now()}-${req.file.originalname}`;
    const fileUrl = await uploadToS3(req.file, fileName);

    res.status(200).json({
      message: "File uploaded successfully",
      fileUrl: fileUrl,
      fileName: fileName,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });
  }
};

const uploadQuote = async (req, res) => {
  try {
    const data = req.body;
    const quotesData = new QuotesData(data);
    await quotesData.save();
    res
      .status(200)
      .json({ message: " QuotesData uploaded successfully", data: quotesData });
  } catch (error) {
    console.error("Quote image upload error:", error);
    res.status(500).json({
      message: "Error uploading quote image",
      error: error.message,
    });
  }
};

const getQuotes = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      subtype,
      language,
      status,
      search,
    } = req.query;
    let query = {};
    if (type) query.type = type;
    if (subtype) query.subtype = subtype;
    if (language) query.language = language;
    if (status) query.status = status;

    const totalCount = await QuotesData.countDocuments(query);

    const filterQuotes = await QuotesData.find(query)
      .sort({ createdAt: -1 }) // Sort by latest date
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      total: totalCount,
      page: parseInt(page),
      totalPages: Math.ceil(totalCount / limit),
      data: filterQuotes,
    });
  } catch (error) {
    console.error("Error fetching quote images:", error);
    res
      .status(500)
      .json({ message: "Error fetching quote images", error: error.message });
  }
};

const deleteQuoteById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    console.log("id---------", id, "body---------", data);
    await QuotesData.deleteOne({ _id: id });
    const deletedFile = await deleteFromS3(data.s3ImageName);
    if (deletedFile) {
      res.status(200).json({ message: "Quote deleted successfully" });
    } else {
      res.status(500).json({
        message: "Error deleting quote image",
        error: "File not found",
      });
    }
  } catch (error) {
    console.error("Error deleting quote image:", error);
    res
      .status(500)
      .json({ message: "Error deleting quote image", error: error.message });
  }
};

module.exports = {
  uploadFile,
  uploadQuote,
  getQuotes,
  deleteQuoteById,
};
