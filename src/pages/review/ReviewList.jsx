import "./ReviewList.css";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getStoredToken, decodeToken, clearStoredAuth } from "@/api/authApi";
import { getReviews, deleteReview, getRatingStats } from "../../api/reviewApi";
import ReviewCard from "../../components/ReviewCard";

function ReviewList() {
  const { hotelId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  /*=== Detect Admin ===*/
  useEffect(() => {
    const token = getStoredToken();
    if (!token) return;

    const decoded = decodeToken(token);
    if (decoded?.role?.toUpperCase() === "ADMIN") {
      setIsAdmin(true);
    } else if (!decoded) {
      clearStoredAuth();
    }
  }, []);

  /*=== Load Reviews ===*/
  const refreshDataset = useCallback(async () => {
    try {
      const reviewRes = await getReviews(hotelId, page, 10);
      setReviews(reviewRes.data?.data?.content || []);
      setTotalPages(reviewRes.data?.data?.totalPages || 0);

      const statsRes = await getRatingStats(hotelId);
      setStats(statsRes.data?.data || null);
    } catch {
      alert("Unable to load reviews.");
    } finally {
      setLoading(false);
    }
  }, [hotelId, page]);

  useEffect(() => {
    if (hotelId) {
      refreshDataset();
    }
  }, [hotelId, refreshDataset]);

  /*=== Delete Review ===*/
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this review permanently?");
    if (!confirmDelete) return;

    try {
      await deleteReview(id);
      refreshDataset();
    } catch {
      alert("Failed to delete review.");
    }
  };

  /*=== Loading ===*/
  if (loading) {
    return (
      <div className="review-loading">
        <div className="spinner-border text-primary" role="status" />
        <h5 className="mt-4">Loading Reviews...</h5>
        <p className="text-muted">Please wait while we fetch guest reviews.</p>
      </div>
    );
  }

  return (
    <div className="review-page">
      <div className="container">
        {/*=== PAGE HEADER ===*/}
        <div className="review-header">
          <div>
            <h2>Guest Reviews</h2>
            <p>
              Read genuine experiences shared by verified customers who have
              stayed at this hotel.
            </p>
          </div>
          {stats && (
            <div className="rating-summary">
              <div className="rating-score">
                ⭐{" "}
                {stats.averageRating ? stats.averageRating.toFixed(1) : "0.0"}
              </div>
              <small>{stats.totalReviews || 0} Reviews</small>
            </div>
          )}
        </div>

        {/*=== Rating Overview ===*/}
        {stats && (
          <div className="review-stats-card">
            <div className="row text-center">
              <div className="col-md-4">
                <h3>
                  ⭐{" "}
                  {stats.averageRating ? stats.averageRating.toFixed(1) : "0.0"}
                </h3>
                <p>Average Rating</p>
              </div>
              <div className="col-md-4">
                <h3>{stats.totalReviews || 0}</h3>
                <p>Total Reviews</p>
              </div>
              <div className="col-md-4">
                <h3>{reviews.length}</h3>
                <p>Showing On This Page</p>
              </div>
            </div>
          </div>
        )}

        {/*=== Empty State ===*/}
        {reviews.length === 0 && (
          <div className="empty-review-card">
            <h4>No Reviews Yet</h4>
            <p>Be the first guest to share your experience with this hotel.</p>
          </div>
        )}

        {/*=== Review List ===*/}
        {reviews.length > 0 && (
          <div className="review-list">
            {reviews.map((review) => (
              <ReviewCard
                key={review.reviewId || review.id}
                review={review}
                showDeleteButton={isAdmin}
                onDeleteClick={handleDelete}
              />
            ))}
          </div>
        )}

        {/*=== Pagination ===*/}
        {totalPages > 1 && (
          <div className="review-pagination">
            <button
              className="btn btn-outline-primary"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              ← Previous
            </button>
            <div className="page-indicator">
              Page <span className="current-page">{page + 1}</span> of{" "}
              <span className="total-pages">{totalPages}</span>
            </div>
            <button
              className="btn btn-outline-primary"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewList;
