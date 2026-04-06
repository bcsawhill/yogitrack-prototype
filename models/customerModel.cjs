const mongoose = require("mongoose");
require("../config/mongodbconn.cjs");

const customerModel = new mongoose.Schema({
    customerId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, default: "" },
    classBalance: { type: Number, default: 0 },
    senior: { type: Boolean, default: false }
}, { collection: "customer" });

module.exports = mongoose.model("Customer", customerModel);