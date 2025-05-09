const fs = require('fs');
const path = require('path');

function copyImageToUploads(sourcePath, fileName) {
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  
  // Create uploads directory if it doesn't exist
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  const destinationPath = path.join(uploadsDir, fileName);
  
  // Copy file if it exists
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destinationPath);
    return `/uploads/${fileName}`;
  }
  
  return sourcePath; // Return original path if file doesn't exist
}

module.exports = { copyImageToUploads };