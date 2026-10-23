import "./CustomerDashboard.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHotel,
  FaBell,
  FaUser,
  FaClipboardList,
  FaStar,
} from "react-icons/fa";
import { getMyProfile } from "../../api/userApi";
import { getMyBookings } from "../../api/bookingApi";
import { getMyNotifications } from "../../api/notificationApi";

function CustomerDashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        const [userRes, bookingRes, notificationRes] = await Promise.all([
          getMyProfile(),
          getMyBookings(),
          getMyNotifications(),
        ]);

        if (!mounted) return;
        setUser(userRes.data.data);
        setBookings(bookingRes.data.data || []);
        setNotifications(notificationRes.data?.data?.content || []);
      } catch {
        alert("Failed to load dashboard data.");
      }
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="dashboard-page">
      {/* Hero */}

      <section className="dashboard-hero">
        <div className="container">
          <h1>Welcome, {user?.firstName || "Customer"} 👋</h1>

          <p>
            Manage your bookings, profile, reviews and notifications from one
            place.
          </p>
        </div>
      </section>

      <div className="container py-5">
        {/* Statistics */}

        <div className="row g-4 mb-5">
          <div className="col-md-6 col-xl-3">
            <div className="dashboard-stat-card">
              <FaClipboardList className="dashboard-icon" />

              <h2>{bookings.length}</h2>

              <p>Total Bookings</p>
            </div>
          </div>

          <div className="col-md-6 col-xl-3">
            <div className="dashboard-stat-card">
              <FaBell className="dashboard-icon" />

              <h2>{notifications.length}</h2>

              <p>Notifications</p>
            </div>
          </div>

          <div className="col-md-6 col-xl-3">
            <div className="dashboard-stat-card">
              <FaStar className="dashboard-icon" />

              <h2>Active</h2>

              <p>Member Status</p>
            </div>
          </div>

          <div className="col-md-6 col-xl-3">
            <div className="dashboard-stat-card">
              <FaUser className="dashboard-icon" />

              <h2>{user?.firstName || "-"}</h2>

              <p>Profile</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}

        <h3 className="dashboard-heading">Quick Actions</h3>

        <div className="row g-4 mb-5">
          <div className="col-md-6 col-lg-3">
            <Link to="/" className="dashboard-action-card">
              <FaHotel />

              <h5>Browse Hotels</h5>

              <p>Explore available hotels and destinations.</p>
            </Link>
          </div>

          <div className="col-md-6 col-lg-3">
            <Link to="/my-bookings" className="dashboard-action-card">
              <FaClipboardList />

              <h5>My Bookings</h5>

              <p>View all current and previous bookings.</p>
            </Link>
          </div>

          <div className="col-md-6 col-lg-3">
            <Link to="/notifications" className="dashboard-action-card">
              <FaBell />

              <h5>Notifications</h5>

              <p>Stay updated with booking alerts.</p>
            </Link>
          </div>

          <div className="col-md-6 col-lg-3">
            <Link to="/profile" className="dashboard-action-card">
              <FaUser />

              <h5>My Profile</h5>

              <p>Update your personal information.</p>
            </Link>
          </div>
        </div>

        {/* Recent Bookings */}

        <div className="dashboard-table-card">
          <div className="table-header">
            <h3>Recent Booking Activity</h3>
          </div>

          {bookings.length === 0 ? (
            <div className="empty-state">
              <FaHotel />

              <h4>No Bookings Yet</h4>

              <p>Start exploring hotels and make your first reservation.</p>

              <Link to="/" className="btn btn-primary">
                Browse Hotels
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>ID</th>

                    <th>Hotel</th>

                    <th>Status</th>

                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.slice(0, 5).map((booking) => (
                    <tr key={booking.bookingId}>
                      <td>{booking.bookingId}</td>

                      <td>{booking.hotelId}</td>

                      <td>
                        <span
                          className={`badge ${
                            booking.bookingStatus === "CONFIRMED"
                              ? "bg-success"
                              : "bg-warning"
                          }`}
                        >
                          {booking.bookingStatus}
                        </span>
                      </td>

                      <td>
                        <Link
                          className="btn btn-sm btn-outline-primary"
                          to={`/payment/details/${booking.bookingId}`}
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;
