const RecurringExpense = require('../model/RecurringExpense');

exports.addRecurringExpense = async (req, res) => {
  try {
    const { description, amount, category, startDate, endDate, frequency } = req.body;
    const recurringExpense = new RecurringExpense({ description, amount, category, startDate, endDate, frequency, userId: req.user.id });
    await recurringExpense.save();
    res.status(201).json(recurringExpense);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.getRecurringExpenses = async (req, res) => {
  try {
    const recurringExpenses = await RecurringExpense.find({ userId: req.user.id });
    res.json(recurringExpenses);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.updateRecurringExpense = async (req, res) => {
  try {
    const recurringExpense = await RecurringExpense.findById(req.params.id);
    if (!recurringExpense) return res.status(404).send('Recurring Expense not found');
    if (recurringExpense.userId.toString() !== req.user.id) return res.status(403).send('Unauthorized');
    
    Object.assign(recurringExpense, req.body);
    await recurringExpense.save();
    res.json(recurringExpense);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.deleteRecurringExpense = async (req, res) => {
  try {
    const recurringExpense = await RecurringExpense.findById(req.params.id);
    if (!recurringExpense) return res.status(404).send('Recurring Expense not found');
    if (recurringExpense.userId.toString() !== req.user.id) return res.status(403).send('Unauthorized');

    await recurringExpense.deleteOne({ _id: req.params.id });
    res.json({ message: 'Recurring Expense deleted' });
  } catch (err) {
    res.status(400).send(err.message);
  }
};
