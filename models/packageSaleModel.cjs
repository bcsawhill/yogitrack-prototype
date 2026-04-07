const mongoose = require("mongoose");
require("../config/mongodbconn.cjs");

const packageSaleSchema = new mongoose.Schema({
  saleId: { type: String, required: true, unique: true },
  customerId: { type: String, required: true },
  packageId: { type: String, required: true },
  date: { type: Date, default: Date.now },
  pricePaid: { type: Number, required: true }
}, { collection: "packageSales" });

module.exports = mongoose.model("PackageSale", packageSaleSchema);
