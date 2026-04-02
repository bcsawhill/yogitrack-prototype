const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController.cjs");

router.post("/add", customerController.add);
router.get("/getNextId", customerController.getNextId);

module.exports = router;