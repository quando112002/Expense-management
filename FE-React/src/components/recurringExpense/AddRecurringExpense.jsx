import Button from "@mui/material/Button";
import "react-toastify/dist/ReactToastify.css";
import "./css/AddRecurringExpense.css";
import { toast } from "react-toastify";
import { useState } from "react";

// eslint-disable-next-line react/prop-types
const AddRecurringExpense = ({ onClose, onAddRecurringExpense }) => {
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [frequency, setFrequency] = useState("");
  const [errors, setErrors] = useState({});

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

    const recurringExpenseData = {
      description,
      startDate,
      endDate,
      amount,
      category,
      frequency,
    };
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:5000/api/recurringExpenses/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(recurringExpenseData),
        }
      );

      if (response.ok) {
        const newRecurringExpenseData = await response.json();
        toast.success("Expense added successfully");
        onAddRecurringExpense(newRecurringExpenseData);
        onClose();
      } else {
        const errorData = await response.json();
        console.error("Failed to add expense:", errorData.message);
        toast.error(`Failed to add expense: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while adding the expense.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="recurring-expense-form-container">
        <div className="recurring-expense-form-title">
          <h2>Add New Recurring Expense</h2>
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
          style={{width:"98.7%"}}
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className={`form-input ${errors.frequency ? "input-error" : ""}`}
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

export default AddRecurringExpense;
