import { useState, useEffect } from "react";
import axios from "axios";
import { PieChart } from "@mui/x-charts/PieChart";
import "./MonthlySummaryForm.css";


const MonthlySummaryForm = () => {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [chartVisible, setChartVisible] = useState(false);

  const userId = localStorage.getItem("userId");

  
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-indexed month
  const currentYear = currentDate.getFullYear();

  const fetchSummary = async () => {
    if (!userId) {
      setError("User not authenticated. Please log in again.");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:5000/monthly-summary",
        {
          params: { userId, month: currentMonth, year: currentYear },
        }
      );
      setSummary(response.data);
      setError(null);
      setChartVisible(false); // Hide chart initially
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch summary on component mount
  useEffect(() => {
    fetchSummary();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const chartData = summary
    ? Object.entries(summary.categoryBreakdown).map(([category, value]) => ({
        id: category,
        label: category,
        value,
      }))
    : [];

  useEffect(() => {
    if (summary) {
      const timer = setTimeout(() => setChartVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [summary]);

  return (
    <div className="summary-form-container">
      <h2 className="summary-form-title" style={{textAlign:"center"}}>Monthly Summary</h2>
      
      {error && <p className="error-message">Error: {error}</p>}
      {summary && (
        <div className="summary-results">
          <h3 className="summary-results-title">
            Summary for {currentMonth}/{currentYear}
          </h3>
          <table className="summary-table">
            <thead>
              <tr>
                <td>Total Expenses:</td>
                <td>Total Recurring Expenses:</td>
                <td>Total Budget:</td>
                <td>Remaining Budget:</td>
              </tr>
            </thead>
            <tbody>
              <tr key="">
                <td>{summary.totalExpenses.toLocaleString()} VNĐ</td>
                <td>{summary.totalRecurringExpenses.toLocaleString()} VNĐ</td>
                <td>{summary.totalBudget.toLocaleString()} VNĐ</td>
                <td>{summary.remainingBudget.toLocaleString()} VNĐ</td>
              </tr>
            </tbody>
          </table>
          <h2 className="summary-chart-title">Expense Chart</h2>
          <div className={`chart-container ${chartVisible ? "visible" : ""}`}>
            <div className="chart">
              <PieChart
                series={[
                  {
                    data: chartData,
                  },
                ]}
                width={400}
                height={250}
                margin={{ right: 200, bottom: 20 }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlySummaryForm;
