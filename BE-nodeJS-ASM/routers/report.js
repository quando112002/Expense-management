const express = require('express');
const { getExpenseReport } = require('../controllers/reportCotroller');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// Endpoint để lấy báo cáo chi tiêu
router.get('', getExpenseReport);

module.exports = router;
