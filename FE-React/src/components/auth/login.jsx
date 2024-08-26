import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

// eslint-disable-next-line react/prop-types
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { username, password }
      );

      if (response && response.data) {
        const { token ,user} = response.data;


        // Lưu thông tin vào localStorage
        localStorage.setItem("token", token);
        localStorage.setItem('role', user.role);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem('userId', user.id);
        localStorage.setItem("isAuthenticated", "true");
        
        onLogin(); // Gọi callback sau khi đăng nhập thành công
        navigate("/"); // Chuyển hướng sau khi đăng nhập thành công
        toast.success("Đăng nhập thành công!");
      } else {
        console.error("Invalid server response:", response);
        toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.");
      toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.");
    }
  };

  return (
    <>
      <div className="backgroung-img">
        <div className="login-form-container">
          <h2 className="login-heading">Quản lí chi tiêu</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <h2 className="login-title">Login</h2>

            <input
              className="login-input"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              className="login-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="login-error">{error}</p>}
            <div className="block-button">
              <button className="register-button" type="submit">
                Submit
              </button>
              <div className="block-button-item">
                <p>No account? </p>
                <Link to="/register" className="block-button-item-link">
                  Register
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
