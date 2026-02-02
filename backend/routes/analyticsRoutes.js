const express = require('express');
const router = express.Router();
const { getSystemStats } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.get('/stats', protect, authorize('admin', 'manager'), getSystemStats);

module.exports = router;
