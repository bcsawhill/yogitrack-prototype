const mongoose = require("mongoose");
require("../config/mongodbconn.cjs");

const packageSchema = new mongoose.Schema({
  packageId: { type: String, required: true, unique: true },
  packageName: { type: String, required: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true },
  classCount: { type: Number, required: true },
  isUnlimited: { type: Boolean, default: false }
}, { collection: "packages" });

module.exports = mongoose.model("Package", packageSchema);
