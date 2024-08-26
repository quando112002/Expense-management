import Button from "@mui/material/Button";
import "./css/AddBudget.css";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { addBudgetThunk } from "../../redux/butgetSlice";

// eslint-disable-next-line react/prop-types
const AddBudget = ({ onClose }) => {
  const dispatch = useDispatch();
  const [description, setDescription] = useState("");
  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!description) newErrors.description = "Description is required";
    if (!month || month < 1 || month > 12) newErrors.month = "Month should be between 1 and 12";
    if (!amount || isNaN(amount) || amount <= 0) newErrors.amount = "Amount must be a positive number";
    if (!category) newErrors.category = "Category is required";
    if (!year || year < 2020 || year > 2030) newErrors.year = "Year should be between 2020 and 2030";
    return newErrors;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const budgetData = { category, amount, month, year, description };

    try {
      await dispatch(addBudgetThunk(budgetData));
      toast.success("Budget added successfully");
      onClose();
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="form-container">
        <div className="form-title">
          <h2>Add New Budget</h2>
        </div>
        <form onSubmit={handleAdd} style={{ marginTop: "15px" }}>
          <input
            type="text"
            placeholder="Category"
            className={`form-input ${errors.category ? "input-error" : ""}`}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          {errors.category && <span className="error-message">{errors.category}</span>}
          <input
            type="number"
            placeholder="Amount"
            className={`form-input ${errors.amount ? "input-error" : ""}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {errors.amount && <span className="error-message">{errors.amount}</span>}
          <input
            type="number"
            placeholder="Month"
            className={`form-input ${errors.month ? "input-error" : ""}`}
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            min="1"
            max="12"
          />
          {errors.month && <span className="error-message">{errors.month}</span>}
          <input
            type="number"
            placeholder="Year"
            className={`form-input ${errors.year ? "input-error" : ""}`}
            value={year}
            onChange={(e) => setYear(e.target.value)}
            min="2020"
            max="2030"
          />
          {errors.year && <span className="error-message">{errors.year}</span>}
          <input
            type="text"
            placeholder="Description"
            className={`form-input ${errors.description ? "input-error" : ""}`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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

export default AddBudget;
