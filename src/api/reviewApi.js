import axios from "./axiosClient";

// Add Review
export const addReview = (hotelId, data) =>
  axios.post(`/api/hotels/reviews?hotelId=${hotelId}`, data);

// Get Reviews (paginated)
export const getReviews = (hotelId, page = 0, size = 10) =>
  axios.get(`/api/hotels/reviews?hotelId=${hotelId}&page=${page}&size=${size}`);

// Delete Review (ADMIN)
export const deleteReview = (reviewId) =>
  axios.delete(`/api/hotels/reviews/${reviewId}`);

// Get Rating Stats
export const getRatingStats = (hotelId) =>
  axios.get(`/api/hotels/reviews/stats?hotelId=${hotelId}`);

export const getAllReviews = (page = 0, size = 20) =>
  axios.get(`/api/hotels/reviews/admin?page=${page}&size=${size}`);
