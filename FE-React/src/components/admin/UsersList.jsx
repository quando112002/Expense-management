import { useEffect, useState } from "react";
import axios from "axios";
import UserExpenses from "./UserExpenses";
import "./UsersList.css";
import { Button } from "@mui/material";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all users from the backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users");
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(users.filter((user) => user._id !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
        setError("Failed to delete user");
      }
    }
  };

  // Handle user selection for viewing expenses
  const handleSelectUser = (userId) => {
    setSelectedUser(userId);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="users-list">
      {error && <div className="error">{error}</div>}
      <div className="expense-list">
        <h2 className="expense-list-heading">All Users</h2>
        <table className="expense-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSelectUser(user._id)}
                    style={{ marginRight: "5px" }}
                  >
                    View Expenses
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedUser && (
            <UserExpenses
              userId={selectedUser}
              onClose={() => setSelectedUser(null)}
            />
          )}
      </div>

      
    </div>
  );
};

export default UsersList;
