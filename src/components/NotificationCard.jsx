import "./NotificationCard.css";
import { useNavigate } from "react-router-dom";
import { getStoredToken, decodeToken } from "@/api/authApi";

function NotificationCard({ notification }) {
  const navigate = useNavigate();
  const token = getStoredToken();
  let userRole = "";

  if (token) {
    const decoded = decodeToken(token);
    userRole = decoded?.role?.toUpperCase() || "";
  }

  const isManagement = userRole === "ADMIN" || userRole === "MANAGER";
  const detailId = notification.notificationId || notification.id;

  const handleClick = () => {
    if (detailId) {
      navigate(`/notifications/${detailId}`);
    }
  };

  return (
    <article className="notification-card" onClick={handleClick}>
      <div className="notification-card__body">
        <p className="notification-card__message">{notification.message}</p>
        {isManagement ? (
          <div className="notification-card__status">
            <span className="notification-card__status-label">Status</span>
            <span className="notification-card__badge">
              {notification.notificationStatus || notification.status || "SENT"}
            </span>
          </div>
        ) : (
          <p className="notification-card__type">
            {notification.notificationType}
          </p>
        )}
      </div>
    </article>
  );
}

export default NotificationCard;
