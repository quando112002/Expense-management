import { useState, useEffect } from 'react';
import axios from 'axios';

// eslint-disable-next-line react/prop-types
const ExpenseTrends = ({ userId, startDate, endDate }) => {
  const [trends, setTrends] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await axios.get('http://localhost:5000/expense-trends', {
          params: { userId, startDate, endDate },
        });
        setTrends(response.data);
      } catch (err) {
        setError(err.message);
      }
    };
    
    fetchTrends();
  }, [userId, startDate, endDate]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!Object.keys(trends).length) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Expense Trends</h2>
      <ul>
        {Object.entries(trends).map(([period, amount]) => (
          <li key={period}>{period}: ${amount}</li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseTrends;
