import "./Profile.css";
import { useEffect, useState } from "react";
import { getMyProfile } from "../../api/userApi";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUserShield,
  FaGlobe,
} from "react-icons/fa";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMyProfile();
        setUser(response.data.data);
      } catch {
        alert("Unable to load profile details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="spinner-border text-primary"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-error">
          <h2>Profile Not Found</h2>
          <p>Unable to load your profile.</p>
        </div>
      </div>
    );
  }

  const initials = `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`;

  return (
    <div className="profile-page">
      <div className="container">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar">{initials}</div>
          <div>
            <h2>
              {user.firstName} {user.lastName}
            </h2>
            <p>Welcome to your profile</p>
          </div>
        </div>
        {/* Profile Grid */}
        <div className="profile-grid">
          {/* Personal */}
          <div className="profile-card">
            <h3>
              <FaUser />
              Personal Information
            </h3>
            <div className="profile-item">
              <span>First Name</span>
              <strong>{user.firstName}</strong>
            </div>
            <div className="profile-item">
              <span>Last Name</span>
              <strong>{user.lastName}</strong>
            </div>
            <div className="profile-item">
              <span>Gender</span>
              <strong>{user.gender || "N/A"}</strong>
            </div>
            <div className="profile-item">
              <span>Age</span>
              <strong>{user.age || "N/A"}</strong>
            </div>
          </div>

          {/* Contact */}
          <div className="profile-card">
            <h3>
              <FaEnvelope />
              Contact Information
            </h3>
            <div className="profile-item">
              <span>Email</span>
              <strong>{user.emailId}</strong>
            </div>
            <div className="profile-item">
              <span>Phone</span>
              <strong>{user.phone}</strong>
            </div>
            <div className="profile-item">
              <span>Role</span>
              <strong>
                <FaUserShield /> {user.roles}
              </strong>
            </div>
          </div>
          {/* Address */}
          <div className="profile-card full-width">
            <h3>
              <FaMapMarkerAlt />
              Address
            </h3>
            <div className="profile-address">
              <div className="profile-item">
                <span>Country</span>
                <strong>{user.country || "N/A"}</strong>
              </div>
              <div className="profile-item">
                <span>State</span>
                <strong>{user.state || "N/A"}</strong>
              </div>
              <div className="profile-item">
                <span>City</span>
                <strong>{user.city || "N/A"}</strong>
              </div>
              <div className="profile-item">
                <span>Street</span>
                <strong>{user.street || "N/A"}</strong>
              </div>
              <div className="profile-item">
                <span>Pincode</span>
                <strong>{user.pincode || "N/A"}</strong>
              </div>
            </div>
          </div>
          {/* Account */}
          <div className="profile-card full-width">
            <h3>
              <FaGlobe />
              Account Status
            </h3>
            <div className="account-status">
              <div>
                <span>Status</span>
                <strong className="active-status">Active</strong>
              </div>
              <div>
                <span>Membership</span>
                <strong>Verified Customer</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
