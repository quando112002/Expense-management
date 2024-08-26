const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
const app = express();
const cors = require('cors');
connectDB();

app.use(express.json());
app.use(cors());

const authRouter = require('./routers/auth');
const budgetsRouter = require('./routers/budgets');
const expensesRouter = require('./routers/expenses');
const recurringExpensesRouter = require('./routers/recurringExpenses');
const reportsRouter = require('./routers/report');
const adminRouter = require('./routers/admin');
const summaryRouter = require('./routers/monthlySummary');

app.use('/api/auth', authRouter);
app.use('/api/budgets', budgetsRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/recurringExpenses', recurringExpensesRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/admin', adminRouter);
app.use(summaryRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
