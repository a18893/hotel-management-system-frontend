import "./CheckoutPaymentPage.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { processPayment } from "../../api/paymentApi";
import { getBookingById } from "../../api/bookingApi";

function CheckoutPaymentPage() {
  const { bookingId } = useParams();
  const [provider, setProvider] = useState("RAZORPAY");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  /*===  Load Booking  ===*/
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await getBookingById(bookingId);
        setBooking(res.data.data);
      } catch {
        alert("Unable to load booking details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  /*===  Payment  ===*/
  const handlePayment = async () => {
    try {
      setProcessing(true);

      const res = await processPayment({
        bookingId: booking.bookingId,
        hotelId: booking.hotelId,
        amount: booking.totalAmount,
        currency: "INR",
        provider,
      });

      const data = res.data.data;

      if (provider === "RAZORPAY") {
        const options = {
          key: data.key,
          amount: data.amountInPaise,
          currency: "INR",
          name: "Hotel Booking",
          description: "Booking Payment",
          order_id: data.gatewayOrderId,
          handler: function (response) {
            window.location.href = `/payment/success?paymentId=${data.paymentId}&ref=${response.razorpay_payment_id}&token=${response.razorpay_signature}`;
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }

      if (provider === "STRIPE") {
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      alert(
        err?.response?.data?.message || "Payment failed. Please try again.",
      );
    } finally {
      setProcessing(false);
    }
  };

  /*===  Loading  ===*/
  if (loading) {
    return (
      <div className="payment-loading">
        <div className="spinner-border text-primary" role="status" />
        <h4 className="mt-4">Loading Booking Details...</h4>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="container payment-container">
        {/* Header */}
        <div className="payment-header">
          <span className="payment-pill">🔒 Express Checkout</span>
          <h2>Complete Your Booking</h2>
          <p>
            Review your reservation details and select a secure payment option.
          </p>
        </div>

        {/* Side-by-Side Grid */}
        <div className="row g-4 align-items-start">
          {/* Main Content (Left Column) */}
          <div className="col-lg-8">
            {/* Booking Details Card */}
            <div className="payment-card summary-card">
              <div className="card-header-bar">
                <h4 className="section-title">
                  <span className="title-icon">📋</span> Reservation Summary
                </h4>
              </div>

              <div className="booking-summary-grid">
                <div className="summary-item highlight-item">
                  <span>Booking ID</span>
                  <strong>#{booking.bookingId}</strong>
                </div>

                <div className="summary-item">
                  <span>Hotel ID</span>
                  <strong>{booking.hotelId}</strong>
                </div>

                <div className="summary-item">
                  <span>Check-In</span>
                  <strong>
                    {booking.checkIn
                      ? new Date(booking.checkIn).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                  </strong>
                </div>

                <div className="summary-item">
                  <span>Check-Out</span>
                  <strong>
                    {booking.checkOut
                      ? new Date(booking.checkOut).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                  </strong>
                </div>

                <div className="summary-item">
                  <span>Total Rooms</span>
                  <strong>{booking.totalRoom} Room(s)</strong>
                </div>

                <div className="summary-item">
                  <span>Total Duration</span>
                  <strong>
                    {booking.totalDay || booking.totalDays || "-"} Night(s)
                  </strong>
                </div>

                <div className="summary-item status-item">
                  <span>Booking Status</span>
                  <span className="status-badge">{booking.bookingStatus}</span>
                </div>
              </div>
            </div>

            {/* Select Payment Method */}
            <div className="payment-card mt-4 method-card">
              <div className="card-header-bar">
                <h4 className="section-title">
                  <span className="title-icon">💳</span> Select Payment Method
                </h4>
              </div>

              <div className="payment-options">
                {/* Razorpay Option */}
                <label
                  className={
                    provider === "RAZORPAY"
                      ? "payment-option rzp-active"
                      : "payment-option"
                  }
                >
                  <input
                    type="radio"
                    name="paymentProvider"
                    value="RAZORPAY"
                    checked={provider === "RAZORPAY"}
                    onChange={(e) => setProvider(e.target.value)}
                  />
                  <div className="option-content">
                    <div className="option-header">
                      <h5>Razorpay</h5>
                      <span className="badge-chip rzp-chip">India Instant</span>
                    </div>
                    <small>
                      Credit/Debit Cards, UPI (GPay, PhonePe), Net Banking &
                      Wallets
                    </small>
                  </div>
                </label>

                {/* Stripe Option */}
                <label
                  className={
                    provider === "STRIPE"
                      ? "payment-option stripe-active"
                      : "payment-option"
                  }
                >
                  <input
                    type="radio"
                    name="paymentProvider"
                    value="STRIPE"
                    checked={provider === "STRIPE"}
                    onChange={(e) => setProvider(e.target.value)}
                  />
                  <div className="option-content">
                    <div className="option-header">
                      <h5>Stripe</h5>
                      <span className="badge-chip stripe-chip">
                        International
                      </span>
                    </div>
                    <small>
                      Visa, Mastercard, American Express & Global Currency Cards
                    </small>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Payment Sidebar (Right Column) */}
          <div className="col-lg-4">
            <div className="payment-sidebar">
              <h4 className="sidebar-title">Payment Overview</h4>

              <div className="amount-card">
                <span className="amount-label">Total Amount Payable</span>
                <h2 className="amount-value">₹{booking.totalAmount}</h2>
                <span className="amount-subtext">
                  Inclusive of all taxes & fees
                </span>
              </div>

              <div className="secure-box">
                <div className="secure-header">
                  <span className="shield-icon">🛡️</span>
                  <h6>Guaranteed Safe Checkout</h6>
                </div>
                <p>256-bit SSL encryption protects your payment information.</p>
              </div>

              <button
                className="payment-btn"
                onClick={handlePayment}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <span className="btn-spinner"></span> Processing...
                  </>
                ) : (
                  `Pay ₹${booking.totalAmount} Now`
                )}
              </button>

              <div className="payment-note">
                <small>
                  🔒 By proceeding, you agree to our Terms of Service &
                  Cancellation Policy.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPaymentPage;
