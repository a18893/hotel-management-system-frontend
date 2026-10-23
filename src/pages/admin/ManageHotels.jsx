import { useEffect, useState } from "react";
import { getAllHotels, deleteHotel } from "@/api/hotelApi";
import { useNavigate } from "react-router-dom";
import "./ManageHotels.css";

function ManageHotels() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  /*===  Fetch Hotels ===*/
  const fetchHotels = async () => {
    try {
      setLoading(true);
      const res = await getAllHotels();
      setHotels(res.data?.data?.hotels || []);
    } catch {
      alert("Unable to fetch hotels.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  /*===  Delete Hotel ===*/

  const handleDelete = async (hotelId, hotelName) => {
    const confirmed = window.confirm(`Delete "${hotelName}"?`);
    if (!confirmed) return;

    try {
      await deleteHotel(hotelId);
      fetchHotels();
    } catch {
      alert("Delete failed.");
    }
  };

  if (loading) {
    return (
      <div className="manage-hotels-loading">
        <div className="hotel-spinner"></div>
        <h2>Loading Hotels...</h2>
        <p>Retrieving hotel inventory.</p>
      </div>
    );
  }

  return (
    <div className="manage-hotels-page">
      {/* Hero */}
      <div className="manage-hotels-hero">
        <div>
          <h1>Hotel Management</h1>
          <p>
            View, edit and manage every hotel property registered in the system.
          </p>
        </div>

        <button
          className="add-hotel-btn"
          onClick={() => navigate("/admin/create-hotel")}
        >
          + Add Hotel
        </button>
      </div>

      {/* Statistics */}

      <div className="manage-hotel-stats-grid">
        <div className="manage-hotel-stat-card">
          <h2>{hotels.length}</h2>
          <span>Total Hotels</span>
        </div>

        <div className="manage-hotel-stat-card">
          <h2>
            {hotels.reduce((sum, hotel) => sum + (hotel.totalRooms || 0), 0)}
          </h2>
          <span>Total Rooms</span>
        </div>

        <div className="manage-hotel-stat-card">
          <h2>
            {hotels.reduce(
              (sum, hotel) => sum + (hotel.availableRooms || 0),
              0,
            )}
          </h2>
          <span>Available Rooms</span>
        </div>
      </div>

      {/* Empty */}

      {hotels.length === 0 ? (
        <div className="manage-hotel-empty-card">
          <h2>No Hotels Found</h2>
          <p> Start by creating your first hotel.</p>
        </div>
      ) : (
        <div className="manage-hotel-list">
          {hotels.map((hotel) => {
            const occupied = hotel.totalRooms - hotel.availableRooms;

            const occupancy =
              hotel.totalRooms > 0
                ? ((occupied / hotel.totalRooms) * 100).toFixed(0)
                : 0;

            return (
              <div className="manage-hotel-card" key={hotel.hotelId}>
                {/* Image */}
                <div className="manage-hotel-image-wrapper">
                  <div className="manage-hotel-image">
                    <img
                      src={
                        hotel.images && hotel.images.length > 0
                          ? `${import.meta.env.VITE_API_BASE_URL}/api/hotels/image/${hotel.images[0]}`
                          : "/vite.svg"
                      }
                      alt={hotel.hotelName}
                      onError={(e) => {
                        e.target.src = "/vite.svg";
                      }}
                    />
                  </div>
                </div>
                {/* Content */}

                <div className="manage-hotel-content">
                  <div className="manage-hotel-header">
                    <div className="manage-hotel-title">
                      <h2>{hotel.hotelName}</h2>

                      <div className="manage-hotel-location">
                        📍 {hotel.location?.city}
                      </div>
                    </div>

                    <div className="manage-hotel-price">
                      ₹{hotel.pricePerDay?.toLocaleString()}/night
                    </div>
                  </div>

                  <div className="manage-hotel-room-info">
                    <div>
                      <strong> Total Rooms </strong>
                      <span> {hotel.totalRooms} </span>
                    </div>

                    <div>
                      <strong> Available </strong>
                      <span> {hotel.availableRooms} </span>
                    </div>

                    <div>
                      <strong> Occupied </strong>
                      <span> {occupied} </span>
                    </div>
                  </div>

                  {/* Occupancy */}

                  <div className="manage-hotel-occupancy-section">
                    <div className="manage-hotel-occupancy-header">
                      <div className="manage-hotel-occupancy-label">
                        Occupancy
                      </div>
                      <div className="manage-hotel-occupancy-percent">
                        {occupancy}%
                      </div>
                    </div>
                    <div className="manage-hotel-occupancy-bar">
                      <div
                        className="manage-hotel-occupancy-fill"
                        style={{ width: `${occupancy}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Buttons */}

                  <div className="manage-hotel-actions">
                    <button
                      className="view-btn"
                      onClick={() => navigate(`/hotel/${hotel.hotelId}`)}
                    >
                      View
                    </button>

                    <button
                      className="edit-btn"
                      onClick={() =>
                        navigate(`/admin/edit-hotel/${hotel.hotelId}`)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(hotel.hotelId, hotel.hotelName)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ManageHotels;
