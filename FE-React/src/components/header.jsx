import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/header.css";

function Header() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    setUser({});
    toast.error("Đăng xuất thành công!!");
    navigate("/login");
  };

  const fetchUserInfo = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        const user = JSON.parse(storedUser);
        setUser(user);
        console.log(user);
      } catch (error) {
        console.error("Error parsing user info from localStorage:", error);
      }
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <div className="header">
      <div className="search-bar">
        <FontAwesomeIcon icon={faSearch} />
        <input type="text" placeholder="Search or type command..." />
      </div>
      <div className="user-info">
        <div style={{display:"flex" ,flexDirection:"column"}}>
          <span> {user.username}</span>
      
          <small style={{fontStyle:"oblique",opacity:"0.5"}}>{user.role}</small>
        </div>
      
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvkE_qhrpClPaqJCkYyMx9Ot0ZsxNeKIYWf8EIXHYgzSTaT804bGgTN71cXOUXiX2-rGs&usqp=CAU"
          alt="Profile"
          style={{ width: "45px" }}
          className="default-profile"
        />
        <Button
          className="button-logout"
          variant="contained"
          color="error"
          size="small"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}

export default Header;
