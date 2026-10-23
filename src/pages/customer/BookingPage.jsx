import "./BookingPage.css";
import { useState, useMemo } from "react";
import { createBooking } from "@/api/bookingApi";
import { useParams, useNavigate } from "react-router-dom";

function BookingPage() {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    hotelId,
    checkIn: "",
    checkOut: "",
    totalRoom: 1,
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const handleChange = ({ target }) => {
    setErrorMsg("");
    setForm((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const handleRoomChange = (delta) => {
    setForm((prev) => ({
      ...prev,
      totalRoom: Math.max(1, prev.totalRoom + delta),
    }));
  };

  // Calculate total nights dynamically
  const totalNights = useMemo(() => {
    if (!form.checkIn || !form.checkOut) return 0;
    const start = new Date(form.checkIn);
    const end = new Date(form.checkOut);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }, [form.checkIn, form.checkOut]);

  const validateForm = () => {
    if (!form.checkIn) {
      setErrorMsg("Please select a Check-In Date.");
      return false;
    }

    if (!form.checkOut) {
      setErrorMsg("Please select a Check-Out Date.");
      return false;
    }

    if (new Date(form.checkOut) <= new Date(form.checkIn)) {
      setErrorMsg("Check-Out date must be after Check-In date.");
      return false;
    }

    if (form.totalRoom < 1) {
      setErrorMsg("At least one room is required.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = {
        hotelId: form.hotelId,
        checkIn: new Date(form.checkIn).toISOString(),
        checkOut: new Date(form.checkOut).toISOString(),
        totalRoom: Number(form.totalRoom),
      };

      const response = await createBooking(payload);
      const bookingId = response.data.data.bookingId;

      navigate(`/payment/checkout/${bookingId}`);
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message ||
          "Unable to process booking. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-page-container">
      <div className="booking-card-wrapper">
        {/* Header Section */}
        <div className="booking-card-header">
          <h1>Complete Your Reservation</h1>
          <p>
            Select your dates and room quantity to proceed to secure payment.
          </p>
        </div>

        {errorMsg && <div className="booking-error-alert">{errorMsg}</div>}

        <div className="booking-card-body">
          {/* Left Form Column */}
          <form onSubmit={handleSubmit} className="booking-form-section">
            <div className="form-row dates-row">
              <div className="booking-input-group">
                <label className="booking-label">Check-In Date</label>
                <input
                  type="date"
                  name="checkIn"
                  min={today}
                  className="booking-input"
                  value={form.checkIn}
                  onChange={handleChange}
                />
              </div>

              <div className="booking-input-group">
                <label className="booking-label">Check-Out Date</label>
                <input
                  type="date"
                  name="checkOut"
                  min={form.checkIn || today}
                  className="booking-input"
                  value={form.checkOut}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="booking-input-group">
              <label className="booking-label">Number of Rooms</label>
              <div className="room-stepper">
                <button
                  type="button"
                  className="stepper-btn"
                  onClick={() => handleRoomChange(-1)}
                  disabled={form.totalRoom <= 1}
                >
                  −
                </button>
                <span className="stepper-value">
                  {form.totalRoom} {form.totalRoom === 1 ? "Room" : "Rooms"}
                </span>
                <button
                  type="button"
                  className="stepper-btn"
                  onClick={() => handleRoomChange(1)}
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="booking-submit-button"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-text">Processing...</span>
              ) : (
                "Proceed to Payment →"
              )}
            </button>
          </form>

          {/* Right Summary Sidebar */}
          <div className="booking-summary-sidebar">
            <div className="summary-badge">Summary Details</div>
            <h3>Reservation Overview</h3>

            <div className="summary-list">
              <div className="summary-item">
                <span className="summary-label">Hotel Reference</span>
                <span className="summary-value hotel-id-code">{hotelId}</span>
              </div>

              <div className="summary-item">
                <span className="summary-label">Check-In</span>
                <span className="summary-value">{form.checkIn || "--"}</span>
              </div>

              <div className="summary-item">
                <span className="summary-label">Check-Out</span>
                <span className="summary-value">{form.checkOut || "--"}</span>
              </div>

              <div className="summary-item">
                <span className="summary-label">Duration</span>
                <span className="summary-value">
                  {totalNights} {totalNights === 1 ? "Night" : "Nights"}
                </span>
              </div>

              <div className="summary-item">
                <span className="summary-label">Rooms Selected</span>
                <span className="summary-value">{form.totalRoom}</span>
              </div>
            </div>

            <div className="summary-footer-note">
              🔒 Instant confirmation upon successful payment.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
