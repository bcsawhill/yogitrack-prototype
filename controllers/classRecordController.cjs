const ClassRecord = require("../models/classRecordModel.cjs");

exports.getAll = async (req, res) => {
  const records = await ClassRecord.find({});
  res.json(records);
};

exports.getNextId = async (req, res) => {
  const last = await ClassRecord.find({}).sort({ recordId: -1 }).limit(1);
  let next = 1;

  if (last.length > 0) {
    const match = last[0].recordId.match(/\d+$/);
    if (match) next = parseInt(match[0]) + 1;
  }

  const recordId = `R${String(next).padStart(3, "0")}`;
  res.json({ recordId });
};

exports.add = async (req, res) => {
  try {
    const newRecord = new ClassRecord(req.body);
    await newRecord.save();
    res.json({ message: "Class record saved", record: newRecord });
  } catch (err) {
    res.status(500).json({ message: "Failed to save record", error: err.message });
  }
};
