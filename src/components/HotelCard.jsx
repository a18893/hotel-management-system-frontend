import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "./HotelCard.css";

function HotelCard({ hotel, reviewPreview }) {
  const navigate = useNavigate();
  const images = useMemo(() => hotel.images || [], [hotel.images]);
  const [currentImage, setCurrentImage] = useState(0);

  const rating = reviewPreview?.ratingStats?.averageRating ?? 0;
  const totalReviews = reviewPreview?.ratingStats?.totalReviews ?? 0;
  const firstReview = reviewPreview?.reviews?.[0];

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 2500);

    return () => clearInterval(timer);
  }, [images]);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const imageUrl = images.length
    ? `${API_BASE}/api/hotels/image/${images[currentImage]}`
    : "/vite.svg";

  return (
    <article className="hotel-card">
      {/* Image */}

      <div className="hotel-card-image">
        <img
          src={imageUrl}
          alt={hotel.hotelName}
          onError={(e) => {
            e.target.src = "/vite.svg";
          }}
        />
      </div>

      {/* Content */}

      <div className="hotel-card-body">
        <div className="hotel-card-header">
          <h3>{hotel.hotelName}</h3>
          <span>{hotel.locationName}</span>
        </div>

        <div className="hotel-rating">
          <span className="hotel-star">★</span>
          <span>{rating.toFixed(1)}</span>
          <small>({totalReviews} Reviews)</small>
        </div>

        <p className="hotel-description">
          {hotel.description || "No description available."}
        </p>

        <div className="hotel-review">
          {firstReview
            ? `"${
                firstReview.review.length > 100
                  ? firstReview.review.substring(0, 100) + "..."
                  : firstReview.review
              }"`
            : "No reviews yet."}
        </div>

        <div className="hotel-room-info">
          <span>
            Total Rooms <strong>{hotel.totalRooms || 0}</strong>
          </span>
          <span>
            Available <strong>{hotel.availableRooms ?? 0}</strong>
          </span>
        </div>

        <div className="hotel-price">
          ₹{hotel.pricePerDay || 0}
          <small> / day</small>
        </div>

        <button
          className="hotel-book-btn"
          onClick={() => navigate(`/book/${hotel.hotelId}`)}
        >
          Book Now
        </button>
      </div>
    </article>
  );
}

export default HotelCard;
