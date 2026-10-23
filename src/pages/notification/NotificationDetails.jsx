import "./NotificationDetails.css";
import { useEffect, useState } from "react";
import { getNotificationById } from "../../api/notificationApi";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaBell,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaArrowLeft,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaInfoCircle,
} from "react-icons/fa";

function NotificationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const response = await getNotificationById(id);
        setNotification(response.data.data);
      } catch {
        alert("Unable to load notification details.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotification();
  }, [id]);

  const getStatusClass = (status) => {
    switch (status) {
      case "SENT":
        return "status-success";

      case "PENDING":
        return "status-warning";

      case "FAILED":
        return "status-danger";

      default:
        return "status-info";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "SENT":
        return <FaCheckCircle />;

      case "PENDING":
        return <FaClock />;

      case "FAILED":
        return <FaTimesCircle />;

      default:
        return <FaInfoCircle />;
    }
  };

  if (loading) {
    return (
      <div className="notification-details-page">
        <div className="notification-loading">
          <div className="spinner-border text-primary"></div>

          <p>Loading notification...</p>
        </div>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="notification-details-page">
        <div className="notification-error">
          <h2>Notification Not Found</h2>

          <button className="back-button" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-details-page">
      <div className="container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft />
          Back
        </button>

        <div className="notification-card">
          <div className="notification-header">
            <div className="notification-icon">
              <FaBell />
            </div>

            <div>
              <h2>Notification Details</h2>
              <p>View complete notification information</p>
            </div>
          </div>

          <div className="notification-grid">
            <div className="info-card">
              <label>Status</label>

              <div
                className={`status-badge ${getStatusClass(
                  notification.notificationStatus,
                )}`}
              >
                {getStatusIcon(notification.notificationStatus)}

                <span>{notification.notificationStatus}</span>
              </div>
            </div>

            <div className="info-card">
              <label>Notification Type</label>

              <h4>{notification.notificationType}</h4>
            </div>

            <div className="info-card">
              <label>
                <FaEnvelope />
                Recipient Email
              </label>

              <p>{notification.recipientEmail || "N/A"}</p>
            </div>

            <div className="info-card">
              <label>
                <FaPhone />
                Recipient Phone
              </label>

              <p>{notification.recipientPhone || "N/A"}</p>
            </div>

            <div className="info-card full-width">
              <label>
                <FaCalendarAlt />
                Created At
              </label>

              <p>
                {notification.createdAt
                  ? new Date(notification.createdAt).toLocaleString()
                  : "N/A"}
              </p>
            </div>

            <div className="message-card full-width">
              <h3>Message</h3>

              <div className="message-box">{notification.message}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationDetails;
