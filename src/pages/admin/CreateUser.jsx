import { useEffect, useState } from "react";
import { getRegistrationMetadata, registerInternal } from "@/api/userApi";
import "./CreateUser.css";
import Swal from "sweetalert2";

function CreateUser() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    emailId: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    street: "",
    pincode: "",
    roles: "",
    password: "",
  });

  const [roles, setRoles] = useState([]);
  const [genders, setGenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  //const navigate = useNavigate();
  const [error, setError] = useState("");

  /*===  Load Registration Metadata ===*/

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        setLoading(true);
        const res = await getRegistrationMetadata();
        const data = res?.data?.data;
        setRoles(data?.roles?.filter((role) => role !== "CUSTOMER") || []);
        setGenders(data?.genders || []);
      } catch {
        setError("Unable to load registration metadata.");
      } finally {
        setLoading(false);
      }
    };

    loadMetadata();
  }, []);

  /*===  Handle Change ===*/

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,

      [e.target.name]: e.target.value,
    }));
  };

  /*===  Submit ===*/

  const handleSubmit = async (e) => {
    e.preventDefault();

    // setSuccess("");

    setError("");

    try {
      setSubmitting(true);

      await registerInternal(form);

      await Swal.fire({
        icon: "success",
        title: "User Registered Successfully",
        text: "The new user has been successfully registered in the system.",
        confirmButtonColor: "#2563eb",
        timer: 2200,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "User Registration Failed",
        text:
          err?.response?.data?.message ||
          "Something went wrong. Unable to register the user. Please try again.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setSubmitting(false);
    }
  };

  /*===  Loading Screen ===*/

  if (loading) {
    return (
      <div className="create-user-loading">
        <div className="create-user-spinner"></div>

        <h2>Loading Registration Data...</h2>

        <p>Please wait while we prepare the user registration form.</p>
      </div>
    );
  }

  /*===  Error Screen ===*/

  if (loading === false && error && roles.length === 0) {
    return (
      <div className="create-user-error">
        <h2>Something went wrong</h2>

        <p>{error}</p>
      </div>
    );
  }

  /*===  Main UI ===*/

  return (
    <div className="create-user-page">
      {/* Hero */}

      <div className="create-user-hero">
        <div>
          <h1>Create Internal User</h1>

          <p>
            Register administrators and managers for the hotel management
            platform.
          </p>
        </div>
      </div>

      {/* Form Card */}

      <div className="create-user-card">
        <div className="card-header">
          <h2>User Information</h2>

          <p>Fill in all required details to create a new internal user.</p>
        </div>

        <form className="create-user-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* First Name */}

            <div className="form-group">
              <label>First Name</label>

              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                required
              />
            </div>

            {/* Last Name */}

            <div className="form-group">
              <label>Last Name</label>

              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                required
              />
            </div>

            {/* Age */}

            <div className="form-group">
              <label>Age</label>

              <input
                type="text"
                name="age"
                value={form.age}
                onChange={handleChange}
                placeholder="Enter age"
                required
              />
            </div>

            {/* Email */}

            <div className="form-group">
              <label>Email Address</label>

              <input
                type="email"
                name="emailId"
                value={form.emailId}
                onChange={handleChange}
                placeholder="example@email.com"
                required
              />
            </div>

            {/* Gender */}

            <div className="form-group">
              <label>Gender</label>

              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>

                {genders.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
            </div>

            {/* Role */}

            <div className="form-group">
              <label>Role</label>

              <select
                name="roles"
                value={form.roles}
                onChange={handleChange}
                required
              >
                <option value="">Select Role</option>

                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Phone */}

            <div className="form-group">
              <label>Phone Number</label>

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </div>

            {/* Country */}

            <div className="form-group">
              <label>Country</label>

              <input
                type="text"
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="Enter country"
                required
              />
            </div>

            {/* State */}

            <div className="form-group">
              <label>State</label>

              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="Enter state"
                required
              />
            </div>

            {/* City */}

            <div className="form-group">
              <label>City</label>

              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Enter city"
                required
              />
            </div>
            {/* Street */}

            <div className="form-group">
              <label>Street</label>

              <input
                type="text"
                name="street"
                value={form.street}
                onChange={handleChange}
                placeholder="Enter street"
                required
              />
            </div>

            {/* Pincode */}

            <div className="form-group">
              <label>Pincode</label>

              <input
                type="text"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                placeholder="Enter pincode"
                required
              />
            </div>

            {/* Password */}

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          {/* Submit */}

          <div className="submit-section">
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? "Creating User..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateUser;
