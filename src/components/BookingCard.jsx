import "./BookingCard.css";

function BookingCard({ booking }) {
  return (
    <article className="booking-card">
      <h3 className="booking-card__title">Hotel ID: {booking.hotelId}</h3>

      <div className="booking-card__content">
        <p>
          <strong>Status:</strong> {booking.bookingStatus}
        </p>

        <p>
          <strong>Check In:</strong> {booking.startDate}
        </p>

        <p>
          <strong>Check Out:</strong> {booking.endDate}
        </p>

        <p className="booking-card__price">₹ {booking.totalPrice}</p>
      </div>
    </article>
  );
}

export default BookingCard;
