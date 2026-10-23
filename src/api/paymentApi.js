import axios from "./axiosClient";

export const processPayment = (data) =>
  axios.post("/api/payment/process", data);

export const confirmPayment = (
  paymentId,
  gatewayReferenceId,
  verificationToken,
) =>
  axios.post(
    `/api/payment/${paymentId}/confirm?gatewayReferenceId=${gatewayReferenceId}&verificationToken=${verificationToken}`,
  );

export const cancelPayment = (paymentId) =>
  axios.post(`/api/payment/cancel/${paymentId}`);

export const refundPayment = (paymentId) =>
  axios.post(`/api/payment/refund/${paymentId}`);

export const getPaymentById = (paymentId) =>
  axios.get(`/api/payment/${paymentId}`);

export const getPaymentStatusByBookingId = (bookingId) =>
  axios.get(`/api/payment/status/${bookingId}`);
