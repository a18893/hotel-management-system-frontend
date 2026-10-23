import "./AddReview.css";
import { useState } from "react";
import { addReview } from "../../api/reviewApi";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  FaStar,
  FaRegStar,
  FaClipboardCheck,
  FaArrowLeft,
} from "react-icons/fa";

function AddReview() {
  const { hotelId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  /* ==== BOOKING DATA === */
  const hotelName = location.state?.hotelName || "";
  const checkIn = location.state?.checkIn || "";
  const checkOut = location.state?.checkOut || "";
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    bookingId: location.state?.bookingId || "",
    starRating: 5,
    review: "",
  });

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleStarClick = (rating) => {
    setForm({
      ...form,
      starRating: rating,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.review.trim()) {
      alert("Please write your review.");
      return;
    }

    try {
      setLoading(true);
      await addReview(hotelId, form);
      alert("Review submitted successfully.");
      navigate("/my-bookings");
    } catch {
      alert("Unable to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-page">
      <div className="review-card">
        {/* === REVIEW FORM === */}
        <form onSubmit={handleSubmit}>
          <div className="review-layout">
            {/* === LEFT INTRO === */}
            <div className="review-intro">
              <span className="review-badge">⭐ VERIFIED STAY</span>
              <h1>Share Your Experience</h1>
              <p>
                Your review helps future travellers make better booking
                decisions.
              </p>
              <div className="intro-line"></div>
              <div className="review-illustration">
                <FaClipboardCheck className="intro-icon" />
              </div>
            </div>

            {/* === STAY DETAILS === */}
            <div className="review-info-grid">
              <div className="stay-details-card">
                <div className="stay-icon">
                  <FaClipboardCheck />
                </div>
                <h3>Your Stay Details</h3>
                <div className="stay-info">
                  <span>Booking ID</span>
                  <strong>{form.bookingId}</strong>
                </div>
                <div className="stay-divider"></div>
                <div className="stay-info">
                  <span>Hotel Name</span>
                  <strong>{hotelName}</strong>
                </div>
                <div className="stay-divider"></div>
                <div className="stay-info">
                  <span>Stay Date</span>
                  <strong>
                    {formatDate(checkIn)} - {formatDate(checkOut)}
                  </strong>
                </div>
              </div>
              <div className="rating-card-new">
                <h3>Overall Rating</h3>
                <p>How would you rate your stay?</p>
                <div className="star-container">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="star-btn"
                      onClick={() => handleStarClick(star)}
                    >
                      {star <= form.starRating ? (
                        <FaStar className="star-filled" />
                      ) : (
                        <FaRegStar className="star-empty" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="rating-summary-large">
                  <strong>{form.starRating} / 5</strong>
                  <span>
                    {form.starRating === 5
                      ? "Excellent"
                      : form.starRating === 4
                        ? "Very Good"
                        : form.starRating === 3
                          ? "Good"
                          : form.starRating === 2
                            ? "Fair"
                            : "Poor"}
                  </span>
                </div>
              </div>
            </div>
            {/* === REVIEW TIPS === */}
            <div className="review-column">
              <div className="review-tips">
                <h3>Write a Helpful Review</h3>
                <p className="tips-subtitle">
                  Please share details about your experience. Your feedback
                  matters!
                </p>
                <ul>
                  <li>✔ Describe your overall experience.</li>
                  <li>✔ Mention room cleanliness.</li>
                  <li>✔ Rate the staff behaviour.</li>
                  <li>✔ Share food and amenities experience.</li>
                  <li>✔ Recommend this hotel to future travellers.</li>
                </ul>
                <div className="tips-note">
                  <strong>Be honest and respectful.</strong>
                  <span>Your reviews should help future guests.</span>
                </div>
              </div>
            </div>
            {/* === REVIEW EDITOR === */}
            <div className="review-column">
              <div className="review-section">
                <div className="editor-header">
                  <label className="review-label">Your Experience</label>
                  <span className="character-counter">
                    {form.review.length} / 500
                  </span>
                </div>
                <div className="review-editor">
                  <textarea
                    name="review"
                    value={form.review}
                    onChange={handleChange}
                    maxLength="500"
                    placeholder="Tell us about your stay. What did you enjoy? What could be improved?"
                    className="review-textarea"
                  />
                </div>
                <span className="minimum-text">Minimum 10 characters</span>
              </div>
            </div>
          </div>
          <div className="review-footer">
            <button className="review-back-btn" onClick={() => navigate(-1)}>
              <FaArrowLeft />
              Back
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddReview;
