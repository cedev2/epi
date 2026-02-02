const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { createHomework, getHomework, deleteHomework } = require('../controllers/homeworkController');
const { protect, authorize } = require('../middleware/auth');

// Ensure directory exists
const uploadDir = 'uploads/homework/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.use(protect);

router.post('/', authorize('teacher', 'admin'), upload.single('file'), createHomework);
router.get('/', getHomework);
router.delete('/:id', authorize('teacher', 'admin'), deleteHomework);

module.exports = router;
