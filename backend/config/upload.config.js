const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDirs = ['./uploads/covers', './uploads/books'];
uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Storage configuration for book covers
const coverStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/covers');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'cover-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Storage configuration for book files (PDF/EPUB)
const bookStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/books');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'book-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter for images
const imageFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (JPEG, JPG, PNG, WEBP) are allowed!'));
    }
};

// File filter for books
const bookFilter = (req, file, cb) => {
    const allowedTypes = /pdf|epub/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/epub+zip';

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF and EPUB files are allowed!'));
    }
};

// Multer upload instances
const uploadCover = multer({
    storage: coverStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit for images
    fileFilter: imageFilter
});

const uploadBook = multer({
    storage: bookStorage,
    limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024 }, // 50MB default
    fileFilter: bookFilter
});

module.exports = {
    uploadCover,
    uploadBook
};
