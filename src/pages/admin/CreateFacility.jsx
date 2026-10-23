import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addFacility } from "@/api/facilityApi";
import "./CreateFacility.css";

function CreateFacility() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // --- Validation ---
  const validate = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Facility name is required.";
    }

    if (!description.trim()) {
      newErrors.description = "Facility description is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      await addFacility({
        facilityName: name,

        facilityDescription: description,
      });

      alert("Facility created successfully.");

      navigate("/admin/manage-facilities");
    } catch (err) {
      alert(err.response?.data?.message || "Unable to create facility.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-facility-page">
      {/* Hero */}
      <div className="create-facility-hero">
        <div>
          <h1>Create Facility</h1>

          <p>
            Add a new facility that can be assigned to hotels across the Hotel
            Management System.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="facility-form-card">
        <form onSubmit={handleSubmit}>
          {/* Facility Name */}
          <div className="form-group">
            <label>Facility Name</label>

            <input
              type="text"
              placeholder="Enter facility name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {errors.name && <small className="error-text">{errors.name}</small>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Facility Description</label>

            <textarea
              rows="5"
              placeholder="Describe this facility..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            {errors.description && (
              <small className="error-text">{errors.description}</small>
            )}
          </div>

          {/* Information Card */}
          <div className="facility-info-box">
            <h3>Information</h3>

            <ul>
              <li>Facilities created here will be available to every hotel.</li>

              <li>
                Managers can later assign these facilities to their hotels.
              </li>

              <li>
                Examples include Swimming Pool, Spa, Free Wi-Fi, Gym,
                Restaurant, Parking, etc.
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="facility-form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/admin/manage-facilities")}
            >
              Cancel
            </button>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Creating..." : "Create Facility"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateFacility;
