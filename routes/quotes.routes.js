const router = require("express").Router();
const upload = require("../middleware/upload.middleware");
const uploadController = require("../controllers/quotes.controller");

//create quotes
router.post("/imageUpload", upload.single("file"), uploadController.uploadFile);
router.post("/add-quotes", uploadController.uploadQuote);
router.get("/get-quotes", uploadController.getQuotes);
router.delete("/quote/:id", uploadController.deleteQuoteById);

module.exports = router;
