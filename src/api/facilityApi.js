import axios from "@/api/axiosClient";

const API_BASE_URL = "/api/facilities/";

export const addFacility = (data) => {
  return axios.post(API_BASE_URL, data);
};

export const getAllFacilities = () => {
  return axios.get(API_BASE_URL);
};

export const getFacilitiesByHotel = (hotelId) => {
  return axios.get(`${API_BASE_URL}${hotelId}`);
};

export const addFacilityToHotel = (hotelId, data) => {
  return axios.post(`${API_BASE_URL}${hotelId}`, data);
};

export const removeFacilityFromHotel = (hotelId, facilityId) => {
  return axios.delete(`${API_BASE_URL}${hotelId}/facilities/${facilityId}`);
};
