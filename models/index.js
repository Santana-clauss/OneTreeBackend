const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  trees: {
    type: Number,
    required: true
  },
  images: [String],
}, { timestamps: true });

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  link: { type: String, required: true },
  image: { type: String, required: true },
  color: { type: String, default: "#FF6B35" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const gallerySchema = new mongoose.Schema({
  src: { type: String, required: true },
  alt: { type: String, required: true },
  caption: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Project = mongoose.model("Project", projectSchema);
const News = mongoose.model("News", newsSchema);
const Gallery = mongoose.model("Gallery", gallerySchema);

module.exports = { Project, News, Gallery };