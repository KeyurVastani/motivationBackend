const router = require("express").Router();
const quotesTypeController = require("../controllers/quotesType.controller");

//create quotes
router.get("/", quotesTypeController.getQuotesType);
router.post("/add", quotesTypeController.addQuotesType);
router.put("/update/:id", quotesTypeController.updateQuotesType);
router.delete("/delete/:id", quotesTypeController.deleteQuotesType);

module.exports = router;
