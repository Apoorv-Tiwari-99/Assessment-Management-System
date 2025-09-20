// backend/routes/reports.js
const express = require('express');
const { generateReport, downloadReport } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get report data (no PDF generation)
router.post('/generate-report', protect, generateReport);

// Download PDF directly
router.get('/download-report', protect, downloadReport);

module.exports = router;