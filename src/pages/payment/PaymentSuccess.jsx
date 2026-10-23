import "./PaymentSuccess.css";
import { useEffect, useState } from "react";
import { confirmPayment, getPaymentById } from "../../api/paymentApi";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaHome,
  FaClipboardList,
} from "react-icons/fa";

function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");

  useEffect(() => {
    const verifyStripePayment = async (paymentId) => {
      const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      for (let i = 0; i < 40; i++) {
        try {
          const res = await getPaymentById(paymentId);
          const paymentStatus = res.data?.data?.paymentStatus;

          if (paymentStatus === "SUCCESS") {
            return true;
          }

          if (paymentStatus === "FAILED" || paymentStatus === "CANCELLED") {
            return false;
          }
        } catch {
          alert("Stripe verification error:");
        }
        await wait(2000);
      }

      return false;
    };

    const handleConfirm = async () => {
      const paymentId = params.get("paymentId");
      let provider = params.get("provider");
      const refId = params.get("ref");
      const token = params.get("token");
      if (refId && token) {
        provider = "RAZORPAY";
      }

      if (!paymentId) {
        setStatus("error");
        setTimeout(() => {
          navigate("/my-bookings");
        }, 3000);
        return;
      }

      try {
        /*===  Razorpay ===*/

        if (provider === "RAZORPAY") {
          if (!refId || !token) {
            setStatus("error");

            return;
          }

          const res = await confirmPayment(paymentId, refId, token);
          const paymentStatus = res.data?.data?.paymentStatus;

          if (paymentStatus === "SUCCESS") {
            setStatus("success");

            setTimeout(() => {
              navigate("/customer/dashboard");
            }, 3500);
          } else {
            setStatus("error");
            setTimeout(() => {
              navigate("/my-bookings");
            }, 3500);
          }

          return;
        }

        /*===  Stripe ===*/

        if (provider === "STRIPE") {
          const success = await verifyStripePayment(paymentId);

          if (success) {
            setStatus("success");

            setTimeout(() => {
              navigate("/customer/dashboard");
            }, 3500);
          } else {
            setStatus("error");

            setTimeout(() => {
              navigate("/my-bookings");
            }, 3500);
          }

          return;
        }

        setStatus("error");
      } catch {
        setStatus("error");
        setTimeout(() => {
          navigate("/my-bookings");
        }, 3500);
      }
    };

    handleConfirm();
  }, [params, navigate]);

  return (
    <div className="payment-success-page">
      {/*===  PROCESSING ===*/}
      {status === "processing" && (
        <div className="payment-status-card">
          <FaSpinner className="processing-icon" />
          <h2>Processing Your Payment</h2>
          <p>
            Please wait while we verify your payment with the payment gateway.
          </p>
          <div className="processing-loader">
            <div></div>
          </div>
          <small>Please don't refresh or close this page.</small>
        </div>
      )}

      {/*===  SUCCESS ===*/}

      {status === "success" && (
        <div className="payment-status-card success">
          <FaCheckCircle className="success-icon" />
          <h2>Payment Successful!</h2>
          <p className="lead">
            Thank you!
            <br />
            Your payment has been received successfully.
          </p>
          <div className="success-box">
            <h5>Booking Status</h5>
            <div className="status-badge">Manager Approval Pending</div>
            <p>
              Your booking has been forwarded to the hotel manager for approval.
            </p>
            <p>
              Once approved, your reservation will automatically move to
              <strong> Confirmed</strong>.
            </p>
            <p>
              You'll receive an email and notification immediately after
              approval.
            </p>
          </div>
          <div className="payment-buttons">
            <Link to="/customer/dashboard" className="btn btn-primary">
              <FaHome className="me-2" />
              Dashboard
            </Link>
            <Link to="/my-bookings" className="btn btn-outline-success">
              <FaClipboardList className="me-2" />
              My Bookings
            </Link>
          </div>
          <div className="redirect-note">Redirecting automatically...</div>
        </div>
      )}

      {/*===  ERROR ===*/}

      {status === "error" && (
        <div className="payment-status-card error">
          <FaTimesCircle className="error-icon" />
          <h2>Payment Verification Failed</h2>
          <p>We couldn't verify your payment.</p>
          <p>
            If money has been deducted, don't worry.
            <br />
            Our system will automatically reconcile the payment.
          </p>
          <div className="payment-buttons">
            <Link to="/my-bookings" className="btn btn-danger">
              View My Bookings
            </Link>
            <Link
              to="/customer/dashboard"
              className="btn btn-outline-secondary"
            >
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentSuccess;
