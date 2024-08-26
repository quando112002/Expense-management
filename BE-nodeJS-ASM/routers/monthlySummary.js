const express = require('express');
const { getMonthlySummary, getExpenseTrends } = require('../controllers/MonthlySummaryController');
const router = express.Router();

router.get('/monthly-summary', getMonthlySummary);
router.get('/expense-trends', getExpenseTrends);

module.exports = router;
