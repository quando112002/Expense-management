import Button from "@mui/material/Button";
import "react-toastify/dist/ReactToastify.css";
import "./css/AddRecurringExpense.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";

const EditRecurringExpense = ({
  recurringExpense,
  onClose,
  onUpdateRecurringExpense,
}) => {
  const [description, setDescription] = useState(
    recurringExpense.description || ""
  );
  const [startDate, setStartDate] = useState(
    recurringExpense.startDate
      ? new Date(recurringExpense.startDate).toISOString().split("T")[0]
      : ""
  );
  const [endDate, setEndDate] = useState(
    recurringExpense.endDate
      ? new Date(recurringExpense.endDate).toISOString().split("T")[0]
      : ""
  );
  const [amount, setAmount] = useState(recurringExpense.amount || "");
  const [category, setCategory] = useState(recurringExpense.category || "");
  const [frequency, setFrequency] = useState(recurringExpense.frequency || "");
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!description) newErrors.description = "Description is required";
    if (!startDate) newErrors.startDate = "Start date is required";
    if (!endDate) newErrors.endDate = "End date is required";
    if (isNaN(amount) || amount <= 0 || amount < 1000)
      newErrors.amount =
        "Amount must be a positive number and greater than 1000đ ";
    if (!category) newErrors.category = "Category is required";
    if (!frequency) newErrors.frequency = "Frequency is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Token not found");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/recurringExpenses/${recurringExpense._id}`,
        {
          description,
          startDate,
          endDate,
          amount,
          category,
          frequency,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        onUpdateRecurringExpense(response.data);
        toast.success("Expense updated successfully!");
        onClose();
      } else {
        setError("Failed to update expense");
      }
    } catch (error) {
      console.error("Error updating expense:", error);
      setError("An error occurred while updating the expense.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="recurring-expense-form-container">
        <div className="recurring-expense-form-title">
          <h2>Edit Recurring Expense</h2>
        </div>

        <form onSubmit={handleSubmit} className="recurring-expense-form">
          <div className="recurring-expense-form-group">
            <div className="recurring-expense-form-column">
              <label>Category</label>
              <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`form-input ${errors.category ? "input-error" : ""}`}
              />
              {errors.category && (
                <span className="error-message">{errors.category}</span>
              )}
            </div>
            <div className="recurring-expense-form-column">
              <label>Amount</label>
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`form-input ${errors.amount ? "input-error" : ""}`}
              />
              {errors.amount && (
                <span className="error-message">{errors.amount}</span>
              )}
            </div>
          </div>
          <div className="recurring-expense-form-group">
            <div className="recurring-expense-form-column">
              <label>Start date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`form-input ${
                  errors.startDate ? "input-error" : ""
                }`}
              />
              {errors.startDate && (
                <span className="error-message">{errors.startDate}</span>
              )}
            </div>
            <div className="recurring-expense-form-column">
              <label>End date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`form-input ${errors.endDate ? "input-error" : ""}`}
              />
              {errors.endDate && (
                <span className="error-message">{errors.endDate}</span>
              )}
            </div>
          </div>

          <label>Frequency</label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className={`form-input ${errors.frequency ? "input-error" : ""}`}
            style={{width:"98.7%"}}
          >
            <option value="" disabled>
              Select frequency
            </option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
          {errors.frequency && (
            <span className="error-message">{errors.frequency}</span>
          )}

          <label>Description</label>
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`form-input ${errors.description ? "input-error" : ""}`}
          />
          {errors.description && (
            <span className="error-message">{errors.description}</span>
          )}

          {error && <span className="error-message">{error}</span>}

          <div className="form-buttons">
            <Button type="submit" variant="contained" color="success">
              Submit
            </Button>
            <Button
              type="button"
              variant="contained"
              color="error"
              onClick={onClose}
              style={{ marginRight: "10px" }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRecurringExpense;
