import "./Footer.css";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section */}
        <div className="footer-brand">
          <h2 className="footer-title">Hotel Booking System</h2>
          <p className="footer-description">
            Book your perfect stay anytime, anywhere. Experience comfort, luxury
            and convenience at your fingertips.
          </p>
          <div className="footer-social">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebook className="footer-social-icon" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter className="footer-social-icon" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="footer-social-icon" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FaGithub className="footer-social-icon" />
            </a>
          </div>
        </div>

        {/* Right Section */}
        <div className="footer-contact">
          <h3>Get In Touch</h3>
          <address className="footer-contact-list">
            <div className="footer-contact-item">
              <div className="footer-icon email">
                <FaEnvelope />
              </div>
              <a href="mailto:support@hotel.com">support@hotel.com</a>
            </div>
            <div className="footer-contact-item">
              <div className="footer-icon phone">
                <FaPhoneAlt />
              </div>
              <a href="tel:+919876543210">+91 9876543210</a>
            </div>
            <div className="footer-contact-item">
              <div className="footer-icon location">
                <FaMapMarkerAlt />
              </div>
              <span>Mumbai, India</span>
            </div>
          </address>
        </div>
      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Hotel Booking System. All rights
          reserved.
        </p>
        <div className="footer-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms & Conditions</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
