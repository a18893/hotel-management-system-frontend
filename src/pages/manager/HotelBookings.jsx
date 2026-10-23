import { useEffect, useState, useCallback } from "react";
import {
  getHotelBookings,
  approveBooking,
  rejectBooking,
} from "../../api/bookingApi";
import "./HotelBookings.css";

function HotelBookings({ hotelId }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingState, setUpdatingState] = useState({
    bookingId: null,
    action: null,
  });

  /*===  FETCH BOOKINGS  ===*/

  const fetchBookings = useCallback(async () => {
    try {
      const res = await getHotelBookings(hotelId);
      setBookings(res?.data?.data || []);
    } catch {
      alert("Unable to fetch bookings.");
    } finally {
      setLoading(false);
    }
  }, [hotelId]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  /*===  APPROVE BOOKING  ===*/

  const handleApprove = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this booking?",
    );

    if (!confirmed) return;

    try {
      setUpdatingState({ bookingId, action: "APPROVED" });
      await approveBooking(bookingId);
      alert("Booking approved successfully!");
      const pollBooking = async () => {
        try {
          const res = await getHotelBookings(hotelId);
          const updatedBookings = res?.data?.data || [];
          setBookings(updatedBookings);
          const booking = updatedBookings.find(
            (b) => b.bookingId === bookingId,
          );

          if (
            booking?.bookingStatus === "CONFIRMED" &&
            booking?.inventoryConfirmed === true
          ) {
            setUpdatingState({ bookingId: null, action: null });
            return;
          }

          setTimeout(pollBooking, 2000);
        } catch {
          setUpdatingState({ bookingId: null, action: null });
        }
      };

      pollBooking();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to approve booking.");
      setUpdatingState({ bookingId: null, action: null });
    }
  };

  /*===  REJECT BOOKING  ===*/

  const handleReject = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this booking?",
    );

    if (!confirmed) return;

    try {
      setUpdatingState({ bookingId, action: "REJECTED" });
      await rejectBooking(bookingId);
      await fetchBookings();
      alert("Booking rejected successfully!");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to reject booking.");
    } finally {
      setUpdatingState({
        bookingId: null,
        action: null,
      });
    }
  };

  /*===  STATISTICS  ===*/

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(
    (b) => b.bookingStatus === "APPROVAL_PENDING",
  ).length;

  const confirmedBookings = bookings.filter(
    (b) => b.bookingStatus === "CONFIRMED",
  ).length;

  const rejectedBookings = bookings.filter(
    (b) => b.bookingStatus === "REJECTED" || b.bookingStatus === "CANCELLED",
  ).length;

  const getStatusClass = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "confirmed";

      case "APPROVAL_PENDING":
        return "pending";

      case "REJECTED":
      case "CANCELLED":
        return "cancelled";

      default:
        return "processing";
    }
  };

  /*===  LOADING SCREEN  ===*/

  if (loading) {
    return (
      <div className="hotel-bookings-loading">
        <div className="hotel-spinner"></div>
        <h4>Loading Hotel Bookings...</h4>
        <p>Please wait while we retrieve reservations.</p>
      </div>
    );
  }

  /*===  MAIN UI  ===*/

  return (
    <div className="hotel-bookings-page">
      {/* Hero */}

      <div className="hotel-bookings-hero">
        <h1>Hotel Bookings</h1>

        <p>
          Review customer reservations, approve bookings, manage occupancy and
          monitor booking status.
        </p>
      </div>

      {/* Statistics */}

      <div className="hotel-booking-stats">
        <div className="hotel-stat-card">
          <h3>{totalBookings}</h3>

          <span>Total Bookings</span>
        </div>

        <div className="hotel-stat-card pending">
          <h3>{pendingBookings}</h3>

          <span>Pending Approval</span>
        </div>

        <div className="hotel-stat-card success">
          <h3>{confirmedBookings}</h3>

          <span>Confirmed</span>
        </div>

        <div className="hotel-stat-card danger">
          <h3>{rejectedBookings}</h3>

          <span>Rejected</span>
        </div>
      </div>

      {/* Empty */}

      {bookings.length === 0 ? (
        <div className="hotel-empty-state">
          <h3>No Bookings Found</h3>

          <p>Reservations assigned to this hotel will appear here.</p>
        </div>
      ) : (
        <div className="hotel-booking-grid">
          {bookings.map((b) => {
            const isUpdating = updatingState.bookingId === b.bookingId;

            return (
              <div key={b.bookingId} className="hotel-booking-card">
                {/* Hotel Image */}

                <div className="hotel-booking-image">
                  <img
                    src={
                      b.hotelImage
                        ? `${import.meta.env.VITE_API_BASE_URL}/api/hotels/image/${b.hotelImage}`
                        : "https://via.placeholder.com/500x300?text=Hotel"
                    }
                    alt={b.hotelName}
                  />

                  <span
                    className={`booking-status ${getStatusClass(
                      b.bookingStatus,
                    )}`}
                  >
                    {b.bookingStatus.replaceAll("_", " ")}
                  </span>
                </div>

                {/* Content */}

                <div className="hotel-booking-content">
                  <div className="hotel-booking-header">
                    <div>
                      <h3>{b.hotelName}</h3>

                      <p>
                        Booking ID :<strong> #{b.bookingId}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="booking-details-grid">
                    <div className="booking-detail">
                      <label>Guest</label>

                      <span>{b.fullName}</span>
                    </div>

                    <div className="booking-detail">
                      <label>Email</label>

                      <span>{b.email || "N/A"}</span>
                    </div>

                    <div className="booking-detail">
                      <label>Phone</label>

                      <span>{b.phone || "N/A"}</span>
                    </div>

                    <div className="booking-detail">
                      <label>Rooms</label>

                      <span>{b.totalRoom}</span>
                    </div>

                    <div className="booking-detail">
                      <label>Check In</label>

                      <span>{new Date(b.checkIn).toLocaleDateString()}</span>
                    </div>

                    <div className="booking-detail">
                      <label>Check Out</label>

                      <span>{new Date(b.checkOut).toLocaleDateString()}</span>
                    </div>

                    <div className="booking-detail">
                      <label>Total Amount</label>

                      <span className="price">
                        ₹{b.totalAmount?.toLocaleString()}
                      </span>
                    </div>

                    <div className="booking-detail">
                      <label>Inventory</label>

                      <span
                        className={
                          b.inventoryConfirmed
                            ? "inventory confirmed"
                            : "inventory pending"
                        }
                      >
                        {b.inventoryConfirmed ? "Reserved" : "Pending"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}

                  {b.bookingStatus === "APPROVAL_PENDING" && (
                    <div className="booking-actions">
                      <button
                        className="approve-btn"
                        disabled={isUpdating}
                        onClick={() => handleApprove(b.bookingId)}
                      >
                        {isUpdating && updatingState.action === "APPROVED"
                          ? "Approving..."
                          : "Approve Booking"}
                      </button>

                      <button
                        className="reject-btn"
                        disabled={isUpdating}
                        onClick={() => handleReject(b.bookingId)}
                      >
                        {isUpdating && updatingState.action === "REJECTED"
                          ? "Rejecting..."
                          : "Reject Booking"}
                      </button>
                    </div>
                  )}

                  {isUpdating && (
                    <div className="processing-box">
                      <div className="processing-spinner"></div>

                      <span>Updating booking...</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default HotelBookings;
