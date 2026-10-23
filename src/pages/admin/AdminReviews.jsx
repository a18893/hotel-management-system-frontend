import { useEffect, useState, useMemo, useCallback } from "react";
import { getAllReviews, deleteReview } from "../../api/reviewApi";
import ReviewCard from "../../components/ReviewCard";
import "./AdminReviews.css";

function AdminReviews() {
  // ==== STATE ====
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  // ==== LOAD REVIEWS ====
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllReviews(page, 20);
      setReviews(res.data?.data?.content || []);
      setTotalPages(res.data?.data?.totalPages || 0);
    } catch {
      setReviews([]);
      alert("Unable to load reviews.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // ==== DELETE REVIEW ====
  const handleDelete = async (reviewId) => {
    const confirmed = window.confirm("Delete this review permanently?");

    if (!confirmed) return;

    try {
      await deleteReview(reviewId);
      await fetchReviews();
    } catch {
      alert("Unable to delete review.");
    }
  };

  // === DASHBOARD STATS ===
  const stats = useMemo(() => {
    const total = reviews.length;
    const ratings = reviews.map((r) => r.rating || 0);
    const average =
      ratings.length > 0
        ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
        : "0.0";

    const fiveStars = reviews.filter((r) => r.rating === 5).length;

    return { total, average, fiveStars, page: page + 1 };
  }, [reviews, page]);

  // === LOADING ===
  if (loading) {
    return (
      <div className="admin-reviews-loading">
        <div className="review-spinner"></div>

        <h2>Loading Reviews...</h2>

        <p>Please wait while we load customer reviews.</p>
      </div>
    );
  }
  return (
    <div className="admin-reviews-page">
      {/* === HERO === */}
      <section className="admin-reviews-hero">
        <div>
          <h1>Customer Reviews</h1>

          <p>
            Monitor customer feedback, maintain review quality, and remove
            inappropriate reviews to ensure a trusted booking experience across
            the platform.
          </p>
        </div>
      </section>

      {/* ===== DASHBOARD STATS ===== */}
      <section className="review-stats-grid">
        <div className="review-stat-card total">
          <span>Total Reviews</span>

          <h2>{stats.total}</h2>
        </div>

        <div className="review-stat-card average">
          <span>Average Rating</span>

          <h2>{stats.average} ★</h2>
        </div>

        <div className="review-stat-card five-star">
          <span>5 Star Reviews</span>

          <h2>{stats.fiveStars}</h2>
        </div>

        <div className="review-stat-card page">
          <span>Current Page</span>

          <h2>{stats.page}</h2>
        </div>
      </section>

      {/* ====== REVIEW LIST ====== */}
      <section className="review-list-card">
        <div className="section-header">
          <div>
            <h2>Review Management</h2>

            <p>
              Browse customer reviews, inspect ratings and remove reviews that
              violate platform guidelines.
            </p>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="empty-review-state">
            <div className="empty-icon">⭐</div>

            <h3>No Reviews Found</h3>

            <p>There are currently no customer reviews available.</p>
          </div>
        ) : (
          <div className="reviews-grid">
            {reviews.map((review) => (
              <ReviewCard
                key={review.reviewId}
                review={review}
                showDeleteButton={true}
                onDeleteClick={handleDelete}
              />
            ))}
          </div>
        )}
      </section>

      {/* ==== PAGINATION ====== */}
      {totalPages > 1 && (
        <section className="pagination-wrapper">
          <button
            className="pagination-btn"
            disabled={page === 0}
            onClick={() => setPage((prev) => prev - 1)}
          >
            ← Previous
          </button>

          <div className="pagination-info">
            Page
            <strong> {page + 1} </strong>
            of
            <strong> {totalPages}</strong>
          </div>

          <button
            className="pagination-btn"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next →
          </button>
        </section>
      )}
    </div>
  );
}

export default AdminReviews;
