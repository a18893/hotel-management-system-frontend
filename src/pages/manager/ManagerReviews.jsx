import { useEffect, useState, useCallback } from "react";
import axiosClient from "@/api/axiosClient";
import ReviewCard from "../../components/ReviewCard";
import { useManagerHotelId } from "@/hooks/useManagerHotelId";
import "./ManagerReviews.css";

function ManagerReviews() {
  const { hotelId, loading: hotelLoading } = useManagerHotelId();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      if (!hotelId) {
        setError("No hotel assigned.");
        return;
      }

      /*===  Reviews  ===*/
      const reviewRes = await axiosClient.get(
        `/api/hotels/reviews?hotelId=${hotelId}`,
      );
      setReviews(
        reviewRes.data?.data?.content || reviewRes.data?.content || [],
      );

      /*===  Rating Statistics  ===*/
      const statsRes = await axiosClient.get(
        `/api/hotels/reviews/stats?hotelId=${hotelId}`,
      );
      setStats(statsRes.data?.data || null);
    } catch {
      setError("Unable to load hotel reviews.");
    } finally {
      setLoading(false);
    }
  }, [hotelId]);

  useEffect(() => {
    if (hotelId) {
      loadReviews();
    }
  }, [loadReviews, hotelId]);

  /*===  Loading  ===*/
  if (loading || hotelLoading) {
    return (
      <div className="manager-reviews-loading">
        <div className="review-spinner"></div>
        <h2>Loading Reviews...</h2>
        <p>Retrieving customer feedback.</p>
      </div>
    );
  }

  /*===  Error  ===*/
  if (error) {
    return (
      <div className="manager-reviews-error">
        <h2>Unable to Load Reviews</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="manager-reviews-page">
      {/* Hero */}
      <div className="manager-reviews-hero">
        <div>
          <h1>Hotel Reviews</h1>
          <p>
            Monitor guest satisfaction, ratings and verified customer feedback.
          </p>
        </div>
        <div className="review-summary-card">
          <h2>{stats?.totalReviews || 0}</h2>
          <span>Total Reviews</span>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="review-stats-grid">
          <div className="review-stat-card">
            <span>Average Rating</span>
            <h2>
              ⭐ {stats.averageRating ? stats.averageRating.toFixed(1) : "0.0"}
            </h2>
          </div>
          <div className="review-stat-card">
            <span>Total Reviews</span>
            <h2>{stats.totalReviews}</h2>
          </div>
        </div>
      )}

      {/* Review List */}
      <div className="review-section">
        <h2>Customer Feedback</h2>
        {reviews.length === 0 ? (
          <div className="review-empty">
            <h3>No Reviews Yet</h3>
            <p>Guests haven't submitted any reviews for this hotel.</p>
          </div>
        ) : (
          <div className="review-list">
            {reviews.map((review) => (
              <ReviewCard
                key={review.reviewId || review.id}
                review={review}
                showDeleteButton={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagerReviews;
