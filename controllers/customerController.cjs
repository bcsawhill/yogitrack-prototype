const Customer = require("../models/customerModel.cjs");

exports.add = async (req, res) => {
  try {
    const {
      customerId,
      firstName,
      lastName,
      email,
      phone,
      address,
      classBalance,
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
      address,
      classBalance,
      senior
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

exports.search = async (req, res) => {
  const q = req.query.q || "";

  const results = await Customer.find({
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
  const customer = await Customer.findOne({ customerId: req.params.customerId });
  res.json(customer);
};

exports.update = async (req, res) => {
  const updated = await Customer.findOneAndUpdate(
    { customerId: req.params.customerId },
    req.body,
    { new: true }
  );

  res.json({ message: "Updated", customer: updated });
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Customer.findOneAndDelete({
      customerId: req.params.customerId
    });

    if (!deleted) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({ message: "Customer deleted", customer: deleted });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete customer", error: err.message });
  }
};