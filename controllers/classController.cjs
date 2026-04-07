const Class = require("../models/classModel.cjs");
const Instructor = require("../models/instructorModel.cjs");

exports.getAll = async (req, res) => {
  const classes = await Class.find({});
  res.json(classes);
};

exports.getNextId = async (req, res) => {
  const last = await Class.find({}).sort({ classId: -1 }).limit(1);
  let next = 1;

  if (last.length > 0) {
    const match = last[0].classId.match(/\d+$/);
    if (match) next = parseInt(match[0]) + 1;
  }

  const classId = `C${String(next).padStart(3, "0")}`;
  res.json({ classId });
};

exports.add = async (req, res) => {
  try {
    const newClass = new Class(req.body);
    await newClass.save();
    res.json({ message: "Class added", class: newClass });
  } catch (err) {
    res.status(500).json({ message: "Failed to add class", error: err.message });
  }
};

exports.getOne = async (req, res) => {
  const cls = await Class.findOne({ classId: req.params.classId });
  res.json(cls);
};

exports.update = async (req, res) => {
  const updated = await Class.findOneAndUpdate(
    { classId: req.params.classId },
    req.body,
    { new: true }
  );
  res.json({ message: "Class updated", class: updated });
};

exports.delete = async (req, res) => {
  const deleted = await Class.findOneAndDelete({ classId: req.params.classId });
  res.json({ message: "Class deleted", class: deleted });
};
