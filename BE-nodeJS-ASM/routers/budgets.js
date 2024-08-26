const express = require('express');
const { addBudget, getBudgets, updateBudget, deleteBudget } = require('../controllers/budgetController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/add', authMiddleware, addBudget);
router.get('/', authMiddleware,getBudgets);
router.put('/:id', authMiddleware, updateBudget);
router.delete('/:id', authMiddleware, deleteBudget);

module.exports = router;
