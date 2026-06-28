const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const { startSession, submitAnswers } = require('../controllers/interviewController');

const upload = multer({ dest: 'uploads/' });

router.post('/start', protect, upload.single('resume'), startSession);
router.post('/submit', protect, submitAnswers);

module.exports = router;