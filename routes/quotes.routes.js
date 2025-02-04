const router = require("express").Router();
const upload = require("../middleware/upload.middleware");
const uploadController = require("../controllers/quotes.controller");

router.post("/imageUpload", upload.single("file"), uploadController.uploadFile);
router.post("/add-quotes", uploadController.uploadQuote);
router.get("/get-quotes", uploadController.getQuotes);
router.delete("/quote-image/:id", uploadController.deleteQuoteImage);
router.delete("/delete-from-s3", uploadController.deleteFromS3Controller);

module.exports = router;
