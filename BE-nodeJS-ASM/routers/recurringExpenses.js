const express = require('express');
const { addRecurringExpense, getRecurringExpenses, updateRecurringExpense, deleteRecurringExpense } = require('../controllers/recurringExpenseController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/add', authMiddleware, addRecurringExpense);
router.get('/', authMiddleware, getRecurringExpenses);
router.put('/:id', authMiddleware, updateRecurringExpense);
router.delete('/:id', authMiddleware, deleteRecurringExpense);

module.exports = router;
