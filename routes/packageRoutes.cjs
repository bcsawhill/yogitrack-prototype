const express = require("express");
const router = express.Router();
const packageController = require("../controllers/packageController.cjs");

router.get("/all", packageController.getAllPackages);
router.post("/add", packageController.addPackage);
router.put("/update/:packageId", packageController.updatePackage);
router.delete("/delete/:packageId", packageController.deletePackage);

router.post("/sale", packageController.recordSale);
router.get("/sales", packageController.getSales);

module.exports = router;
