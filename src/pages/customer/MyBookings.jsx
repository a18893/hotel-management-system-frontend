import "./MyBookings.css";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { getMyBookings } from "../../api/bookingApi";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const fetchBookings = useCallback(async () => {
    try {
      const { data } = await getMyBookings();
      setBookings(data.data || []);
    } catch {
      alert("Failed to load your bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const formatDate = (date) => {
    if (!date) return "N/A";

    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return date;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "my-booking-status-confirmed";

      case "APPROVED":
        return "my-booking-status-approved";

      case "PENDING_PAYMENT":
      case "APPROVAL_PENDING":
        return "my-booking-status-pending";

      case "CONFIRMATION_IN_PROGRESS":
        return "my-booking-status-progress";

      case "CANCELLED":
        return "my-booking-status-cancelled";

      case "REFUNDED":
        return "my-booking-status-refunded";

      default:
        return "my-booking-status-default";
    }
  };

  const filteredBookings = useMemo(() => {
    const keyword = searchTerm.toLowerCase();

    return bookings.filter(
      (booking) =>
        booking.hotelName?.toLowerCase().includes(keyword) ||
        booking.bookingId?.toString().toLowerCase().includes(keyword),
    );
  }, [bookings, searchTerm]);

  const statistics = useMemo(() => {
    let confirmed = 0;
    let pending = 0;
    let cancelled = 0;

    bookings.forEach((b) => {
      switch (b.bookingStatus) {
        case "CONFIRMED":
          confirmed++;
          break;

        case "CANCELLED":
          cancelled++;
          break;

        case "PENDING_PAYMENT":
        case "APPROVAL_PENDING":
        case "CONFIRMATION_IN_PROGRESS":
          pending++;
          break;

        default:
          break;
      }
    });

    return {
      total: bookings.length,
      confirmed,
      pending,
      cancelled,
    };
  }, [bookings]);

  if (loading) {
    return (
      <div className="my-booking-loading">
        <div className="spinner-border text-primary" />
        <p>Loading your bookings...</p>
      </div>
    );
  }
  return (
    <div className="my-bookings-page">
      {/*===  PAGE HEADER  ===*/}

      <div className="my-bookings-header">
        <div>
          <h1>My Bookings</h1>

          <p>Manage your hotel reservations, payments and reviews.</p>
        </div>
      </div>

      {/*===  STATISTICS  ===*/}

      <div className="my-booking-stats">
        <div className="my-booking-stat-card total">
          <h5>Total Bookings</h5>

          <h2>{statistics.total}</h2>
        </div>

        <div className="my-booking-stat-card confirmed">
          <h5>Confirmed</h5>

          <h2>{statistics.confirmed}</h2>
        </div>

        <div className="my-booking-stat-card pending">
          <h5>Pending</h5>

          <h2>{statistics.pending}</h2>
        </div>

        <div className="my-booking-stat-card cancelled">
          <h5>Cancelled</h5>

          <h2>{statistics.cancelled}</h2>
        </div>
      </div>

      {/*===  SEARCH  ===*/}

      <div className="my-booking-search">
        <input
          type="text"
          placeholder="Search by Hotel Name or Booking ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/*===  EMPTY STATE  ===*/}

      {filteredBookings.length === 0 ? (
        <div className="empty-bookings">
          <h3>No Bookings Found</h3>

          <p>Looks like you haven't booked any hotels yet.</p>

          <Link to="/" className="browse-btn">
            Browse Hotels
          </Link>
        </div>
      ) : (
        <div className="my-booking-list">
          {filteredBookings.map((booking) => (
            <div key={booking.bookingId} className="my-booking-card">
              {/* IMAGE */}

              <div className="my-booking-image">
                <img
                  src={
                    booking.hotelImage
                      ? `${import.meta.env.VITE_API_BASE_URL}/api/hotels/image/${booking.hotelImage}`
                      : "/vite.svg"
                  }
                  alt={booking.hotelName}
                  onError={(e) => (e.target.src = "/vite.svg")}
                />
              </div>

              {/* CONTENT */}

              <div className="my-booking-content">
                {/* HEADER */}

                <div className="my-booking-header-row">
                  <div className="my-booking-hotel-details">
                    <h2>{booking.hotelName}</h2>

                    <p>📧 {booking.hotelEmail ?? "N/A"}</p>

                    <p>📞 {booking.hotelContact ?? "N/A"}</p>
                  </div>

                  <span
                    className={`my-booking-status-badge ${getStatusClass(
                      booking.bookingStatus,
                    )}`}
                  >
                    {booking.bookingStatus}
                  </span>
                </div>

                {/* INFORMATION */}

                <div className="my-booking-info-grid">
                  <div className="my-booking-info-row">
                    <div className="my-booking-info-left">
                      <span className="my-booking-info-icon">🆔</span>

                      <span className="my-booking-info-label">Booking ID</span>
                    </div>

                    <span className="my-booking-info-separator">:</span>

                    <span className="my-booking-info-value">
                      {booking.bookingId}
                    </span>
                  </div>

                  <div className="my-booking-info-row">
                    <div className="my-booking-info-left">
                      <span className="my-booking-info-icon">📅</span>

                      <span className="my-booking-info-label">Check In</span>
                    </div>

                    <span className="my-booking-info-separator">:</span>

                    <span className="my-booking-info-value">
                      {formatDate(booking.checkIn)}
                    </span>
                  </div>

                  <div className="my-booking-info-row">
                    <div className="my-booking-info-left">
                      <span className="my-booking-info-icon">📆</span>

                      <span className="my-booking-info-label">Check Out</span>
                    </div>

                    <span className="my-booking-info-separator">:</span>

                    <span className="my-booking-info-value">
                      {formatDate(booking.checkOut)}
                    </span>
                  </div>

                  <div className="my-booking-info-row">
                    <div className="my-booking-info-left">
                      <span className="my-booking-info-icon">🛏️</span>

                      <span className="my-booking-info-label">Rooms</span>
                    </div>

                    <span className="my-booking-info-separator">:</span>

                    <span className="my-booking-info-value">
                      {booking.totalRoom}
                    </span>
                  </div>

                  <div className="my-booking-info-row">
                    <div className="my-booking-info-left">
                      <span className="my-booking-info-icon">📋</span>

                      <span className="my-booking-info-label">Total Days</span>
                    </div>

                    <span className="my-booking-info-separator">:</span>

                    <span className="my-booking-info-value">
                      {booking.totalDays ??
                        Math.max(
                          1,
                          Math.ceil(
                            (new Date(booking.checkOut) -
                              new Date(booking.checkIn)) /
                              (1000 * 60 * 60 * 24),
                          ),
                        )}
                    </span>
                  </div>

                  <div className="my-booking-info-row total-amount-row">
                    <div className="my-booking-info-left">
                      <span className="my-booking-info-icon">💳</span>

                      <span className="my-booking-info-label">
                        Total Amount
                      </span>
                    </div>

                    <span className="my-booking-info-separator">:</span>

                    <span className="my-booking-info-value amount-value">
                      ₹{booking.totalAmount}
                    </span>
                  </div>
                </div>

                {/* BUTTONS */}

                <div className="my-booking-actions">
                  <Link
                    to={`/payment/details/${booking.bookingId}`}
                    className="details-btn"
                  >
                    View Details
                  </Link>

                  {booking.reviewEligible ? (
                    <Link
                      className="review-btn"
                      to={`/review/${booking.hotelId}`}
                      state={{
                        bookingId: booking.bookingId,
                        hotelName: booking.hotelName,
                        checkIn: booking.checkIn,
                        checkOut: booking.checkOut,
                      }}
                    >
                      Write Review
                    </Link>
                  ) : (
                    <button className="review-disabled" disabled>
                      Review Unavailable
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
