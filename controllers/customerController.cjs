const Customer = require("../models/customerModel.cjs");

exports.add = async (req, res) => {
  try {
    const {
      customerId,
      firstName,
      lastName,
      email,
      phone,
      senior
    } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a new customer document
    const newCustomer = new Customer({
      customerId,
      firstName,
      lastName,
      email,
      phone,
      senior,
      classBalance: 0
    });

    // Save to database
    await newCustomer.save();
    res.status(201).json({ message: "Customer added successfully", customer: newCustomer });
  } catch (err) {
    console.error("Error adding customer:", err.message);
    res.status(500).json({ message: "Failed to add customer", error: err.message });
  }
};

exports.getNextId = async (req, res) => {
  try {
    const lastCustomer = await Customer.find({})
      .sort({ customerId: -1 })
      .limit(1);

    let maxNumber = 1;
    if (lastCustomer.length > 0) {
      const lastId = lastCustomer[0].customerId;
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