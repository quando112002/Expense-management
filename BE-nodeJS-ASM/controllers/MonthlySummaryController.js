const MonthlySummary = require("../model/MonthlySummary");


const RecurringExpense = require("../model/RecurringExpense");
const Expense = require("../model/Expense");
const Budget = require("../model/Budget");

const getMonthlySummary = async (req, res) => {
  const { userId, month, year } = req.query;

  console.log(`Request received - userId: ${userId}, month: ${month}, year: ${year}`);

  // Ensure parameters are provided
  if (!userId || !month || !year) {
    return res.status(400).json({ error: "Missing required query parameters" });
  }

  const trimmedUserId = userId.trim();
  const trimmedMonth = parseInt(month.trim(), 10);
  const trimmedYear = parseInt(year.trim(), 10);

  try {
    // Fetch expenses for the month
    const expenses = await Expense.find({
      userId: trimmedUserId,
      date: {
        $gte: new Date(trimmedYear, trimmedMonth - 1, 1),
        $lt: new Date(trimmedYear, trimmedMonth, 1),
      },
    });

    // Fetch budget for the month
    const budgets = await Budget.find({
      userId: trimmedUserId,
      month: trimmedMonth,
      year: trimmedYear,
    });

    // Fetch recurring expenses
    const recurringExpenses = await RecurringExpense.find({
      userId: trimmedUserId,
      startDate: { $lte: new Date(trimmedYear, trimmedMonth, 0) }, // Ngày kết thúc của tháng
      endDate: { $gte: new Date(trimmedYear, trimmedMonth - 1, 1) } // Ngày đầu tiên của tháng
    });

    // Calculate total expenses and category breakdown
    let totalExpenses = 0;
    const categoryBreakdown = {};

    expenses.forEach((expense) => {
      totalExpenses += expense.amount;
      if (!categoryBreakdown[expense.category]) {
        categoryBreakdown[expense.category] = 0;
      }
      categoryBreakdown[expense.category] += expense.amount;
    });

    // Calculate recurring expenses
    let totalRecurringExpenses = 0;
    recurringExpenses.forEach((recurringExpense) => {
      totalRecurringExpenses += recurringExpense.amount;
      if (!categoryBreakdown[recurringExpense.category]) {
        categoryBreakdown[recurringExpense.category] = 0;
      }
      categoryBreakdown[recurringExpense.category] += recurringExpense.amount;
    });

    // Calculate total budget
    let totalBudget = 0;
    budgets.forEach((budget) => {
      totalBudget += budget.amount;
    });

    const remainingBudget = totalBudget - totalExpenses - totalRecurringExpenses;

    res.json({
      month: trimmedMonth,
      year: trimmedYear,
      totalExpenses,
      totalRecurringExpenses,
      totalBudget,
      remainingBudget,
      categoryBreakdown,
      userId: trimmedUserId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getExpenseTrends = async (req, res) => {
  const { userId, startDate, endDate } = req.query;

  try {
    // Fetch expenses in the given date range
    const expenses = await Expense.find({
      userId,
      date: {
        $gte: new Date(startDate),
        $lt: new Date(endDate),
      },
    });

    // Group expenses by month
    const trends = {};
    expenses.forEach((expense) => {
      const month = expense.date.getMonth() + 1;
      const year = expense.date.getFullYear();
      const key = `${month}-${year}`;

      if (!trends[key]) {
        trends[key] = 0;
      }
      trends[key] += expense.amount;
    });

    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getExpenseTrends,
  getMonthlySummary,
};
