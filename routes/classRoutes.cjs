const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController.cjs");

router.get("/all", classController.getAll);
router.get("/getNextId", classController.getNextId);
router.post("/add", classController.add);
router.get("/:classId", classController.getOne);
router.put("/update/:classId", classController.update);
router.delete("/delete/:classId", classController.delete);

module.exports = router;
