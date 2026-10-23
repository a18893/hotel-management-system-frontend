import "./PaymentDetails.css";
import { useEffect, useState } from "react";
import { getPaymentStatusByBookingId } from "../../api/paymentApi";
import { useParams, Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaMoneyBillWave,
  FaCreditCard,
  FaReceipt,
  FaCalendarAlt,
  FaArrowLeft,
  FaHotel,
} from "react-icons/fa";

function PaymentDetails() {
  const { bookingId } = useParams();
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const res = await getPaymentStatusByBookingId(bookingId);
        setPayment(res.data.data);
      } catch {
        alert("Unable to load payment details.");
      }
    };

    fetchPayment();
  }, [bookingId]);

  const getStatusIcon = () => {
    switch (payment?.paymentStatus) {
      case "SUCCESS":
        return <FaCheckCircle className="status-icon success" />;
      case "FAILED":
        return <FaTimesCircle className="status-icon failed" />;
      default:
        return <FaClock className="status-icon pending" />;
    }
  };

  const getStatusBadge = () => {
    switch (payment?.paymentStatus) {
      case "SUCCESS":
        return "badge bg-success";
      case "FAILED":
        return "badge bg-danger";
      case "PENDING":
        return "badge bg-warning text-dark";
      default:
        return "badge bg-secondary";
    }
  };

  if (!payment) {
    return (
      <div className="payment-loading">
        <div className="spinner-border text-primary"></div>

        <p className="mt-3 text-muted">Loading payment details...</p>
      </div>
    );
  }

  return (
    <div className="payment-details-page">
      <div className="container">
        {/* Header */}

        <div className="payment-header-box">
          {getStatusIcon()}

          <h2>Payment Receipt</h2>

          <p>Booking ID #{bookingId}</p>
        </div>

        {/* Main Card */}

        <div className="payment-card">
          <div className="payment-card-header">
            <FaReceipt />

            <span>Transaction Summary</span>
          </div>

          <div className="payment-body">
            <div className="payment-row">
              <span>
                <FaReceipt />
                Payment ID
              </span>

              <strong>{payment.paymentId}</strong>
            </div>

            <div className="payment-row">
              <span>
                <FaMoneyBillWave />
                Amount
              </span>

              <strong className="amount">
                ₹{payment.amount?.toLocaleString()}
              </strong>
            </div>

            <div className="payment-row">
              <span>
                <FaCreditCard />
                Provider
              </span>

              <strong>{payment.provider || "N/A"}</strong>
            </div>

            <div className="payment-row">
              <span>
                <FaHotel />
                Booking ID
              </span>

              <strong>{bookingId}</strong>
            </div>

            <div className="payment-row">
              <span>Status</span>

              <span className={getStatusBadge()}>{payment.paymentStatus}</span>
            </div>

            {payment.gatewayReferenceId && (
              <div className="payment-row">
                <span>Gateway Reference</span>

                <strong>{payment.gatewayReferenceId}</strong>
              </div>
            )}

            {payment.paymentDate && (
              <div className="payment-row">
                <span>
                  <FaCalendarAlt />
                  Payment Date
                </span>

                <strong>
                  {new Date(payment.paymentDate).toLocaleString()}
                </strong>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Buttons */}

        <div className="payment-actions">
          <Link to="/my-bookings" className="btn btn-outline-primary">
            <FaArrowLeft className="me-2" />
            Back to My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PaymentDetails;
