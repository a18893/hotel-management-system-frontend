import { useEffect, useState, useCallback, useMemo } from "react";
import {
  getAllBookings,
  approveBooking,
  rejectBooking,
} from "@/api/bookingApi";
import { usePolling } from "@/hooks/usePolling";
import "./AllBookings.css";

function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingState, setUpdatingState] = useState({
    bookingId: null,
    action: null,
  });
  const [pollingConfig, setPollingConfig] = useState(null);

  // ==== FORMAT DATE ====
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  // ==== LOAD BOOKINGS ====
  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllBookings();
      setBookings(res?.data?.data || []);
    } catch {
      alert("Unable to fetch bookings.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ==== UPDATE STATUS ===
  const updateStatus = async (bookingId, status) => {
    const confirmed = window.confirm(
      `Are you sure you want to ${status.toLowerCase()} this booking?`,
    );
    if (!confirmed) return;

    try {
      setUpdatingState({ bookingId, action: status });

      if (status === "APPROVED") {
        await approveBooking(bookingId);
      }
      if (status === "CANCELLED" || status === "REJECTED") {
        await rejectBooking(bookingId);
      }

      await fetchAll();

      if (status === "APPROVED") {
        setPollingConfig({ bookingId });
      }

      alert(`Booking ${status.toLowerCase()} successfully!`);
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          `Failed to ${status.toLowerCase()} booking.`,
      );
    } finally {
      setUpdatingState({ bookingId: null, action: null });
    }
  };

  // ==== POLLING HOOK ====
  usePolling(
    async () => {
      if (!pollingConfig) return null;

      const res = await getAllBookings();
      const updatedBookings = res?.data?.data || [];
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

  // ==== STATUS HELPERS ===
  const getStatusLabel = (status) => {
    switch (status) {
      case "PENDING_PAYMENT":
        return "Pending Payment";
      case "APPROVAL_PENDING":
        return "Approval Pending";
      case "APPROVED":
        return "Approved";
      case "CONFIRMATION_IN_PROGRESS":
        return "Confirmation In Progress";
      case "CONFIRMED":
        return "Confirmed";
      case "CANCELLED":
        return "Cancelled";
      case "REFUNDED":
        return "Refunded";
      default:
        return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING_PAYMENT":
      case "APPROVAL_PENDING":
        return "status-pending";
      case "APPROVED":
        return "status-approved";
      case "CONFIRMATION_IN_PROGRESS":
        return "status-progress";
      case "CONFIRMED":
        return "status-confirmed";
      case "CANCELLED":
        return "status-cancelled";
      case "REFUNDED":
        return "status-refunded";
      default:
        return "status-default";
    }
  };

  // ==== DASHBOARD STATS ====
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

  // ==== LOADING ====
  if (loading) {
    return (
      <div className="all-bookings-loading">
        <div className="booking-spinner"></div>
        <h2>Loading Bookings...</h2>
        <p>Please wait while we retrieve all booking information.</p>
      </div>
    );
  }
  return (
    <div className="all-bookings-page">
      {/* === HERO === */}
      <section className="all-bookings-hero">
        <div>
          <h1>All Bookings</h1>

          <p>
            Monitor every reservation across the platform, approve pending
            requests, and keep track of booking confirmations in real time.
          </p>
        </div>
      </section>

      {/* ===  STATISTICS === */}
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

      {/* === TABLE CARD === */}
      <section className="booking-table-card">
        <div className="section-header">
          <div>
            <h2>Booking Management</h2>

            <p>
              View booking status, reservation progress, inventory allocation
              and approval actions.
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
                bookings.map((b) => {
                  const canApprove = b.bookingStatus === "APPROVAL_PENDING";

                  const isUpdating = updatingState.bookingId === b.bookingId;

                  return (
                    <tr key={b.bookingId}>
                      {/* HOTEL IMAGE */}

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

                      {/* HOTEL */}

                      <td>
                        <div className="hotel-name">{b.hotelName || "N/A"}</div>
                      </td>

                      {/* BOOKING */}

                      <td>
                        <span className="booking-id">{b.bookingId}</span>
                      </td>

                      {/* CUSTOMER */}

                      <td>{b.fullName}</td>

                      {/* PHONE */}

                      <td>{b.phone || "N/A"}</td>

                      {/* CHECK IN */}

                      <td>{formatDate(b.checkIn)}</td>

                      {/* CHECK OUT */}

                      <td>{formatDate(b.checkOut)}</td>

                      {/* ROOMS */}

                      <td>{b.totalRoom || 1}</td>

                      {/* DAYS */}

                      <td>{b.totalDays || 1}</td>

                      {/* AMOUNT */}

                      <td>
                        <span className="booking-amount">₹{b.totalAmount}</span>
                      </td>

                      {/* STATUS */}

                      <td>
                        <span
                          className={`status-pill ${getStatusClass(
                            b.bookingStatus,
                          )}`}
                        >
                          {getStatusLabel(b.bookingStatus)}
                        </span>
                      </td>

                      {/* INVENTORY */}

                      <td>
                        {b.inventoryConfirmed ? (
                          <span className="inventory reserved">Reserved</span>
                        ) : (
                          <span className="inventory pending">Pending</span>
                        )}
                      </td>

                      {/* ACTION */}

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
                                updateStatus(b.bookingId, "CANCELLED")
                              }
                            >
                              {isUpdating &&
                              updatingState.action === "CANCELLED"
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
                        There are currently no bookings available in the system.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AllBookings;
