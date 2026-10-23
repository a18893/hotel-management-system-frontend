import { Navigate, useLocation } from "react-router-dom";
import {
  getStoredToken,
  decodeToken,
  isTokenExpired,
  clearStoredAuth,
} from "@/api/authApi";

function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const token = getStoredToken();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const decoded = decodeToken(token);
  if (!decoded || !decoded.role || isTokenExpired(decoded.exp)) {
    clearStoredAuth();
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(decoded.role)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
