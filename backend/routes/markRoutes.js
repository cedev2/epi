const express = require('express');
const router = express.Router();
const { submitMarks, getStudentMarks, getClassRankings } = require('../controllers/markController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/submit', authorize('teacher'), submitMarks);
router.get('/rankings', authorize('admin', 'manager', 'teacher', 'student'), getClassRankings);
router.get('/student', authorize('admin', 'manager', 'teacher', 'student'), getStudentMarks);
router.get('/student/:studentId', authorize('admin', 'manager', 'teacher', 'student'), getStudentMarks);

module.exports = router;
