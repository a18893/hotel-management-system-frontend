import { Link } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      {/* Hero */}
      <section className="admin-hero">
        <div>
          <h1>Admin Dashboard</h1>

          <p>
            Centralized administration panel for managing users, hotels,
            bookings, facilities, notifications and overall system operations.
          </p>
        </div>

        <div className="admin-role-card">
          <h2>ADMIN</h2>

          <span>System Administrator</span>
        </div>
      </section>

      {/* Quick Statistics */}
      <section className="admin-stats">
        <div className="admin-stat-card">
          <h2>👥</h2>

          <h3>User Management</h3>

          <p>Manage customers, managers and administrators.</p>
        </div>

        <div className="admin-stat-card">
          <h2>🏨</h2>

          <h3>Hotels</h3>

          <p>Maintain hotels, inventory and room availability.</p>
        </div>

        <div className="admin-stat-card">
          <h2>📅</h2>

          <h3>Bookings</h3>

          <p>Monitor every booking across the platform.</p>
        </div>

        <div className="admin-stat-card">
          <h2>⭐</h2>

          <h3>Reviews</h3>

          <p>Moderate guest reviews and ratings.</p>
        </div>
      </section>

      {/* Management Cards */}
      <section className="admin-grid">
        {/* User Management */}
        <div className="admin-card">
          <div className="admin-card-icon">👥</div>

          <h3>User Management</h3>

          <p>Create users, assign managers and manage internal user roles.</p>

          <div className="admin-actions">
            <Link to="/admin/users" className="admin-btn primary">
              Manage Users
            </Link>

            <Link to="/admin/create-user" className="admin-btn secondary">
              Create User
            </Link>

            <Link to="/admin/assign-manager" className="admin-btn dark">
              Assign Manager
            </Link>
          </div>
        </div>

        {/* Hotel Management */}
        <div className="admin-card">
          <div className="admin-card-icon">🏨</div>

          <h3>Hotel Management</h3>

          <p>Create hotels, manage inventory and maintain hotel information.</p>

          <div className="admin-actions">
            <Link to="/admin/manage-hotels" className="admin-btn success">
              Manage Hotels
            </Link>

            <Link to="/admin/create-hotel" className="admin-btn secondary">
              Create Hotel
            </Link>
          </div>
        </div>

        {/* Bookings */}
        <div className="admin-card">
          <div className="admin-card-icon">📅</div>

          <h3>Bookings</h3>

          <p>
            View every booking across the platform and monitor reservations.
          </p>

          <div className="admin-actions">
            <Link to="/admin/bookings" className="admin-btn info">
              View Bookings
            </Link>
          </div>
        </div>

        {/* Infrastructure */}
        <div className="admin-card">
          <div className="admin-card-icon">🏗</div>

          <h3>Infrastructure</h3>

          <p>
            Manage locations and facilities used throughout the booking
            platform.
          </p>

          <div className="admin-actions">
            <Link to="/admin/manage-locations" className="admin-btn warning">
              Locations
            </Link>

            <Link to="/admin/create-location" className="admin-btn secondary">
              Add Location
            </Link>

            <Link to="/admin/manage-facilities" className="admin-btn warning">
              Facilities
            </Link>

            <Link to="/admin/create-facility" className="admin-btn secondary">
              Add Facility
            </Link>
          </div>
        </div>

        {/* Notifications */}
        <div className="admin-card">
          <div className="admin-card-icon">🔔</div>

          <h3>Notifications</h3>

          <p>
            View notification history and monitor messages delivered across the
            system.
          </p>

          <div className="admin-actions">
            <Link to="/notifications" className="admin-btn secondary">
              View Notifications
            </Link>

            <Link to="/admin/search-notification" className="admin-btn dark">
              Search Notifications
            </Link>
          </div>
        </div>

        {/* Review Management */}
        <div className="admin-card">
          <div className="admin-card-icon">⭐</div>

          <h3>Review Management</h3>

          <p>
            Moderate customer reviews and remove inappropriate feedback from the
            platform.
          </p>

          <div className="admin-actions">
            <Link to="/admin/reviews" className="admin-btn danger">
              Manage Reviews
            </Link>
          </div>
        </div>

        {/* System Status */}
        <div className="admin-card">
          <div className="admin-card-icon">🖥️</div>

          <h3>System Status</h3>

          <p>Monitor the overall health of the Hotel Management System.</p>

          <div className="system-status">
            <span className="status-dot"></span>

            <strong>System Online</strong>
          </div>

          <div className="admin-role">
            Current Role:
            <span> ADMIN</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
