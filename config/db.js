const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

function connectToDatabase() {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err);
      process.exit(1);
    });
}

module.exports = { connectToDatabase };
