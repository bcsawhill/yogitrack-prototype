const Instructor = require("../models/instructorModel.cjs");

exports.add = async (req, res) => {
  try {
    const {
      instructorId,
      firstName,
      lastName,
      email,
      phone,
      address,
      pref
    } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a new instructor document
    const newInstructor = new Instructor({
      instructorId,
      firstName,
      lastName,
      email,
      phone,
      address,
      pref
    });

    // Save to database
    await newInstructor.save();
    res.status(201).json({ message: "Instructor added successfully", instructor: newInstructor });
  } catch (err) {
    console.error("Error adding instructor:", err.message);
    res.status(500).json({ message: "Failed to add instructor", error: err.message });
  }
};

exports.getNextId = async (req, res) => {
  try {
    const lastInstructor = await Instructor.find({})
      .sort({ instructorId: -1 })
      .limit(1);

    let maxNumber = 1;
    if (lastInstructor.length > 0) {
      const lastId = lastInstructor[0].instructorId;
      const match = lastId.match(/\d+$/);
      if (match) {
        maxNumber = parseInt(match[0]) + 1;
      }
    }
    const nextId = `Y${String(maxNumber).padStart(3, "0")}`;
    res.json({ nextId });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.search = async (req, res) => {
  const q = req.query.q || "";

  const results = await Instructor.find({
    $or: [
      { firstName: new RegExp(q, "i") },
      { lastName: new RegExp(q, "i") },
      { email: new RegExp(q, "i") },
      { phone: new RegExp(q, "i") }
    ]
  });

  res.json(results);
};

exports.getOne = async (req, res) => {
  const instructor = await Instructor.findOne({ instructorId: req.params.instructorId });
  res.json(instructor);
};

exports.update = async (req, res) => {
  const updated = await Instructor.findOneAndUpdate(
    { instructorId: req.params.instructorId },
    req.body,
    { new: true }
  );

  res.json({ message: "Updated", instructor: updated });
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Instructor.findOneAndDelete({
      instructorId: req.params.instructorId
    });

    if (!deleted) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    res.json({ message: "Instructor deleted", instructor: deleted });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete instructor", error: err.message });
  }
};