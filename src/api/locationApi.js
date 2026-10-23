import axios from "@/api/axiosClient";

const API_BASE_URL = "/api/locations/";

// Add Location
export const addLocation = (data) => {
  return axios.post(API_BASE_URL, data);
};

// Get All Locations
export const getAllLocations = () => {
  return axios.get(API_BASE_URL);
};
