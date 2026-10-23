import axios from "@/api/axiosClient";

const API_BASE_URL = "/api/hotels";

// Create Hotel
export const createHotel = (formData) => {
  return axios.post(`${API_BASE_URL}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Get Hotel by ID
export const getHotelById = (hotelId) => {
  return axios.get(`${API_BASE_URL}/${hotelId}`);
};

// Get All Hotels
export const getAllHotels = () => {
  return axios.get(`${API_BASE_URL}`);
};

// Get Hotel Cards (with filters)
export const getHotelCards = (params = {}) => {
  return axios.get(`${API_BASE_URL}/cards`, { params });
};

// Get Hotels by Location
export const getHotelsByLocation = (locationId) => {
  return axios.get(`${API_BASE_URL}/locations/${locationId}`);
};

// Assign Manager
export const assignManager = (hotelId, userId) => {
  return axios.put(`${API_BASE_URL}/${hotelId}/assign-manager/${userId}`);
};

// Unassign Manager
export const unassignManager = (hotelId, userId) => {
  return axios.put(`${API_BASE_URL}/${hotelId}/unassign-manager/${userId}`);
};

// Delete Hotel
export const deleteHotel = (hotelId) => {
  return axios.delete(`${API_BASE_URL}/${hotelId}`);
};

// Search Hotels
export const searchHotels = (params) => {
  return axios.get(`${API_BASE_URL}/search`, { params });
};

export const getHotelImage = (imageName) => {
  if (!imageName) return "/vite.svg";

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  return `${API_BASE}/api/hotels/image/${imageName}`;
};
