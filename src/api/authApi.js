import { jwtDecode } from "jwt-decode";
import axios from "@/api/axiosClient";

export const loginUser = (loginData) => {
  return axios.post("/api/auth/login", loginData);
};

// --- token/localStorage helpers ---
export function getStoredToken() {
  return localStorage.getItem("token");
}

export function setStoredToken(token) {
  localStorage.setItem("token", token);
}

export function clearStoredAuth() {
  localStorage.clear();
}

export function decodeToken(token) {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}

export function isTokenExpired(exp) {
  if (!exp) return true;
  return exp * 1000 < Date.now();
}
