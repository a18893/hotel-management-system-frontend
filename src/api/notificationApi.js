import axios from "@/api/axiosClient";

// Get logged-in user notifications
export const getMyNotifications = () => axios.get("/api/notifications/user");

// Admin search by email
export const getNotificationsByEmail = (email) =>
  axios.get(`/api/notifications/by-email?email=${email}`);

// Get notification by ID
export const getNotificationById = (id) =>
  axios.get(`/api/notifications/${id}`);
