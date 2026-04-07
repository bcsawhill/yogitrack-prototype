const mongoose = require("mongoose");
require("../config/mongodbconn.cjs");

const classSchema = new mongoose.Schema({
  classId: { type: String, required: true, unique: true },

  dayOfWeek: { type: String, required: true },   // Sunday, Monday, etc.
  time: { type: String, required: true },        // "9AM", "4PM"

  className: { type: String, required: true },
  description: { type: String, default: "" },

  instructorId: { type: String, required: true }
}, { collection: "classes" });

module.exports = mongoose.model("Class", classSchema);
