import "./Register.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getRegistrationMetadata, registerCustomer } from "../../api/userApi";

function Register() {
  const navigate = useNavigate();
  const [genders, setGenders] = useState([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    emailId: "",
    phone: "",
    gender: "",
    country: "",
    state: "",
    city: "",
    street: "",
    pincode: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await getRegistrationMetadata();
        setGenders(response.data.data.genders || []);
      } catch {
        alert("Failed to load registration metadata");
      }
    };

    fetchMetadata();
  }, []);

  const handleChange = ({ target }) => {
    setForm((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await registerCustomer({
        ...form,
        roles: "CUSTOMER",
      });

      alert("Registration Successful");

      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-card register-card">
        <h2 className="form-title register-title">Create Customer Account</h2>

        <p className="register-subtitle">
          Join our Hotel Management System and start booking premium stays.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="register-grid">
            <div className="form-group">
              <input
                className="form-input"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <input
                className="form-input"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <input
              className="form-input"
              type="number"
              name="age"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
              className="form-input"
              type="email"
              name="emailId"
              placeholder="Email Address"
              value={form.emailId}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
              className="form-input"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <select
              className="form-select"
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>

              {genders.map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <input
              className="form-input"
              name="country"
              placeholder="Country"
              value={form.country}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
              className="form-input"
              name="state"
              placeholder="State"
              value={form.state}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
              className="form-input"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
              className="form-input"
              name="street"
              placeholder="Street"
              value={form.street}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
              className="form-input"
              name="pincode"
              placeholder="Pincode"
              value={form.pincode}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button className="form-button" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="form-footer">
          Already have an account?{" "}
          <Link to="/login" className="form-link">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
