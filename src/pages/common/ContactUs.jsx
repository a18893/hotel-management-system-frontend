import "./ContactUs.css";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";

const ContactUs = () => {
  return (
    <div className="contact-page">
      {/* Hero Section */}

      <section className="contact-hero">
        <div className="container text-center">
          <h1>Contact Us</h1>

          <p>
            We'd love to hear from you. Whether you have a question, feedback,
            or need booking assistance, our team is ready to help.
          </p>
        </div>
      </section>

      {/* Main Section */}

      <section className="container contact-container">
        <div className="row g-5">
          {/* Left Side */}

          <div className="col-lg-5">
            <div className="contact-info-card">
              <h2>Get In Touch</h2>

              <p>
                Our support team is available to assist you with bookings,
                payments, hotel information, and any technical issues.
              </p>

              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />

                <div>
                  <h6>Office Address</h6>
                  <span>123 Business Avenue, City, Country</span>
                </div>
              </div>

              <div className="contact-item">
                <FaPhoneAlt className="contact-icon" />

                <div>
                  <h6>Phone</h6>
                  <span>+91 98765 43210</span>
                </div>
              </div>

              <div className="contact-item">
                <FaEnvelope className="contact-icon" />

                <div>
                  <h6>Email</h6>
                  <span>support@hotelmanagement.com</span>
                </div>
              </div>

              <div className="contact-item">
                <FaClock className="contact-icon" />

                <div>
                  <h6>Working Hours</h6>
                  <span>Mon – Fri (9:00 AM – 6:00 PM)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}

          <div className="col-lg-7">
            <div className="contact-form-card">
              <h2>Send Us a Message</h2>

              <form>
                <div className="form-group">
                  <label className="form-label">Full Name</label>

                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>

                  <input
                    type="email"
                    className="form-input"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message</label>

                  <textarea
                    rows="6"
                    className="form-textarea"
                    placeholder="Write your message..."
                  />
                </div>

                <button className="form-button">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
