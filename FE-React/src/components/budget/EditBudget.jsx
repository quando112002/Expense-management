import Button from "@mui/material/Button";
import "./css/AddBudget.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateBudgetThunk } from "../../redux/butgetSlice";
import { toast } from "react-toastify";

// eslint-disable-next-line react/prop-types
const EditBudget = ({ budget, onClose }) => {
  const dispatch = useDispatch();
  const [description, setDescription] = useState(budget.description || "");
  const [category, setCategory] = useState(budget.category || "");
  const [amount, setAmount] = useState(budget.amount || "");
  const [month, setMonth] = useState(budget.month || "");
  const [year, setYear] = useState(budget.year || "");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Token not found");
      return;
    }

    if (!category || !amount || !month || !year || !description) {
      setError("All fields are required");
      return;
    }

    try {
      await dispatch(updateBudgetThunk(budget._id, { description, month, year, amount, category }));
      toast.success("Budget updated successfully!");
      onClose();
    } catch (error) {
      setError("Error updating budget");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="form-container">
        <div className="form-title">
          <h2>Edit Budget</h2>
        </div>
        <form onSubmit={handleSubmit} style={{ marginTop: "15px" }}>
          <input
            type="text"
            placeholder="Category"
            required
            className="form-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            required
            className="form-input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            type="number"
            placeholder="Month"
            required
            className="form-input"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
          <input
            type="number"
            placeholder="Year"
            required
            className="form-input"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            required
            className="form-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {error && <p className="error-message">{error}</p>}
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

export default EditBudget;
