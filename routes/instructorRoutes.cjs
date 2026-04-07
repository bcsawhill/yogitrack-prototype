const express = require("express");
const router = express.Router();
const instructorController = require("../controllers/instructorController.cjs");

router.post("/add", instructorController.add);
router.get("/getNextId", instructorController.getNextId);
router.get("/search", instructorController.search);
router.get("/:instructorId", instructorController.getOne);
router.put("/update/:instructorId", instructorController.update);
router.delete("/delete/:instructorId", instructorController.delete);

module.exports = router;