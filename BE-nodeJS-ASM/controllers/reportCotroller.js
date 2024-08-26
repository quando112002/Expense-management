const Expense = require('../model/Expense');
const RecurringExpense = require('../model/RecurringExpense');

// Tạo báo cáo chi tiêu
exports.getExpenseReport = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const expenses = await Expense.find({
      userId: req.user.id,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    });

    const recurringExpenses = await RecurringExpense.find({
      userId: req.user.id,
      startDate: { $lte: new Date(endDate) },
      endDate: { $gte: new Date(startDate) }
    });

    const report = {
      totalAmount: 0,
      categories: {}
    };

    expenses.forEach(expense => {
      report.totalAmount += expense.amount;
      if (!report.categories[expense.category]) {
        report.categories[expense.category] = 0;
      }
      report.categories[expense.category] += expense.amount;
    });

    recurringExpenses.forEach(recurringExpense => {
      const frequency = recurringExpense.frequency;
      let occurrences = 0;

      // Tính số lần chi phí định kỳ xuất hiện trong khoảng thời gian
      if (frequency === 'Daily') {
        occurrences = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;
      } else if (frequency === 'Weekly') {
        occurrences = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24 * 7) + 1;
      } else if (frequency === 'Monthly') {
        occurrences = (new Date(endDate).getMonth() - new Date(startDate).getMonth()) + 1;
      }

      const recurringAmount = recurringExpense.amount * occurrences;
      report.totalAmount += recurringAmount;
      if (!report.categories[recurringExpense.category]) {
        report.categories[recurringExpense.category] = 0;
      }
      report.categories[recurringExpense.category] += recurringAmount;
    });

    res.json(report);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
