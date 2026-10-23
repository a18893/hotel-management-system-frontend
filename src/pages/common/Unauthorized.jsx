import "./Unauthorized.css";
import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-page">
      <div className="unauthorized-card">
        <div className="unauthorized-icon">
          <FaLock />
        </div>

        <h1>403</h1>

        <h2>Access Denied</h2>

        <p>
          Sorry, you don't have permission to access this page. Please contact
          the administrator if you believe this is an error.
        </p>

        <div className="unauthorized-buttons">
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Go to Home
          </button>

          <button
            className="btn btn-outline-primary"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;
