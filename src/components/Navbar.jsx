import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar__container">
        {/* Brand */}
        <Link to="/" className="navbar__brand">
          Hotel Management System
        </Link>

        {/* Navigation */}
        <nav className="navbar__menu">
          <Link to="/" className="navbar__link">
            Home
          </Link>

          <Link to="/about" className="navbar__link">
            About
          </Link>

          <Link to="/contact" className="navbar__link">
            Contact
          </Link>

          {!user && (
            <>
              <Link
                to="/login"
                className="navbar__button navbar__button--success"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="navbar__button navbar__button--warning"
              >
                Register
              </Link>
            </>
          )}

          {user?.role === "CUSTOMER" && (
            <Link
              to="/customer/dashboard"
              className="navbar__button navbar__button--primary"
            >
              Dashboard
            </Link>
          )}

          {user?.role === "ADMIN" && (
            <Link
              to="/admin/dashboard"
              className="navbar__button navbar__button--primary"
            >
              Dashboard
            </Link>
          )}

          {user?.role === "MANAGER" && (
            <Link
              to="/manager/dashboard"
              className="navbar__button navbar__button--primary"
            >
              Dashboard
            </Link>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="navbar__button navbar__button--danger"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
