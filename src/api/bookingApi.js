import axios from "@/api/axiosClient";

export const createBooking = (data) => axios.post("/api/bookings", data);

// My bookings
export const getMyBookings = () => axios.get("/api/bookings/me");

// Admin - all bookings
export const getAllBookings = () => axios.get("/api/bookings");

// Get booking by ID
export const getBookingById = (bookingId) =>
  axios.get(`/api/bookings/${bookingId}`);

// Manager - hotel bookings
export const getHotelBookings = (hotelId) =>
  axios.get(`/api/bookings/hotel/${hotelId}`);

// Approve booking
export const approveBooking = (bookingId) =>
  axios.patch(`/api/bookings/${bookingId}/approve`);

// Reject booking
export const rejectBooking = (bookingId) =>
  axios.patch(`/api/bookings/${bookingId}/reject`);

// Get statuses
export const getBookingStatuses = () => axios.get("/api/bookings/statuses");
