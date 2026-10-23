import { useEffect, useState, useCallback } from "react";
import { getAllFacilities } from "@/api/facilityApi";
import { useNavigate } from "react-router-dom";
import "./ManageFacilities.css";

function ManageFacilities() {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*===  Load Facilities ===*/
  const fetchFacilities = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllFacilities();
      setFacilities(
        res.data?.data?.facility || res.data?.data?.facilities || [],
      );
    } catch {
      setError("Unable to load facilities.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  if (loading) {
    return (
      <div className="manage-facilities-loading">
        <div className="facility-spinner"></div>
        <h2>Loading Facilities...</h2>
        <p>Fetching system facilities.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manage-facilities-error">
        <h2>Something went wrong</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="manage-facilities-page">
      {/* Hero */}

      <div className="manage-facilities-hero">
        <div>
          <h1>Manage Facilities</h1>

          <p>
            Configure every facility available throughout the Hotel Management
            System.
          </p>
        </div>

        <button
          className="add-facility-btn"
          onClick={() => navigate("/admin/create-facility")}
        >
          + Add Facility
        </button>
      </div>
      {/* Statistics */}

      <div className="facility-statistics">
        <div className="facility-stat-card">
          <h2>{facilities.length}</h2>

          <span>Total Facilities</span>
        </div>

        <div className="facility-stat-card">
          <h2>✓</h2>

          <span>Active Services</span>
        </div>

        <div className="facility-stat-card">
          <h2>🏨</h2>

          <span>Available System Wide</span>
        </div>
      </div>

      {/* Empty State */}

      {facilities.length === 0 ? (
        <div className="facility-empty">
          <h2>No Facilities Found</h2>

          <p>Create your first facility to make it available for hotels.</p>

          <button
            className="add-facility-btn"
            onClick={() => navigate("/admin/create-facility")}
          >
            + Create Facility
          </button>
        </div>
      ) : (
        <div className="facility-grid">
          {facilities.map((facility) => (
            <div key={facility.facilityId} className="facility-card">
              <div className="facility-icon">✓</div>

              <div className="facility-content">
                <h3>{facility.facilityName}</h3>

                <p>
                  {facility.facilityDescription ||
                    facility.description ||
                    "No description available."}
                </p>
              </div>

              <div className="facility-actions">
                <button
                  className="edit-btn"
                  onClick={() => alert("Edit functionality coming soon.")}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => alert("Delete functionality coming soon.")}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageFacilities;
