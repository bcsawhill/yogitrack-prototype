const mongoose = require("mongoose");
require("../config/mongodbconn.cjs");

const instructorModel = new mongoose.Schema({
    instructorId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, default: "" },
    pref: { type: String, default: "email" }
}, { collection: "instructor" });

module.exports = mongoose.model("Instructor", instructorModel);