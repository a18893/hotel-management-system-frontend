import "./NotificationsPage.css";
import React, { useEffect, useState } from "react";
import { getMyNotifications } from "../../api/notificationApi";
import NotificationCard from "../../components/NotificationCard";
import {
  FaBell,
  FaEnvelopeOpenText,
  FaExclamationCircle,
  FaInbox,
  FaSyncAlt,
} from "react-icons/fa";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await getMyNotifications();
      const records = response.data?.data?.content || [];
      setNotifications(records);
      setError("");
    } catch {
      setError("Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const totalNotifications = notifications.length;
  const unreadNotifications = notifications.filter(
    (n) => n.notificationStatus === "UNREAD" || n.status === "UNREAD",
  ).length;

  const importantNotifications = notifications.filter(
    (n) => n.notificationType === "PAYMENT" || n.notificationType === "BOOKING",
  ).length;

  if (loading) {
    return (
      <div className="notifications-loading">
        <div className="loader"></div>
        <h3>Loading Notifications</h3>
        <p>Please wait while we fetch your latest updates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notifications-error">
        <FaExclamationCircle className="error-icon" />
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button className="retry-btn" onClick={loadNotifications}>
          <FaSyncAlt />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      {/* Header */}
      <section className="notifications-hero">
        <div>
          <h1>
            <FaBell />
            My Notifications
          </h1>
          <p>
            Stay updated with booking confirmations, payments, offers and
            important hotel announcements.
          </p>
        </div>
        <div className="notification-badge">
          <FaBell />
          {totalNotifications}
        </div>
      </section>
      {/* Statistics */}
      <section className="notification-stats">
        <div className="notification-stat-card">
          <FaBell className="stat-icon blue" />
          <h2>{totalNotifications}</h2>
          <p>Total Notifications</p>
        </div>
        <div className="notification-stat-card">
          <FaEnvelopeOpenText className="stat-icon green" />
          <h2>{unreadNotifications}</h2>
          <p>Unread</p>
        </div>
        <div className="notification-stat-card">
          <FaExclamationCircle className="stat-icon orange" />
          <h2>{importantNotifications}</h2>
          <p>Booking & Payment</p>
        </div>
      </section>
      {/* Notifications */}
      <section className="notification-content">
        {notifications.length === 0 ? (
          <div className="empty-notification">
            <FaInbox className="empty-icon" />
            <h3>No Notifications Yet</h3>
            <p>
              You're all caught up. New booking updates and payment alerts will
              appear here.
            </p>
          </div>
        ) : (
          <div className="notification-grid">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.notificationId || notification.id}
                notification={notification}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default NotificationsPage;
