const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const Image = require('../models/Image');

// Set storage options for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Ensure the directory exists
        cb(null, './public/data/uploads/');
    },
    filename: function (req, file, cb) {
        // Generate a unique filename to avoid name collisions
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // preserve original file extension
    }
});

// Multer setup to handle file uploads
const upload = multer({ storage: storage });

router.post('/upload', upload.single('uploaded_file'), async(req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        console.log("Uploaded file:", req.file.originalname)
        console.log("Form data:", req.body);

        const savedImage = await Image.create({url: req.file.path, fileName: req.file.originalname})

        // Send file path back to frontend
        res.status(201).json({
            message: 'File uploaded successfully!',
            image: savedImage
        });
    } catch (error) {
        console.error('Error during file upload:', error);
        res.status(500).json({ message: 'Error during file upload', error });
    }
});

module.exports = router;
