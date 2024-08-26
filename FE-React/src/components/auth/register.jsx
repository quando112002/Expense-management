import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css"; 

const Register = ({ onRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInput()) return;
    try {
      const response = await axios.post(
        `http://localhost:5000/api/auth/register`,
        { username, password, role }
      );

      if (response && response.data) {
        const { token, user } = response.data;

        localStorage.setItem("role", role);
        localStorage.setItem("token", token);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isAuthenticated", "true");

        onRegister(); // Gọi callback sau khi đăng nhập thành công
        navigate("/"); // Chuyển hướng sau khi đăng nhập thành công
        toast.success("Đăng ký thành công!");
      } else {
        console.error("Invalid server response:", response);
        toast.error(
          "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin đăng nhập."
        );
      }
    } catch (error) {
      console.error(
        "Đăng ký thất bại:",
        error.response ? error.response.data : error.message
      );
      toast.error(
        error.response && error.response.data
          ? error.response.data.message
          : "Đăng ký thất bại. Vui lòng thử lại sau."
      );
    }
  };

  const validateInput = () => {
    if (username.length < 3) {
      toast.error("Tên đăng nhập phải có ít nhất 3 ký tự.");
      return false;
    }
    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự.");
      return false;
    }
    setError("");
    return true;
  };

  return (
    <div className="backgroung-img">
      <div className="login-form-container">
        <h2 className="login-heading">Quản lí chi tiêu</h2>
        <form className="register-form" onSubmit={(e) => handleSubmit(e)}>
          <h2 className="register-title">Đăng ký</h2>

          <input
            className="register-input"
            type="text"
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="register-input"
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            className="register-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">Người dùng</option>
            <option value="admin">Quản trị viên</option>
          </select>
          {error && <p className="register-error">{error}</p>}
          <div className="block-button">
            <button className="register-button" type="submit">
              Đăng ký
            </button>
            <div className="block-button-item">
              <p>Already have an account? </p>
              <Link to="/login" className="block-button-item-link">
                Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

Register.propTypes = {
  onRegister: PropTypes.func,
};

Register.defaultProps = {
  onRegister: () => {},
};

export default Register;
