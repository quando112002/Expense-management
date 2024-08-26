const Budget = require('../model/Budget');

exports.addBudget = async (req, res) => {
  try {
    const { category, amount, month, year, description } = req.body;
    const budget = new Budget({
      category,
      amount,
      month,
      year,
      description,
      userId: req.user.id
    });
    await budget.save();
    res.status(201).json(budget);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id });
    res.json(budgets);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).send('Budget not found');
    }
    if (budget.userId.toString() !== req.user.id) {
      return res.status(403).send('Unauthorized');
    }
    
    Object.assign(budget, req.body);
    await budget.save();
    res.json(budget);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).send('Budget not found');
    }
    if (budget.userId.toString() !== req.user.id) {
      return res.status(403).send('Unauthorized');
    }

    await budget.deleteOne({ _id: req.params.id });
    res.json({ message: 'Budget deleted' });
  } catch (err) {
    res.status(400).send(err.message);
  }
};
