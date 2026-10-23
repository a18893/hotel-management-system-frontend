import { useEffect, useState, useCallback, useMemo } from "react";
import axiosClient from "@/api/axiosClient";
import { approveBooking, rejectBooking } from "@/api/bookingApi";
import { usePolling } from "@/hooks/usePolling";
import { useManagerHotelId } from "@/hooks/useManagerHotelId";
import "./ManagerBookings.css";

function ManagerBookings() {
  /*===  STATE  ===*/
  const { hotelId, loading: hotelLoading } = useManagerHotelId();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingState, setUpdatingState] = useState({
    bookingId: null,
    action: null,
  });
  const [pollingConfig, setPollingConfig] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  /*===  FORMAT DATE  ===*/
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
    } catch {
      return dateString;
    }
  };

  /*===  LOAD BOOKINGS  ===*/
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      if (!hotelId) {
        setBookings([]);
        return;
      }
      const response = await axiosClient.get(`/api/bookings/hotel/${hotelId}`);
      setBookings(response?.data?.data || []);
      setCurrentPage(1);
    } catch {
      alert("Unable to fetch bookings.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [hotelId]);

  useEffect(() => {
    if (hotelId) {
      fetchBookings();
    }
  }, [fetchBookings, hotelId]);

  /*===  UPDATE BOOKING STATUS  ===*/
  const updateStatus = async (bookingId, action) => {
    const confirmed = window.confirm(
      `Are you sure you want to ${action.toLowerCase()} this booking?`,
    );
    if (!confirmed) return;

    try {
      setUpdatingState({ bookingId, action });

      if (action === "APPROVED") await approveBooking(bookingId);
      if (action === "REJECTED" || action === "CANCELLED")
        await rejectBooking(bookingId);

      await fetchBookings();

      if (action === "APPROVED") {
        setPollingConfig({ bookingId });
      }

      alert(
        `Booking ${action === "APPROVED" ? "approved" : "rejected"} successfully!`,
      );
    } catch (error) {
      alert(error?.response?.data?.message || "Operation failed");
    } finally {
      setUpdatingState({ bookingId: null, action: null });
    }
  };

  /*===  POLLING HOOK ===*/
  usePolling(
    async () => {
      if (!pollingConfig || !hotelId) return null;

      const response = await axiosClient.get(`/api/bookings/hotel/${hotelId}`);
      const updatedBookings = response?.data?.data || [];
      setBookings(updatedBookings);

      const booking = updatedBookings.find(
        (b) => b.bookingId === pollingConfig.bookingId,
      );

      setPollingConfig(null);
      return booking;
    },
    {
      intervalMs: 3000,
      maxAttempts: 40,
      shouldStop: (booking) =>
        booking &&
        ((booking.inventoryConfirmed && booking.paymentConfirmed) ||
          booking.bookingStatus === "CONFIRMED" ||
          booking.bookingStatus === "CANCELLED" ||
          booking.refundRequested === true),
    },
  );

  /*===  STATUS LABEL ===*/
  const getStatusLabel = (status) =>
    ({
      PENDING_PAYMENT: "Pending Payment",
      APPROVAL_PENDING: "Approval Pending",
      APPROVED: "Approved",
      CONFIRMATION_IN_PROGRESS: "Confirmation In Progress",
      CONFIRMED: "Confirmed",
      CANCELLED: "Cancelled",
      REFUNDED: "Refunded",
    })[status] || status;

  const getStatusClass = (status) =>
    ({
      PENDING_PAYMENT: "status-pending",
      APPROVAL_PENDING: "status-pending",
      APPROVED: "status-approved",
      CONFIRMATION_IN_PROGRESS: "status-progress",
      CONFIRMED: "status-confirmed",
      CANCELLED: "status-cancelled",
      REFUNDED: "status-refunded",
    })[status] || "status-default";

  /*===  STATS / PAGINATION ===*/
  const stats = useMemo(
    () => ({
      total: bookings.length,
      pending: bookings.filter((b) => b.bookingStatus === "APPROVAL_PENDING")
        .length,
      confirmed: bookings.filter((b) => b.bookingStatus === "CONFIRMED").length,
      cancelled: bookings.filter((b) => b.bookingStatus === "CANCELLED").length,
    }),
    [bookings],
  );

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentBookings = bookings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(bookings.length / rowsPerPage) || 1;

  /*===  LOADING  ===*/
  if (loading || hotelLoading) {
    return (
      <div className="all-bookings-loading">
        <div className="booking-spinner"></div>
        <h2>Loading Bookings...</h2>
        <p>Please wait while we retrieve booking information.</p>
      </div>
    );
  }

  /*===  RENDER  ===*/
  return (
    <div className="all-bookings-page">
      {/* HERO */}
      <section className="all-bookings-hero">
        <div>
          <h1>Hotel Bookings</h1>
          <p>
            Monitor every reservation for your assigned hotel, approve pending
            requests, and track booking confirmations from one centralized
            dashboard.
          </p>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="booking-stats-grid">
        <div className="booking-stat-card total">
          <span>Total Bookings</span>
          <h2>{stats.total}</h2>
        </div>
        <div className="booking-stat-card pending">
          <span>Pending Approval</span>
          <h2>{stats.pending}</h2>
        </div>
        <div className="booking-stat-card confirmed">
          <span>Confirmed</span>
          <h2>{stats.confirmed}</h2>
        </div>
        <div className="booking-stat-card cancelled">
          <span>Cancelled</span>
          <h2>{stats.cancelled}</h2>
        </div>
      </section>

      {/* BOOKING TABLE */}
      <section className="booking-table-card">
        <div className="section-header">
          <div>
            <h2>Booking Management</h2>
            <p>
              View reservation status, guest information, inventory allocation
              and booking approval actions.
            </p>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="booking-table">
            <thead>
              <tr>
                <th>Hotel</th>
                <th>Hotel Name</th>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Rooms</th>
                <th>Days</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Inventory</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                currentBookings.map((b) => {
                  const canApprove = b.bookingStatus === "APPROVAL_PENDING";
                  const isUpdating = updatingState.bookingId === b.bookingId;
                  return (
                    <tr key={b.bookingId}>
                      <td>
                        <img
                          className="hotel-thumb"
                          src={
                            b.hotelImage
                              ? `${import.meta.env.VITE_API_BASE_URL}/api/hotels/image/${b.hotelImage}`
                              : "https://via.placeholder.com/80x60"
                          }
                          alt={b.hotelName}
                        />
                      </td>
                      <td>
                        <div className="hotel-name">{b.hotelName || "N/A"}</div>
                      </td>
                      <td>
                        <span className="booking-id">{b.bookingId}</span>
                      </td>
                      <td>{b.fullName}</td>
                      <td>{b.phone || "N/A"}</td>
                      <td>{formatDate(b.checkIn)}</td>
                      <td>{formatDate(b.checkOut)}</td>
                      <td>{b.totalRoom || 1}</td>
                      <td>{b.totalDays || 1}</td>
                      <td>
                        <span className="booking-amount">₹{b.totalAmount}</span>
                      </td>
                      <td>
                        <span
                          className={`status-pill ${getStatusClass(b.bookingStatus)}`}
                        >
                          {getStatusLabel(b.bookingStatus)}
                        </span>
                      </td>

                      <td>
                        {b.inventoryConfirmed ? (
                          <span className="inventory reserved">Reserved</span>
                        ) : (
                          <span className="inventory pending">Pending</span>
                        )}
                      </td>

                      <td>
                        {canApprove ? (
                          <div className="action-buttons">
                            <button
                              className="approve-btn"
                              disabled={isUpdating}
                              onClick={() =>
                                updateStatus(b.bookingId, "APPROVED")
                              }
                            >
                              {isUpdating && updatingState.action === "APPROVED"
                                ? "Approving..."
                                : "Approve"}
                            </button>

                            <button
                              className="reject-btn"
                              disabled={isUpdating}
                              onClick={() =>
                                updateStatus(b.bookingId, "REJECTED")
                              }
                            >
                              {isUpdating && updatingState.action === "REJECTED"
                                ? "Rejecting..."
                                : "Reject"}
                            </button>
                          </div>
                        ) : (
                          <span className="no-action">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="13" className="empty-table">
                    <div className="empty-state">
                      <div className="empty-icon">📅</div>
                      <h3>No Bookings Found</h3>
                      <p>
                        There are currently no reservations available for your
                        hotel.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* PAGINATION */}
      {bookings.length > rowsPerPage && (
        <div className="pagination-wrapper">
          <button
            className="btn btn-outline-primary"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </button>

          <span className="page-number">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="btn btn-outline-primary"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ManagerBookings;
