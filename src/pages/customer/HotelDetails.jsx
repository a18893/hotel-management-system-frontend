import "./HotelDetails.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHotelById } from "../../api/hotelApi";
import ReviewList from "../review/ReviewList";

function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);
        const response = await getHotelById(id);
        setHotel(response.data.data);
      } catch {
        setError("Unable to load hotel details.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id]);

  if (loading) {
    return (
      <div className="hotel-details-message">Loading hotel details...</div>
    );
  }

  if (error) {
    return <div className="hotel-details-message error">{error}</div>;
  }

  if (!hotel) {
    return <div className="hotel-details-message">Hotel not found.</div>;
  }

  const imageUrl =
    hotel.images?.length > 0
      ? `${import.meta.env.VITE_API_BASE_URL}/api/hotels/image/${hotel.images[0]}`
      : "/vite.svg";

  return (
    <div className="hotel-details-page">
      {/* Hero Image */}

      <div className="hotel-banner">
        <img
          src={imageUrl}
          alt={hotel.hotelName}
          onError={(e) => {
            e.target.src = "/vite.svg";
          }}
        />
      </div>

      {/* Main Content */}

      <div className="hotel-details-container">
        {/* Left Section */}

        <div className="hotel-info">
          <h1>{hotel.hotelName}</h1>

          <p className="hotel-location">
            📍 {hotel.location?.locationName || "Location Not Available"}
          </p>

          <div className="hotel-rating">
            ⭐ 4.8 / 5 • Excellent Guest Reviews
          </div>

          <p className="hotel-description">
            {hotel.description ||
              "Experience premium comfort with world-class hospitality, elegant rooms, modern amenities, and exceptional customer service. Perfect for business trips, family vacations, and relaxing weekend getaways."}
          </p>

          <div className="hotel-features">
            <div className="feature-item">
              🏨 Total Rooms:
              <strong> {hotel.totalRooms || 0}</strong>
            </div>

            <div className="feature-item">
              ✅ Available Rooms:
              <strong> {hotel.availableRooms ?? 0}</strong>
            </div>

            <div className="feature-item">📶 Free Wi-Fi</div>

            <div className="feature-item">🍽 Complimentary Breakfast</div>

            <div className="feature-item">🏊 Swimming Pool</div>

            <div className="feature-item">🚗 Free Parking</div>
          </div>
        </div>

        {/* Booking Card */}

        <div className="booking-card">
          <h2>₹{hotel.pricePerDay}</h2>

          <span>Per Night</span>

          <button
            className="book-button"
            onClick={() => navigate(`/booking/${hotel.hotelId}`)}
          >
            Book Now
          </button>

          <button className="secondary-button" onClick={() => navigate("/")}>
            Continue Browsing
          </button>
        </div>
      </div>

      {/* Reviews */}

      <section className="reviews-section">
        <h2>Guest Reviews</h2>

        <ReviewList hotelId={hotel.hotelId} />
      </section>
    </div>
  );
}

export default HotelDetails;
