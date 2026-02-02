const express = require('express');
const router = express.Router();
const { createEvent, getEvents, deleteEvent } = require('../controllers/calendarController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', authorize('admin', 'manager'), createEvent);
router.get('/', getEvents);
router.delete('/:id', authorize('admin', 'manager'), deleteEvent);

module.exports = router;
