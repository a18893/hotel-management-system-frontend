import { Link } from "react-router-dom";
import "./ManagerDashboard.css";

function ManagerDashboard() {
  return (
    <div className="manager-dashboard">
      {/* Hero */}
      <section className="manager-hero">
        <div className="container">
          <div className="manager-hero-content">
            <div>
              <span className="manager-badge">HOTEL MANAGEMENT PORTAL</span>
              <h1>Manager Dashboard</h1>
              <p>
                Manage bookings, hotel information, facilities and customer
                reviews from one centralized workspace.
              </p>
            </div>
            <div className="manager-status-card">
              <h4>System Status</h4>
              <div className="status-online">● Online</div>
              <p>
                Role:
                <strong> MANAGER</strong>
              </p>
              <p>Hotel Operations Active</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}

      <section className="manager-stats">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div className="stat-card">
                <h2>Bookings</h2>
                <p>Manage reservations</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="stat-card">
                <h2>Hotel</h2>
                <p>Property information</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="stat-card">
                <h2>Facilities</h2>
                <p>Available amenities</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="stat-card">
                <h2>Reviews</h2>
                <p>Customer feedback</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Management Cards */}

      <section className="manager-services">
        <div className="container">
          <div className="section-title">
            <h2>Management Tools</h2>

            <p>Access every management feature from one place.</p>
          </div>

          <div className="row g-4">
            {/* BOOKINGS */}

            <div className="col-lg-4 col-md-6">
              <div className="manager-card">
                <div className="manager-icon">📅</div>

                <h3>Bookings</h3>

                <p>
                  View new bookings, approve reservations and manage guests.
                </p>

                <Link to="/manager/bookings" className="btn btn-primary w-100">
                  View Bookings
                </Link>
              </div>
            </div>

            {/* HOTEL */}

            <div className="col-lg-4 col-md-6">
              <div className="manager-card">
                <div className="manager-icon">🏨</div>

                <h3>My Hotel</h3>

                <p>View and manage your assigned hotel information.</p>

                <Link to="/manager/hotel" className="btn btn-info w-100">
                  View Hotel
                </Link>
              </div>
            </div>

            {/* FACILITIES */}

            <div className="col-lg-4 col-md-6">
              <div className="manager-card">
                <div className="manager-icon">🛎️</div>

                <h3>Facilities</h3>

                <p>Add or remove hotel facilities available to customers.</p>

                <Link
                  to="/manager/facilities"
                  className="btn btn-warning w-100"
                >
                  Manage Facilities
                </Link>
              </div>
            </div>

            {/* REVIEWS */}

            <div className="col-lg-4 col-md-6">
              <div className="manager-card">
                <div className="manager-icon">⭐</div>

                <h3>Customer Reviews</h3>

                <p>Read customer experiences and maintain service quality.</p>

                <Link to="/manager/reviews" className="btn btn-success w-100">
                  View Reviews
                </Link>
              </div>
            </div>

            {/* NOTIFICATIONS */}

            <div className="col-lg-4 col-md-6">
              <div className="manager-card">
                <div className="manager-icon">🔔</div>

                <h3>Notifications</h3>

                <p>Stay informed about booking updates and alerts.</p>

                <Link to="/notifications" className="btn btn-secondary w-100">
                  View Notifications
                </Link>
              </div>
            </div>

            {/* STATUS */}

            <div className="col-lg-4 col-md-6">
              <div className="manager-card status-card">
                <div className="manager-icon">🖥️</div>

                <h3>System Status</h3>

                <p>Your management account is verified and active.</p>

                <button className="btn btn-dark w-100" disabled>
                  ✔ System Online
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ManagerDashboard;
