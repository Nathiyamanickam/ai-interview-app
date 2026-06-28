const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createReport, getUserReports } = require('../controllers/reportController');

router.post('/create', protect, createReport);
router.get('/my', protect, getUserReports);

module.exports = router;