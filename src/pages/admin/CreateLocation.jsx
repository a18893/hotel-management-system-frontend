import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addLocation } from "@/api/locationApi";
import "./CreateLocation.css";

function CreateLocation() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    locationName: "",
    city: "",
    description: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  /*===  Handle Input ===*/
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*===  Validation ===*/
  const validate = () => {
    if (!form.locationName.trim()) {
      setError("Location name is required.");
      return false;
    }

    if (!form.city.trim()) {
      setError("City is required.");
      return false;
    }

    if (!form.description.trim()) {
      setError("Description is required.");
      return false;
    }

    return true;
  };

  /*===  Submit ===*/
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");

    setError("");

    if (!validate()) return;

    try {
      setSubmitting(true);

      await addLocation(form);

      setSuccess("Location added successfully.");

      setForm({
        locationName: "",

        city: "",

        description: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create location.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-location-page">
      {/* Hero */}
      <div className="create-location-hero">
        <div>
          <h1>Create New Location</h1>

          <p>Add a new destination that hotels can be assigned to.</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="create-location-card">
        <div className="card-header">
          <h2>Location Information</h2>

          <p>Fill in the details below to create a new location.</p>
        </div>

        <form className="location-form" onSubmit={handleSubmit}>
          {/* Success */}
          {success && <div className="success-message">{success}</div>}

          {/* Error */}
          {error && <div className="error-message">{error}</div>}

          {/* Location Name */}
          <div className="form-group">
            <label>Location Name</label>

            <input
              type="text"
              name="locationName"
              placeholder="Example: Connaught Place"
              value={form.locationName}
              onChange={handleChange}
            />
          </div>

          {/* City */}
          <div className="form-group">
            <label>City</label>

            <input
              type="text"
              name="city"
              placeholder="Example: New Delhi"
              value={form.city}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>

            <textarea
              rows="5"
              name="description"
              placeholder="Describe this location..."
              value={form.description}
              onChange={handleChange}
            />
          </div>

          {/* Buttons */}
          <div className="location-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>

            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? "Creating..." : "Create Location"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateLocation;
