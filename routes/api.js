const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Project, News, Gallery } = require("../models");

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Projects routes

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename if a file with the same name exists
    let filename = file.originalname;
    let counter = 1;
    
    while (fs.existsSync(path.join('uploads', filename))) {
      const ext = path.extname(file.originalname);
      const nameWithoutExt = path.basename(file.originalname, ext);
      filename = `${nameWithoutExt}(${counter})${ext}`;
      counter++;
    }
    
    cb(null, filename);
  }
});

// Configure file filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const uploadMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Projects routes
router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch projects" });
  }
});

router.post("/projects", uploadMiddleware.array('images', 5), async (req, res) => {
  try {
    const { name, trees } = req.body;
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    const project = new Project({
      name,
      trees: parseInt(trees),
      images,
    });
    await project.save();
    res.json({ success: true, data: project });
  } catch (error) {
    // Delete uploaded files if database operation fails
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, err => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    res.status(500).json({ success: false, error: "Failed to create project" });
  }
});

router.put("/projects/:id", uploadMiddleware.array('images', 5), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, trees } = req.body;
    const newImages = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, error: "Project not found" });
    }

    project.name = name || project.name;
    project.trees = trees ? parseInt(trees) : project.trees;
    project.images = newImages.length > 0 ? [...project.images, ...newImages] : project.images;
    
    await project.save();
    res.json({ success: true, data: project });
  } catch (error) {
    // Delete uploaded files if database operation fails
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, err => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    res.status(500).json({ success: false, error: "Failed to update project" });
  }
});

router.delete("/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    
    if (project && project.images) {
      // Delete associated image files
      project.images.forEach(imagePath => {
        const fullPath = path.join(__dirname, '..', imagePath);
        fs.unlink(fullPath, err => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    
    await Project.findByIdAndDelete(id);
    res.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete project" });
  }
});
router.delete("/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Project.findByIdAndDelete(id);
    res.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete project" });
  }
});
//gallery
router.get("/gallery", async (req, res) => {
  try {
    const gallery = await Gallery.find()
      .sort({ createdAt: -1 })  // Sort by creation date, newest first
      .exec();
    res.json({ success: true, data: gallery });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch gallery items" });
  }
});

// News routes
router.get("/news", async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch news" });
  }
});

router.post("/news", uploadMiddleware.single('image'), async (req, res) => {
  try {
    const { title, excerpt, link, color } = req.body;
    const image = req.file ? req.file.path : '';
    const newsItem = new News({
      title,
      excerpt,
      link,
      image,
      color,
    });
    await newsItem.save();
    res.json({ success: true, data: newsItem });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to create news item" });
  }
});

router.put("/news/:id", uploadMiddleware.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, excerpt, link, color } = req.body;
    const newImage = req.file ? req.file.path : undefined;
    const newsItem = await News.findById(id);
    if (!newsItem) {
      return res.status(404).json({ success: false, error: "News item not found" });
    }
    newsItem.title = title || newsItem.title;
    newsItem.excerpt = excerpt || newsItem.excerpt;
    newsItem.link = link || newsItem.link;
    newsItem.color = color || newsItem.color;
    if (newImage) newsItem.image = newImage;
    await newsItem.save();
    res.json({ success: true, data: newsItem });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update news item" });
  }
});

router.delete("/news/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await News.findByIdAndDelete(id);
    res.json({ success: true, message: "News item deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete news item" });
  }
});

// Gallery routes
router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find()
      .sort({ _id: 1 })  // Sort by _id in ascending order to get oldest first
      .exec();
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch projects" });
  }
});

router.post("/gallery", uploadMiddleware.single('src'), async (req, res) => {
  try {
    const { alt, caption } = req.body;
    const src = req.file ? req.file.path : '';
    const galleryItem = new Gallery({
      src,
      alt,
      caption,
    });
    await galleryItem.save();
    res.json({ success: true, data: galleryItem });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to create gallery item" });
  }
});

router.delete("/gallery/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Gallery.findByIdAndDelete(id);
    res.json({ success: true, message: "Gallery item deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete gallery item" });
  }
});

module.exports = router;