import { useState, useMemo } from "react";
import { getNotificationsByEmail } from "@/api/notificationApi";
import "./SearchNotification.css";

function SearchNotification() {
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleSearch = async () => {
    if (!email.trim()) {
      alert("Please enter an email address.");
      return;
    }

    try {
      setLoading(true);
      const res = await getNotificationsByEmail(email);
      setNotifications(res.data?.data || []);
    } catch {
      alert("Unable to fetch notifications.");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    return {
      total: notifications.length,
      email: notifications.filter((n) => n.notificationType === "EMAIL").length,

      sms: notifications.filter((n) => n.notificationType === "SMS").length,

      delivered: notifications.filter(
        (n) =>
          n.notificationStatus === "DELIVERED" ||
          n.notificationStatus === "SUCCESS",
      ).length,
    };
  }, [notifications]);

  return (
    <div className="search-notification-page">
      {/*=== HERO ===*/}
      <section className="notification-search-hero">
        <div>
          <h1>Notification Search</h1>

          <p>
            Search all notifications sent to a customer, review delivery status,
            notification type, and message history in one place.
          </p>
        </div>
      </section>

      {/*=== DASHBOARD STATS ===*/}

      <section className="notification-stats-grid">
        <div className="notification-stat-card total">
          <span>Total Results</span>

          <h2>{stats.total}</h2>
        </div>

        <div className="notification-stat-card email">
          <span>Email Notifications</span>

          <h2>{stats.email}</h2>
        </div>

        <div className="notification-stat-card sms">
          <span>SMS Notifications</span>

          <h2>{stats.sms}</h2>
        </div>

        <div className="notification-stat-card delivered">
          <span>Delivered</span>

          <h2>{stats.delivered}</h2>
        </div>
      </section>

      {/*=== SEARCH CARD ===*/}

      <section className="notification-search-card">
        <div className="section-header">
          <div>
            <h2>Search Notifications</h2>

            <p>
              Enter a customer's email address to retrieve notification history.
            </p>
          </div>
        </div>

        <div className="search-bar">
          <input
            type="email"
            className="form-control"
            placeholder="Enter customer email address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className="search-btn"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </section>

      {/*=== RESULTS ===*/}

      <section className="notification-results-card">
        <div className="section-header">
          <div>
            <h2>Notification History</h2>

            <p>
              View notification details, delivery status, recipient information
              and message content.
            </p>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="empty-notification-state">
            <div className="empty-icon">🔔</div>

            <h3>No Notifications Found</h3>

            <p>
              No notification history is available for the specified email
              address.
            </p>
          </div>
        ) : (
          <div className="notification-grid">
            {notifications.map((n) => (
              <div key={n.notificationId} className="notification-card">
                <div className="notification-header">
                  <span
                    className={`notification-type ${n.notificationType?.toLowerCase()}`}
                  >
                    {n.notificationType}
                  </span>

                  <span
                    className={`notification-status ${(n.notificationStatus || "").toLowerCase()}`}
                  >
                    {n.notificationStatus}
                  </span>
                </div>

                <div className="notification-body">
                  <div className="notification-item">
                    <label>Email</label>

                    <p>{n.recipientEmail}</p>
                  </div>

                  <div className="notification-item">
                    <label>Message</label>

                    <p>{n.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default SearchNotification;
