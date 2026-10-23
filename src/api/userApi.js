import axios from "./axiosClient";

// metadata
export const getRegistrationMetadata = () =>
  axios.get("/api/user/registration-metadata");

// register customer
export const registerCustomer = (data) =>
  axios.post("/api/user/register/customer", data);

// register internal (ADMIN only)
export const registerInternal = (data) =>
  axios.post("/api/user/register/internal", data);

// get profile
export const getMyProfile = () => axios.get("/api/user/me");

// search users (ADMIN)
export const searchUsers = (params = {}) =>
  axios.get("/api/user/search", { params });

// Get unassigned managers
export const getUnassignedManagers = () =>
  axios.get("/api/user/managers/unassigned");

// Assign hotel to manager
export const assignHotel = (userId, hotelId) =>
  axios.put(`/api/user/${userId}/assign-hotel/${hotelId}`);

// Unassign hotel
export const unassignHotel = (userId, hotelId) =>
  axios.put(`/api/user/${userId}/unassign-hotel/${hotelId}`);

// bulk delete
export const bulkDeleteUsers = (userIds) =>
  axios.delete("/api/user/bulk-delete", {
    data: { userIds },
  });
