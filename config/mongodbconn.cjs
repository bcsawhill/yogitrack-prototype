const mongoose = require("mongoose");

const uri = const uri = process.env.MONGO_URI || "mongodb://localhost/yogidb";

mongoose.connect(uri)
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => {
  console.error("❌ MongoDB connection error:", err.message);
});

module.exports =  mongoose;