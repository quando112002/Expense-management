import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import Dashboard from "./components/dashboard/Dashboard";
import AddExpense from "./components/Expenses/AddExpense";
import EditExpense from "./components/Expenses/EditExpense";
import ExpenseList from "./components/Expenses/ExpenseList";
import Sidebar from "./components/sidebar";
import Header from "./components/header";
import Register from "./components/auth/register";
import Login from "./components/auth/login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BudgetList from "./components/budget/BudgetList";
import RecurringExpenseList from "./components/recurringExpense/recurringExpenseList";
import MonthlySummary from "./components/monthlySummary/MonthlySummary";
import ExpenseReport from "./components/report/Report";
import UsersList from "./components/admin/UsersList";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ element: Component, isAuthenticated, ...rest }) => {
  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
};


const AdminProtectedRoute = ({
  // eslint-disable-next-line react/prop-types
  element: Component,
  // eslint-disable-next-line react/prop-types
  isAuthenticated,
  ...rest
}) => {
  const role = localStorage.getItem("role"); 
  return isAuthenticated && role === "admin" ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/" /> 
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(authStatus === "true");
  }, []);

  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="app">
      {!isAuthPage && <Sidebar />}
      <div className="main-content">
        {!isAuthPage && <Header />}
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={Dashboard}
                isAuthenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/add-expense"
            element={
              <ProtectedRoute
                element={AddExpense}
                isAuthenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/edit-expense/:id"
            element={
              <ProtectedRoute
                element={EditExpense}
                isAuthenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/expenses"
            element={
              <ProtectedRoute
                element={ExpenseList}
                isAuthenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/budgets"
            element={
              <ProtectedRoute
                element={BudgetList}
                isAuthenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/recurringExpense"
            element={
              <ProtectedRoute
                element={RecurringExpenseList}
                isAuthenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/monthlySummary"
            element={
              <ProtectedRoute
                element={MonthlySummary}
                isAuthenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute
                element={ExpenseReport}
                isAuthenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute
                element={UsersList}
                isAuthenticated={isAuthenticated}
              />
            }
          />
        </Routes>
        <ToastContainer />
      </div>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
