const Expense = require('../model/Expense');

exports.addExpense = async (req, res) => {
  try {
    const { description, amount, category, date } = req.body;
    const expense = new Expense({ description, amount, category, date, userId: req.user.id });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id });
    res.json(expenses);
  } catch (err) {
    res.status(400).send(err.message);
    console.error(err.message);
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).send('Expense not found');
    if (expense.userId.toString() !== req.user.id) return res.status(403).send('Unauthorized');
    
    Object.assign(expense, req.body);
    await expense.save();
    res.json(expense);
  } catch (err) {
    res.status(400).send(err.message);
  }
};


exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).send('Expense not found');
    if (expense.userId.toString() !== req.user.id) return res.status(403).send('Unauthorized');

    await Expense.deleteOne({ _id: req.params.id });
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(400).send(err.message);
  }
};