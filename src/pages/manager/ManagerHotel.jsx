import { useEffect, useState } from "react";
import { getHotelById } from "@/api/hotelApi";
import { useManagerHotelId } from "@/hooks/useManagerHotelId";
import "./ManagerHotel.css";

function ManagerHotel() {
  const { hotelId, loading: hotelLoading } = useManagerHotelId();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);
        if (!hotelId) {
          setError("No hotel assigned.");
          return;
        }
        const response = await getHotelById(hotelId);
        setHotel(response.data.data.hotel);
      } catch {
        setError("Unable to load hotel details.");
      } finally {
        setLoading(false);
      }
    };

    if (hotelId) {
      fetchHotel();
    }
  }, [hotelId]);

  if (loading || hotelLoading) {
    return (
      <div className="manager-hotel-loading">
        <div className="hotel-spinner"></div>
        <h2>Loading Hotel...</h2>
        <p>Please wait while we retrieve your hotel information.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manager-hotel-error">
        <h2>Oops!</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="manager-hotel-error">
        <h2>No Hotel Assigned</h2>
      </div>
    );
  }

  const occupancy =
    hotel.totalRooms > 0
      ? ((hotel.bookedRooms / hotel.totalRooms) * 100).toFixed(0)
      : 0;
  const availableRooms =
    hotel.availableRooms ?? hotel.totalRooms - hotel.bookedRooms;

  return (
    <div className="manager-hotel-page">
      {/* === HERO === */}
      <div className="manager-hotel-hero">
        <img
          src={
            hotel.images?.length
              ? `${import.meta.env.VITE_API_BASE_URL}/api/hotels/image/${hotel.images[0]}`
              : "https://via.placeholder.com/1200x450?text=Hotel"
          }
          alt={hotel.hotelName}
        />
        <div className="hero-overlay">
          <h1>{hotel.hotelName}</h1>
          <p>
            {hotel.location?.city}, {hotel.street}, {hotel.pincode}
          </p>
        </div>
      </div>

      {/* === STATISTICS === */}
      <div className="hotel-statistics">
        <div className="hotel-stat-card">
          <h2>₹{hotel.pricePerDay?.toLocaleString()}</h2>
          <span>Price Per Night</span>
        </div>
        <div className="hotel-stat-card">
          <h2>{hotel.totalRooms}</h2>
          <span>Total Rooms</span>
        </div>
        <div className="hotel-stat-card">
          <h2>{hotel.bookedRooms}</h2>
          <span>Occupied Rooms</span>
        </div>
        <div className="hotel-stat-card">
          <h2>{occupancy}%</h2>
          <span>Occupancy</span>
        </div>
      </div>

      {/* === DETAILS === */}
      <div className="manager-hotel-grid">
        <div className="hotel-info-card">
          <h3>Property Information</h3>
          <div className="hotel-info-row">
            <span>Hotel Name</span>
            <strong>{hotel.hotelName}</strong>
          </div>
          <div className="hotel-info-row">
            <span>Price Per Night</span>
            <strong>₹{hotel.pricePerDay?.toLocaleString()}</strong>
          </div>
          <div className="hotel-info-row">
            <span>Total Rooms</span>
            <strong>{hotel.totalRooms}</strong>
          </div>
          <div className="hotel-info-row">
            <span>Occupied Rooms</span>
            <strong>{hotel.bookedRooms}</strong>
          </div>
          <div className="hotel-info-row">
            <span>Available Rooms</span>
            <strong>{availableRooms}</strong>
          </div>
        </div>
        <div className="hotel-info-card">
          <h3>Address & Location</h3>
          <div className="hotel-info-row">
            <span>Street</span>
            <strong>{hotel.street}</strong>
          </div>
          <div className="hotel-info-row">
            <span>Pincode</span>
            <strong>{hotel.pincode}</strong>
          </div>
          <div className="hotel-info-row">
            <span>City</span>
            <strong>{hotel.location?.city}</strong>
          </div>
        </div>
      </div>

      {/* === OCCUPANCY === */}
      <div className="occupancy-card">
        <div className="occupancy-header">
          <h3>Room Occupancy</h3>
          <span>{occupancy}%</span>
        </div>
        <div className="occupancy-progress">
          <div
            className="occupancy-fill"
            style={{ width: `${occupancy}%` }}
          ></div>
        </div>
        <div className="occupancy-details">
          <div>
            <strong>{hotel.bookedRooms}</strong>
            <span>Occupied</span>
          </div>
          <div>
            <strong>{availableRooms}</strong>
            <span>Available</span>
          </div>
          <div>
            <strong>{hotel.totalRooms}</strong>
            <span>Total</span>
          </div>
        </div>
        <p className="occupancy-text">
          {hotel.bookedRooms} out of {hotel.totalRooms} rooms are currently
          occupied.
        </p>
      </div>
    </div>
  );
}

export default ManagerHotel;
