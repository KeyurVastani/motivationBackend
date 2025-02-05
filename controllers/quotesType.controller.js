const QuotesModal = require("../models/quotesType.model");
const { deleteFromS3 } = require("../utils/s3Service");

const addQuotesType = async (req, res) => {
  try {
    const data = req.body;
    const quotesType = new QuotesModal(data);
    await quotesType.save();
    res
      .status(200)
      .json({ message: " quotesType uploaded successfully", data: quotesType });
  } catch (error) {
    console.error("quotesTypee upload error:", error);
    res.status(500).json({
      message: "Error uploading quotesType",
      error: error.message,
    });
  }
};

const getQuotesType = async (req, res) => {
  try {
    console.log("o===============================");
    const { page = 1, limit = 10, type, subtype } = req.query;
    let query = {};
    if (type) query.type = type;
    if (subtype) query.subtype = subtype;

    const totalCount = await QuotesModal.countDocuments(query);

    const filterQuotesTypes = await QuotesModal.find(query)
      .sort({ createdAt: -1 }) // Sort by latest date
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      total: totalCount,
      page: parseInt(page),
      totalPages: Math.ceil(totalCount / limit),
      data: filterQuotesTypes,
    });
  } catch (error) {
    console.error("Error fetching quote images:", error);
    res
      .status(500)
      .json({ message: "Error fetching quote images", error: error.message });
  }
};

const updateQuotesType = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, subType, backgroundImageUrl, s3ImageName } = req.body;

    const updatedQuotesType = await QuotesModal.findByIdAndUpdate(
      id,
      { type, subType, backgroundImageUrl, s3ImageName },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Quotes type updated",
      data: updatedQuotesType,
    });
  } catch (error) {
    console.error("quotesTypee upload error:", error);
    res.status(500).json({
      message: "Error uploading quotesType",
      error: error.message,
    });
  }
};

const deleteQuotesType = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await QuotesModal.deleteOne({ _id: id });
    const deletedFile = await deleteFromS3(data.s3ImageName);
    if (deletedFile) {
      res.status(200).json({ message: "Quote type deleted successfully" });
    } else {
      res.status(500).json({
        message: "Error deleting quote image",
        error: "File not found",
      });
    }
  } catch (error) {
    console.error("quotesTypee upload error:", error);
    res.status(500).json({
      message: "Error uploading quotesType",
      error: error.message,
    });
  }
};

module.exports = {
  addQuotesType,
  getQuotesType,
  updateQuotesType,
  deleteQuotesType,
};
