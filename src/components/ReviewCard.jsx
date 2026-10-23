import "./ReviewCard.css";

function ReviewCard({ review = {}, onDeleteClick, showDeleteButton = false }) {
  const formatReviewText = (text) => {
    if (!text) return "";

    return text

      .replace(/\{currency\}/gi, "INR")
      .replace(/\{amount\}/gi, "1.00")
      .replace(/\{hotelContact\}/gi, "+91 98765 43210");
  };

  const cleanText = formatReviewText(review?.review || "");
  const rating = review?.starRating ?? 0;

  return (
    <article className="review-card">
      <div className="review-card__content">
        {/* Header */}

        <div className="review-card__header">
          <div className="review-card__rating">
            {"★".repeat(rating)}
            {"☆".repeat(5 - rating)}
          </div>
          <span className="review-card__user">
            {review?.userName || "Anonymous Guest"}
          </span>

          <span className="review-card__divider"></span>

          <span className="review-card__id">{review?.reviewId}</span>
        </div>

        {/* Review */}

        <p className="review-card__text">"{cleanText}"</p>

        {/* Booking */}

        {review?.bookingId && (
          <div className="review-card__booking">
            <svg
              className="review-card__icon"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            Booking Ref: {review.bookingId}
          </div>
        )}
      </div>

      {showDeleteButton && (
        <button
          className="review-card__delete"
          onClick={() => onDeleteClick(review.reviewId)}
          aria-label={`Delete review ${review.reviewId}`}
        >
          Remove
        </button>
      )}
    </article>
  );
}

export default ReviewCard;
