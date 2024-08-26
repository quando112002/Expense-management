const express = require('express');
const { addExpense, getExpenses, updateExpense, deleteExpense } = require('../controllers/expenseController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/add', authMiddleware, addExpense);
router.get('/', authMiddleware, getExpenses);
router.put('/:id', authMiddleware, updateExpense);
router.delete('/:id', authMiddleware, deleteExpense);

module.exports = router;
