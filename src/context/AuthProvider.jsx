import { useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  getStoredToken,
  setStoredToken,
  clearStoredAuth,
  decodeToken,
  isTokenExpired,
} from "@/api/authApi";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = getStoredToken();
    if (!token) return null;

    const decoded = decodeToken(token);
    if (!decoded || isTokenExpired(decoded.exp)) {
      clearStoredAuth();
      return null;
    }

    return {
      userId: decoded.sub,
      role: decoded.role,
      hotelId: decoded.hotelId ?? null,
      tokenExp: decoded.exp,
    };
  });

  const login = (data) => {
    const token = data.jwtToken;
    setStoredToken(token);

    const decoded = decodeToken(token);
    setUser({
      userId: decoded.sub,
      role: decoded.role,
      hotelId: decoded.hotelId ?? null,
      tokenExp: decoded.exp,
    });
  };

  const logout = () => {
    clearStoredAuth();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
