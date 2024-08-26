import { BarChart } from "@mui/x-charts";
import TransactionTable from "./transactionTable";
import "../css/spendingPlan.css";

function SpendingPlan() {
  const dataset = [
    { month: "Jan", sumExpenses: 560000 },
    { month: "Feb", sumExpenses: 380000 },
    { month: "Mar", sumExpenses: 150000 },
    { month: "Apr", sumExpenses: 800000 },
    { month: "May", sumExpenses: 200000 },
    { month: "Jun", sumExpenses: 600000 },
    { month: "Jul", sumExpenses: 310000 },
    { month: "Aug", sumExpenses: 475000 },
    { month: "Sep", sumExpenses: 40 },
    { month: "Oct", sumExpenses: 50 },
    { month: "Nov", sumExpenses: 30 },
    { month: "Dec", sumExpenses: 20 },
  ];

  const chartSetting = {
    yAxis: [
      {
        label: "",
        tickSize: 2, // Thay đổi kích thước của các tick nếu cần
        tickPadding: 0,
        marginLeft:"20px" // Thêm padding để tạo không gian cho nhãn
      },
    ],
    series: [
      { dataKey: "sumExpenses", label: "Expenses Monthly", color: "#5e8cef" },
    ],
    height: 300,
    sx: {
      [`& .MuiCharts-Axis-directionY .MuiCharts-Axis-label`]: {
        transform: "translateX(15px)", // Tăng thêm khoảng cách cho nhãn trục Y
      },
    },
  };

  return (
    <div className="spending-plan">
      <div className="spending-header">
        <div className="income">
          <h3>Income after bills & savings</h3>
          <p>$6,788.21</p>
        </div>
        <div className="planned-spending">
          <h3>Planned Spending</h3>
          <p>$0,000</p>
        </div>
        <div className="other-spending">
          <h3>Other Spending</h3>
          <p>$1,531.54</p>
        </div>
      </div>
      <div className="spending-chart">
        <BarChart
          style={{ marginLeft: "50px" }} // Increased margin for better layout
          dataset={dataset}
          xAxis={[
            {
              scaleType: "band",
              dataKey: "month",
              label: "Month",
              tickSize: 10,
              tickMargin: 10,
            },
          ]}
          {...chartSetting}
        />
      </div>

      <TransactionTable />
    </div>
  );
}

export default SpendingPlan;
