const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController.cjs");

router.post("/add", customerController.add);
router.get("/getNextId", customerController.getNextId);
router.get("/search", customerController.search);
router.get("/:customerId", customerController.getOne);
router.put("/update/:customerId", customerController.update);
router.delete("/delete/:customerId", customerController.delete);

module.exports = router;