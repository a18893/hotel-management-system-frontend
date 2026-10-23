import "./AboutUs.css";
import { FaHotel, FaUsers, FaShieldAlt, FaCheckCircle } from "react-icons/fa";

function AboutUs() {
  return (
    <div className="about-page">
      {/* === HERO === */}

      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <h1>About Our Platform</h1>

            <p>
              Building a smarter, faster and more secure hotel booking
              experience for customers, hotel managers and administrators.
            </p>
          </div>
        </div>
      </section>

      {/* ===  ABOUT === */}

      <section className="about-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2>Welcome to Our Hotel Management System</h2>

              <p>
                HotelHub is a modern hotel booking platform developed to
                simplify hotel reservations while providing powerful management
                tools for administrators and hotel managers.
              </p>

              <p>
                Customers can discover hotels, compare prices, check room
                availability, make bookings, write reviews, receive
                notifications, and manage reservations from one platform.
              </p>

              <p>
                Managers and administrators can efficiently oversee hotels,
                bookings, payments, customers, and reports using dedicated
                dashboards.
              </p>
            </div>

            <div className="col-lg-6">
              <div className="about-image-card">
                <FaHotel className="about-icon-large" />

                <h3>Smart Hotel Management</h3>

                <p>
                  Fast, secure and scalable booking platform built with React,
                  Spring Boot and MySQL.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === MISSION === */}

      <section className="mission-section">
        <div className="container">
          <div className="section-title">
            <h2>Our Mission</h2>

            <p>Deliver the best digital hotel booking experience.</p>
          </div>

          <div className="mission-card">
            <p>
              Our mission is to provide a secure, transparent and efficient
              platform that connects travelers with hotels while helping
              businesses streamline their daily operations through modern
              technology.
            </p>
          </div>
        </div>
      </section>

      {/* === FEATURES === */}

      <section className="features-section">
        <div className="container">
          <div className="section-title">
            <h2>Platform Features</h2>

            <p>Everything needed for a seamless hotel management experience.</p>
          </div>

          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="feature-box">
                <FaHotel />

                <h5>Hotel Booking</h5>

                <p>Browse hotels with real-time room availability.</p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="feature-box">
                <FaUsers />

                <h5>Role Dashboards</h5>

                <p>Separate dashboards for Customer, Manager and Admin.</p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="feature-box">
                <FaShieldAlt />

                <h5>Secure Payments</h5>

                <p>Secure booking workflow with payment integration.</p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="feature-box">
                <FaCheckCircle />

                <h5>Notifications</h5>

                <p>Instant booking updates and customer notifications.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === WHY US === */}

      <section className="why-section">
        <div className="container">
          <div className="section-title">
            <h2>Why Choose Our Platform?</h2>
          </div>

          <div className="why-card">
            <ul>
              <li>Modern and intuitive user interface</li>
              <li>Role-based secure authentication</li>
              <li>Scalable Spring Boot backend</li>
              <li>Responsive design for all devices</li>
              <li>Fast hotel booking experience</li>
              <li>Reliable architecture for future expansion</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
