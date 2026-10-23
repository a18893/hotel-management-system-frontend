import { useEffect, useState } from "react";
import { getAllLocations } from "@/api/locationApi";
import { useNavigate } from "react-router-dom";
import "./ManageLocations.css";

function ManageLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /*===  Fetch Locations ===*/
  const fetchLocations = async () => {
    try {
      setLoading(true);

      const res = await getAllLocations();

      setLocations(res.data?.data?.locations || []);
    } catch {
      alert("Unable to fetch locations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  /*===  Loading ===*/

  if (loading) {
    return (
      <div className="manage-locations-loading">
        <div className="location-spinner"></div>

        <h2>Loading Locations...</h2>

        <p>Fetching all registered locations.</p>
      </div>
    );
  }

  return (
    <div className="manage-locations-page">
      {/* Hero */}

      <div className="manage-locations-hero">
        <div>
          <h1>Location Management</h1>

          <p>Manage all cities and hotel locations across the platform.</p>
        </div>

        <button
          className="add-location-btn"
          onClick={() => navigate("/admin/create-location")}
        >
          + Add Location
        </button>
      </div>

      {/* Statistics */}

      <div className="location-stats">
        <div className="location-stat-card">
          <h2>{locations.length}</h2>

          <span>Registered Locations</span>
        </div>
      </div>

      {/* Table */}

      <div className="location-table-card">
        <div className="table-header">
          <div>
            <h2>Available Locations</h2>

            <p>Cities currently available for hotel registration.</p>
          </div>
        </div>

        {locations.length === 0 ? (
          <div className="location-empty">
            <h3>No Locations Found</h3>

            <p>Add your first location to begin.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>City</th>
                    <th>Description</th>
                    <th className="center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {locations.map((location) => (
                    <tr key={location.locationId}>
                      <td>
                        <div className="location-name">
                          {location.locationName}
                        </div>

                        <small>{location.locationId}</small>
                      </td>

                      <td>
                        <span className="city-badge">{location.city}</span>
                      </td>

                      <td>
                        {location.description || "No description available."}
                      </td>

                      <td className="center">
                        <div className="action-buttons">
                          <button className="edit-btn">Edit</button>
                          <button className="delete-btn">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageLocations;
