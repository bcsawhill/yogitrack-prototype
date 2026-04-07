const express = require("express");
const router = express.Router();
const controller = require("../controllers/classRecordController.cjs");

router.get("/all", controller.getAll);
router.get("/getNextId", controller.getNextId);
router.post("/add", controller.add);

module.exports = router;
