const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Set up storage engine for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Store images in the 'uploads' directory
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    // Use the original file name with timestamp for uniqueness
    const fileName = `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, fileName);
  }
});

// Multer file filter (optional, to restrict file types to images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// Configure multer to handle image uploads
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size 5MB
});

const saveFile = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject('No file uploaded');
    }

    const filePath = path.join(__dirname, '../uploads', file.filename);
    fs.exists(filePath, (exists) => {
      if (exists) {
        resolve({ fileName: file.filename, filePath });
      } else {
        reject('File not saved');
      }
    });
  });
};

module.exports = { upload, saveFile };