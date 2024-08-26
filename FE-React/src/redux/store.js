import { configureStore } from '@reduxjs/toolkit';
import budgetReducer from './butgetSlice';

const store = configureStore({
  reducer: {
    budgets: budgetReducer,
  },
});

export default store;
