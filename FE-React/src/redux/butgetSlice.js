import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  budgets: [],
  error: null,
};

const budgetSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    setBudgets(state, action) {
      state.budgets = action.payload;
    },
    addBudget(state, action) {
      state.budgets.push(action.payload);
    },
    updateBudget(state, action) {
      state.budgets = state.budgets.map(budget =>
        budget._id === action.payload._id ? action.payload : budget
      );
    },
    deleteBudget(state, action) {
      state.budgets = state.budgets.filter(budget => budget._id !== action.payload);
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setBudgets, addBudget, updateBudget, deleteBudget, setError } = budgetSlice.actions;

export default budgetSlice.reducer;

// Thunk for fetching budgets
export const fetchBudgets = () => async dispatch => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token not found');
    
    const response = await axios.get('http://localhost:5000/api/budgets', {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    dispatch(setBudgets(response.data));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

// Thunk for adding a budget
export const addBudgetThunk = (budgetData) => async dispatch => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token not found');
    
    const response = await axios.post('http://localhost:5000/api/budgets/add', budgetData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    dispatch(addBudget(response.data));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

// Thunk for updating a budget
export const updateBudgetThunk = (budgetId, budgetData) => async dispatch => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token not found');
    
    const response = await axios.put(`http://localhost:5000/api/budgets/${budgetId}`, budgetData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    dispatch(updateBudget(response.data));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

// Thunk for deleting a budget
export const deleteBudgetThunk = (budgetId) => async dispatch => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token not found');
    
    await axios.delete(`http://localhost:5000/api/budgets/${budgetId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    dispatch(deleteBudget(budgetId));
  } catch (error) {
    dispatch(setError(error.message));
  }
};
