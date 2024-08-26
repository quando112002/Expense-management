import { useEffect, useState } from "react";
import axios from "axios";
import "./UserExpenses.css";
import { Button } from "@mui/material";

// eslint-disable-next-line react/prop-types
const UserExpenses = ({ userId, onClose }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch expenses for the selected user
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/expenses${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setExpenses(response.data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        setError("Failed to fetch expenses");
      }
      setLoading(false);
    };

    fetchExpenses();
  }, [userId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="user-expenses">
      <h2 style={{textAlign:"center"}}>User Expenses</h2>
      {error && <div className="error">{error}</div>}
      <ul>
        {expenses.map((expense) => (
          <li key={expense._id}>
            <span>{expense.description}</span>
            <span>${expense.amount}</span>
            <span>{new Date(expense.date).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>
      <Button variant="contained" color="error" onClick={onClose}>
        Close
      </Button>
    </div>
  );
};

export default UserExpenses;
