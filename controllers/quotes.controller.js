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

    const filters = [];
    if (type) filters.push({ type });
    if (subtype) filters.push({ subtype });
    if (language) filters.push({ language });
    if (status) filters.push({ status });

    // Match filter criteria
    const matchStage = filters.length > 0 ? { $match: { $and: filters } } : {};

    // Aggregation pipeline
    const pipeline = [
      matchStage,
      { $sort: { createdAt: -1 } }, // Sort by latest date
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            { $skip: (page - 1) * parseInt(limit) },
            { $limit: parseInt(limit) },
          ],
        },
      },
    ];

    const result = await QuotesData.aggregate(pipeline);

    const total =
      result[0].metadata.length > 0 ? result[0].metadata[0].total : 0;

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: result[0].data,
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
