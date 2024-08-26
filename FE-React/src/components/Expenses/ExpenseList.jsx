import { useState, useEffect } from "react";
import axios from "axios";
import "./css/ExpenseList.css";
import Button from "@mui/material/Button";
import AddExpense from "./AddExpense";
import EditExpense from "./EditExpense";
import { formatCurrency, formatDate } from "../../Supports/Convert";
import { toast } from "react-toastify";
import { Pagination, Stack } from "@mui/material";

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }

        const response = await axios.get("http://localhost:5000/api/expenses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setExpenses(response.data);
        setError(null); // Reset error if successful
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError("Authentication error: Token might be invalid or expired.");
          // Handle logic for expired or unauthorized token
        } else {
          setError("Error fetching expenses: " + error.message);
          // Handle other errors
        }
      }
    };

    fetchExpenses();
  }, []);

  const handleAddExpense = (newExpense) => {
    setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
  };

  const handleUpdateExpense = (updatedExpense) => {
    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) =>
        expense._id === updatedExpense._id ? updatedExpense : expense
      )
    );
  };

  const handleDeleteExpense = async (expenseId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token not found");
      return;
    }

    try {
      console.log(`Deleting expense with ID: ${expenseId}`); // Log expense ID
      const response = await axios.delete(
        `http://localhost:5000/api/expenses/${expenseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setExpenses((prevExpenses) =>
          prevExpenses.filter((expense) => expense._id !== expenseId)
        );
        toast.error("Delete Expense Success!");
        setError(null); // Reset error if successful
      } else {
        console.error("Failed to delete expense", response);
        setError("Failed to delete expense");
      }
    } catch (error) {
      console.error("Error deleting expense:", error); // Log error details
      setError("Error deleting expense: " + error.message);
    }
  };

  const handleAddClick = () => {
    setShowAddForm(true);
    setShowEditForm(false);
  };

  const handleEditClick = (expense) => {
    setCurrentExpense(expense);
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setShowEditForm(false);
  };

  // Calculate the current expenses to display
  const indexOfLastExpense = currentPage * itemsPerPage;
  const indexOfFirstExpense = indexOfLastExpense - itemsPerPage;
  const currentExpenses = expenses.slice(
    indexOfFirstExpense,
    indexOfLastExpense
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="expense-list">
      <div className="expense-list-heading">List Expenses</div>
      {error && <p className="error-message">{error}</p>}
      <>
        <table className="expense-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          {expenses.length > 0 ? (
            <tbody>
              {currentExpenses.map((expense) => (
                <tr key={expense._id}>
                  <td>{expense._id}</td>
                  <td>{expense.category}</td>
                  <td>{formatCurrency(expense.amount)}</td>
                  <td>{formatDate(expense.date)}</td>
                  <td>{expense.description}</td>
                  <td>
                    <Button
                      variant="contained"
                      color="success"
                      style={{ marginRight: "5px" }}
                      onClick={() => handleEditClick(expense)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteExpense(expense._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <p className="no-expenses">No expenses found.</p>
          )}
        </table>
        <Button
          variant="contained"
          style={{ marginTop: "10px" }}
          onClick={handleAddClick}
        >
          Add New
        </Button>
        <Stack
          spacing={2}
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pagination
            count={Math.ceil(expenses.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            color="primary"
            sx={{
              "& .MuiPaginationItem-root": {
                margin: "0 -5px", // Adjust the margin as needed
              },
            }}
          />
        </Stack>
      </>
      {showAddForm && (
        <AddExpense onClose={handleCloseForm} onAddExpense={handleAddExpense} />
      )}
      {showEditForm && (
        <EditExpense
          onClose={handleCloseForm}
          expense={currentExpense}
          onUpdateExpense={handleUpdateExpense}
        />
      )}
    </div>
  );
};

export default ExpenseList;
