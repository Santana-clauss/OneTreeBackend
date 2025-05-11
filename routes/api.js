const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Project, News, Gallery } = require("../models");
const nodemailer = require('nodemailer');

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
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
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
    fileSize: 25 * 1024 * 1024 // 5MB limit
  }
});

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: 'mail.onechildonetree.africa',
  port: 587,
  secure: false,
  auth: {
    user: 'info@onechildonetree.africa',
    pass: process.env.EMAIL_PASSWORD
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
router.put("/projects/:id/images", uploadMiddleware.array('images', 5), async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ success: false, error: "Project not found" });
    }

    const newImages = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    // Add new images to existing ones
    project.images = [...project.images, ...newImages];
    await project.save();

    res.json({ 
      success: true, 
      message: "Images uploaded successfully",
      data: project 
    });

  } catch (error) {
    // Clean up uploaded files if there's an error
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, err => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    res.status(500).json({ success: false, error: "Failed to upload images" });
  }
});
router.put("/projects/:id", uploadMiddleware.array('images', 5), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, trees } = req.body;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ success: false, error: "Project not found" });
    }

    // Update project fields if provided
    if (name) project.name = name;
    if (trees) project.trees = parseInt(trees);

    // Handle new images if any were uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      project.images = [...project.images, ...newImages];
    }

    // Save the updated project
    const updatedProject = await project.save();

    res.json({ 
      success: true, 
      message: "Project updated successfully",
      data: updatedProject 
    });

  } catch (error) {
    console.error('Update error:', error);
    // Clean up any uploaded files if there was an error
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, err => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    res.status(500).json({ 
      success: false, 
      error: "Failed to update project",
      details: error.message 
    });
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
// Add this new route after your existing project routes

router.delete("/projects/:id/images/:imageIndex", async (req, res) => {
  try {
    const { id, imageIndex } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ success: false, error: "Project not found" });
    }

    // Check if image index is valid
    if (imageIndex < 0 || imageIndex >= project.images.length) {
      return res.status(400).json({ success: false, error: "Invalid image index" });
    }

    // Get the image path to delete
    const imageToDelete = project.images[imageIndex];

    // Delete the file from filesystem
    const fullPath = path.join(__dirname, '..', imageToDelete);
    fs.unlink(fullPath, (err) => {
      if (err) console.error('Error deleting file:', err);
    });

    // Remove the image from the array
    project.images.splice(imageIndex, 1);
    await project.save();

    res.json({ 
      success: true, 
      message: "Image deleted successfully",
      data: project
    });

  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to delete image"
    });
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

// Contact form endpoint
router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "Please provide name, email and message"
      });
    }

    // Email content
    const mailOptions = {
      from: email,
      to: 'info@onechildonetree.africa',
      subject: `Contact Form Submission from ${name}`,
      text: message,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Message sent successfully"
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      error: "Failed to send message"
    });
  }
});

module.exports = router;