// components/sidebar.js

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faExchangeAlt,
  faClipboard,
  faCreditCard,
  faList,
  faChartLine,
  faUser,

} from "@fortawesome/free-solid-svg-icons";
import "../css/Sidebar.css";
import { Link } from "react-router-dom";

function Sidebar() {
  const role = localStorage.getItem('role'); // Get the user's role from local storage

  return (
    <div className="sidebar">
      <Link to="/">
        <div className="Name-logo">
          <img
            src="https://png.pngtree.com/png-clipart/20231101/original/pngtree-icethemed-letter-q-icon-in-a-font-style-presented-on-a-plain-picture-image_13223004.png"
            alt=""
            width="40px"
            height="40px"
          />
          <div className="logo">QuikFin</div>
        </div>
      </Link>
      <hr />
      <ul>
        <Link to="/">
          <li>
            <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
          </li>
        </Link>
        <Link to="/expenses">
          <li>
            <FontAwesomeIcon icon={faClipboard} /> Expenses
          </li>
        </Link>
        <Link to="/budgets">
          <li>
            <FontAwesomeIcon icon={faCreditCard} /> Budget
          </li>
        </Link>
        <Link to="/recurringExpense">
          <li>
            <FontAwesomeIcon icon={faList} /> Recurring expense
          </li>
        </Link>
        <Link to="/monthlySummary">
          <li>
            <FontAwesomeIcon icon={faExchangeAlt} /> Monthly summary
          </li>
        </Link>
        <Link to="/reports">
          <li>
            <FontAwesomeIcon icon={faChartLine} /> Reports
          </li>
        </Link>
        {/* Conditionally render User Management for admin users */}
        {role === 'admin' && (
          <Link to="/admin">
            <li>
              <FontAwesomeIcon icon={faUser} /> User management
            </li>
          </Link>
        )}
     
      </ul>
    </div>
  );
}

export default Sidebar;
