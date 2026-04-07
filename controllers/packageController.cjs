const Package = require("../models/packageModel.cjs");
const PackageSale = require("../models/packageSaleModel.cjs");
const Customer = require("../models/customerModel.cjs");

// ---- Packages CRUD ----
exports.getAllPackages = async (req, res) => {
  const packages = await Package.find({});
  res.json(packages);
};

exports.addPackage = async (req, res) => {
  try {
    const { packageId, packageName, description, price, classCount, isUnlimited } = req.body;

    const pkg = new Package({
      packageId,
      packageName,
      description,
      price,
      classCount,
      isUnlimited
    });

    await pkg.save();
    res.status(201).json({ message: "Package added", pkg });
  } catch (err) {
    res.status(500).json({ message: "Failed to add package", error: err.message });
  }
};

exports.updatePackage = async (req, res) => {
  try {
    const { packageName, description, price, classCount, isUnlimited } = req.body;

    const updated = await Package.findOneAndUpdate(
      { packageId: req.params.packageId },
      { packageName, description, price, classCount, isUnlimited },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Package not found" });

    res.json({ message: "Package updated", pkg: updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to update package", error: err.message });
  }
};

exports.deletePackage = async (req, res) => {
  try {
    const deleted = await Package.findOneAndDelete({ packageId: req.params.packageId });
    if (!deleted) return res.status(404).json({ message: "Package not found" });

    res.json({ message: "Package deleted", pkg: deleted });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete package", error: err.message });
  }
};

// ---- Sales ----
exports.recordSale = async (req, res) => {
  try {
    const { customerId, packageId } = req.body;

    const pkg = await Package.findOne({ packageId });
    const customer = await Customer.findOne({ customerId });

    if (!pkg || !customer) {
      return res.status(400).json({ message: "Invalid customer or package" });
    }

    if (pkg.isUnlimited) {
      customer.unlimitedActive = true;
      customer.unlimitedExpires = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    } else {
      customer.classBalance = (customer.classBalance || 0) + pkg.classCount;
    }

    await customer.save();

    const count = await PackageSale.countDocuments();
    const saleId = `T${String(count + 1).padStart(3, "0")}`;

    const sale = new PackageSale({
      saleId,
      customerId,
      packageId,
      pricePaid: pkg.price
    });

    await sale.save();

    res.json({ message: "Package sale recorded successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error recording sale", error: err.message });
  }
};

exports.getSales = async (req, res) => {
  const sales = await PackageSale.find({}).sort({ date: -1 });
  res.json(sales);
};
