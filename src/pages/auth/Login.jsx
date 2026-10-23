import "./Login.css";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  getStoredToken,
  decodeToken,
  clearStoredAuth,
} from "@/api/authApi";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const redirectByRole = (role) => {
    const roleRedirectMap = {
      ADMIN: "/admin/dashboard",
      MANAGER: "/manager/dashboard",
      CUSTOMER: "/customer/dashboard",
    };
    return roleRedirectMap[role] || "/";
  };

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      const decoded = decodeToken(token);
      if (decoded?.role) {
        navigate(redirectByRole(decoded.role));
      } else {
        clearStoredAuth();
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ emailId: email, password });
      const data = response.data.data;
      login(data);
      alert("Login successful");

      const decoded = decodeToken(data.jwtToken);
      navigate(redirectByRole(decoded?.role));
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <section className="form-page login-page">
      <div className="form-card login-card">
        <h2 className="form-title">Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="form-button">
            Login
          </button>
        </form>
      </div>
    </section>
  );
}

export default Login;
