const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require('path');
const { connectToDatabase } = require("./config/db");
const apiRoutes = require("./routes/api");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to database
connectToDatabase();

// Routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Add after your existing middleware setup
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});