import { useEffect, useState } from "react";
import { formatCurrency, formatDate } from "../../Supports/Convert";
import { toast } from "react-toastify";
import { Button, Pagination, Stack } from "@mui/material";
import axios from "axios";
import AddRecurringExpense from "./AddRecurringExpense";
import EditRecurringExpense from "./EditRecurringExpense";
import "../Expenses/css/ExpenseList.css";

const RecurringExpenseList = () => {
  const [recurringExpenses, setRecurringExpense] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentRecurringExpense, setCurrentRecurringExpense] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page

  useEffect(() => {
    const fetchRecurringExpense = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }

        const response = await axios.get("http://localhost:5000/api/recurringExpenses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRecurringExpense(response.data);
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

    fetchRecurringExpense();
  }, []);

  const handleAddRecurringExpense = (newExpense) => {
    setRecurringExpense((prevExpenses) => [...prevExpenses, newExpense]);
  };

  const handleUpdateRecurringExpense = (updatedRecurringExpense) => {
    setRecurringExpense((prevRecurringExpenses) =>
      prevRecurringExpenses.map((recurringExpense) =>
        recurringExpense._id === updatedRecurringExpense._id ? updatedRecurringExpense : recurringExpense
      )
    );
  };

  const handleDeleteRecurringExpense = async (recurringExpenseId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token not found");
      return;
    }

    try {
      console.log(`Deleting RecurringExpense with ID: ${recurringExpenseId}`); // Log expense ID
      const response = await axios.delete(
        `http://localhost:5000/api/recurringExpenses/${recurringExpenseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setRecurringExpense((prevRecurringExpenses) =>
          prevRecurringExpenses.filter((recurringExpense) => recurringExpense._id !== recurringExpenseId)
        );
        toast.error("Delete RecurringExpense Success!");
        setError(null); // Reset error if successful
      } else {
        console.error("Failed to delete RecurringExpense", response);
        setError("Failed to delete RecurringExpense");
      }
    } catch (error) {
      console.error("Error deleting RecurringExpense:", error); // Log error details
      setError("Error deleting RecurringExpense: " + error.message);
    }
  };

  const handleAddClick = () => {
    setShowAddForm(true);
    setShowEditForm(false);
  };

  const handleEditClick = (recurringExpense) => {
    setCurrentRecurringExpense(recurringExpense);
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
  const currentRecurringExpenses = recurringExpenses.slice(indexOfFirstExpense, indexOfLastExpense);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="expense-list">
      <div className="expense-list-heading">List Recurring Expenses</div>
      {error && <p className="error-message">{error}</p>}
      
        <>
          <table className="expense-table">
            <thead>
              <tr>
                
                <th>Category</th>
                <th>Amount</th>
                <th>Start date</th>
                <th>End date</th>
                <th>Frequency</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            {recurringExpenses.length > 0 ? (
            <tbody>
           
              {currentRecurringExpenses.map((recurringExpense) => (
                <tr key={recurringExpense._id}>
                  
                  <td>{recurringExpense.category}</td>
                  <td>{formatCurrency(recurringExpense.amount)}</td>
                  <td>{formatDate(recurringExpense.startDate)}</td>
                  <td>{formatDate(recurringExpense.endDate)}</td>
                  <td>{recurringExpense.frequency}</td>
                  <td>{recurringExpense.description}</td>
                  <td>
                    <Button
                      variant="contained"
                      color="success"
                      style={{ marginRight: "5px" }}
                      onClick={() => handleEditClick(recurringExpense)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteRecurringExpense(recurringExpense._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
           
            </tbody>
          ) : (
            <p className="no-expenses">No Recurring expenses found.</p>
          )}
          </table>
          <Button
            variant="contained"
            style={{ marginTop: "10px" }}
            onClick={handleAddClick}
          >
            Add New
          </Button>
          <Stack spacing={2} style={{ marginTop: "5px", justifyContent: "center", alignItems: "center" }}>
            <Pagination
              count={Math.ceil(recurringExpenses.length / itemsPerPage)}
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
        <AddRecurringExpense onClose={handleCloseForm} onAddRecurringExpense={handleAddRecurringExpense} />
      )}
      {showEditForm && (
        <EditRecurringExpense
          onClose={handleCloseForm}
          recurringExpense={currentRecurringExpense}
          onUpdateRecurringExpense={handleUpdateRecurringExpense}
        />
      )}
    </div>
  );
};

export default RecurringExpenseList;
