import { useState } from "react";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/AddExpense.css";

// eslint-disable-next-line react/prop-types
const AddExpense = ({ onClose, onAddExpense }) => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!description) newErrors.description = "Description is required";
    if (!date) newErrors.date = "Date is required";
    if (!amount || isNaN(amount) || amount <= 0 || amount< 1000) newErrors.amount = "Amount must be a positive number and greater than 1000đ ";
    if (!category) newErrors.category = "Category is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const expenseData = { description, date, amount, category };
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/expenses/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(expenseData),
      });

      if (response.ok) {
        const newExpense = await response.json();
        toast.success("Expense added successfully");
        onAddExpense(newExpense);
        onClose();
      } else {
        console.error("Failed to add expense");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="form-container">
        <div className="form-title">
          <h2>Add New Expense</h2>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: '15px' }}>
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            
            className={`form-input ${errors.category ? "input-error" : ""}`}
          />
          {errors.category && <span className="error-message">{errors.category}</span>}
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
           
            className={`form-input ${errors.amount ? "input-error" : ""}`}
          />
          {errors.amount && <span className="error-message">{errors.amount}</span>}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          
            className={`form-input ${errors.date ? "input-error" : ""}`}
          />
          {errors.date && <span className="error-message">{errors.date}</span>}
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
         
            className={`form-input ${errors.description ? "input-error" : ""}`}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
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

export default AddExpense;
