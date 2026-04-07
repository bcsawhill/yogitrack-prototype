const mongoose = require("mongoose");
require("../config/mongodbconn.cjs");

const classRecordSchema = new mongoose.Schema({
  recordId: { type: String, required: true, unique: true },
  classId: { type: String, required: true },
  instructorId: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  attendees: { type: [String], default: [] }
}, { collection: "classRecords" });

module.exports = mongoose.model("ClassRecord", classRecordSchema);
