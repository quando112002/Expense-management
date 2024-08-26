import { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import { toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/AddExpense.css";

const EditExpense = ({ expense, onClose, onUpdateExpense }) => {
 
  const [description, setDescription] = useState(expense.description || "");
  const [date, setDate] = useState(
    expense.date ? new Date(expense.date).toISOString().split("T")[0] : ""
  );
  const [amount, setAmount] = useState(expense.amount || "");
  const [category, setCategory] = useState(expense.category || "");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Token not found");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/expenses/${expense._id}`,
        {
          description,
          date,
          amount,
          category,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        onUpdateExpense(response.data);
        toast.success("Update expense Success!!")
        onClose();
      } else {
        setError("Failed to update expense");
      }
    } catch (error) {
      console.error("Error updating expense:", error);
      if (error.response && error.response.status === 401) {
        setError("Authentication error: Token might be invalid or expired.");
      } else if (error.response && error.response.status === 400) {
        setError("Invalid input data");
      } else if (error.response && error.response.status === 403) {
        setError("Unauthorized to update this expense");
      } else if (error.response && error.response.status === 404) {
        setError("Expense not found");
      } else {
        setError("Error updating expense: " + error.message);
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="form-container">
        <div className="form-title">
          <h2>Edit Expense</h2>
        </div>
        <form onSubmit={handleSubmit} style={{marginTop:'15px'}}>
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="form-input"
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="form-input"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="form-input"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="form-input"
          />
          {error && <p className="error-message">{error}</p>}
          <div className="form-buttons">
            <Button
              type="submit"
              variant="contained"
              color="success"
              style={{ marginRight: "10px" }}
            >
              Submit
            </Button>
            <Button
              type="button"
              variant="contained"
              color="error"
              style={{ marginRight: "9px" }}
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpense;
