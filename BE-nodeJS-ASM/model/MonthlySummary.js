const mongoose = require('mongoose');

const MonthlySummarySchema = new mongoose.Schema({
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  totalExpenses: {
    type: Number,
    required: true,
  },
  remainingBudget: {
    type: Number,
    required: true,
  },
  categoryBreakdown: {
    type: Map,
    of: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('MonthlySummary', MonthlySummarySchema);
