import "./css/BudgetList.css";
import Button from "@mui/material/Button";
import { formatCurrency } from "../../Supports/Convert";
import { useEffect, useState } from "react";
import AddBudget from "./AddBudget";
import EditBudget from "./EditBudget";
import { useSelector, useDispatch } from "react-redux";
import { fetchBudgets, deleteBudgetThunk } from "../../redux/butgetSlice";
import { toast } from "react-toastify";
import { Pagination, Stack } from "@mui/material";

const BudgetList = () => {
  const dispatch = useDispatch();
  const budgets = useSelector(state => state.budgets.budgets);
  const error = useSelector(state => state.budgets.error);
  
  const [showFormAdd, setShowFormAdd] = useState(false);
  const [showFormEdit, setShowFormEdit] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchBudgets());
  }, [dispatch]);


  const handleUpdateBudget = () => {
   
  };

  const handleDeleteBudget = (budgetId) => {
    dispatch(deleteBudgetThunk(budgetId))
      .then(() => {
        toast.success("Budget deleted successfully!");
      })
      .catch(() => {
        toast.error("Error deleting budget");
      });
  };

  const handleAddClick = () => {
    setShowFormAdd(true);
    setShowFormEdit(false);
  };

  const handleCloseForm = () => {
    setShowFormAdd(false);
    setShowFormEdit(false);
  };

  const handleEditClick = (budget) => {
    setCurrentBudget(budget);
    setShowFormEdit(true);
    setShowFormAdd(false);
  };

  const indexOfLastBudget = currentPage * itemsPerPage;
  const indexOfFirstBudget = indexOfLastBudget - itemsPerPage;
  const currentBudgets = budgets.slice(indexOfFirstBudget, indexOfLastBudget);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="expense-list">
      <div className="expense-list-heading">List Budget</div>
      {error && <p className="error-message">{error}</p>}
      <>
        <table className="expense-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Month</th>
              <th>Year</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          {budgets.length > 0 ? (
            <tbody>
              {currentBudgets.map((budget) => (
                <tr key={budget._id}>
                  <td>{budget._id}</td>
                  <td>{budget.category}</td>
                  <td>{formatCurrency(budget.amount)}</td>
                  <td>{budget.month}</td>
                  <td>{budget.year}</td>
                  <td>{budget.description}</td>
                  <td>
                    <Button
                      variant="contained"
                      color="success"
                      style={{ marginRight: "5px" }}
                      onClick={() => handleEditClick(budget)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteBudget(budget._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <p className="no-expenses">No budgets found.</p>
          )}
        </table>
        <Button
          variant="contained"
          style={{ marginTop: "10px" }}
          onClick={handleAddClick}
        >
          Add New
        </Button>
        <Stack spacing={1} style={{ marginTop: "10px", alignItems: "center" }}>
          <Pagination
            count={Math.ceil(budgets.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": {
                margin: "0 -6px",
              },
            }}
          />
        </Stack>
      </>
      {showFormAdd && (
        <AddBudget onClose={handleCloseForm} />
      )}
      {showFormEdit && (
        <EditBudget
          onClose={handleCloseForm}
          budget={currentBudget}
          onUpdateBudget={handleUpdateBudget}
        />
      )}
    </div>
  );
};

export default BudgetList;
