const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadSyllabus, getSyllabi, deleteSyllabus } = require('../controllers/syllabusController');
const { protect, authorize } = require('../middleware/auth');

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/syllabi/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    }
});

router.use(protect);

router.post('/upload', authorize('teacher', 'admin'), upload.single('file'), uploadSyllabus);
router.get('/', getSyllabi);
router.delete('/:id', authorize('teacher', 'admin'), deleteSyllabus);

module.exports = router;
