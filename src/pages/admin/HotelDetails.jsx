import { useEffect, useState } from "react";
import { getHotelById, getHotelImage } from "@/api/hotelApi";
import { useParams } from "react-router-dom";
import "./HotelDetails.css";

function HotelDetails() {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchHotel = async () => {
      try {
        setLoading(true);
        const res = await getHotelById(hotelId);
        const hotelData = res.data?.data?.hotel;
        if (isMounted && hotelData) {
          setHotel(hotelData);
          if (hotelData.images && hotelData.images.length > 0) {
            setActiveImage(getHotelImage(hotelData.images[0]));
          }
        }
      } catch {
        if (isMounted) {
          setError("Unable to load hotel details.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchHotel();

    return () => {
      isMounted = false;
    };
  }, [hotelId]);

  if (loading) {
    return (
      <div className="hotel-details-loading">
        <div className="hotel-spinner"></div>

        <h2>Loading Hotel...</h2>

        <p>Fetching hotel information.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hotel-details-error">
        <h2>Oops!</h2>

        <p>{error}</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="hotel-details-error">
        <h2>No Hotel Found</h2>
      </div>
    );
  }

  const availableRooms = hotel.totalRooms - hotel.bookedRooms;
  const occupancy =
    hotel.totalRooms > 0
      ? ((hotel.bookedRooms / hotel.totalRooms) * 100).toFixed(0)
      : 0;

  return (
    <div className="hotel-details-page">
      {/* Hero */}

      <div className="hotel-details-hero">
        <img
          src={
            activeImage ||
            "https://via.placeholder.com/1600x700?text=Luxury+Hotel"
          }
          alt={hotel.hotelName}
        />

        <div className="hotel-details-overlay">
          <span className="hotel-location">
            {hotel.location?.city}, {hotel.location?.state}
          </span>

          <h1>{hotel.hotelName}</h1>

          <p>{hotel.description}</p>
        </div>
      </div>

      {/* Image Gallery */}

      {hotel.images && hotel.images.length > 0 && (
        <div className="hotel-gallery">
          {hotel.images.map((image, index) => (
            <img
              key={index}
              src={getHotelImage(image)}
              alt={`Hotel ${index + 1}`}
              className={activeImage === getHotelImage(image) ? "active" : ""}
              onClick={() => setActiveImage(getHotelImage(image))}
            />
          ))}
        </div>
      )}

      {/* Statistics */}

      <div className="hotel-statistics">
        <div className="hotel-stat-card">
          <h2>₹{hotel.pricePerDay?.toLocaleString()}</h2>

          <span>Price / Night</span>
        </div>

        <div className="hotel-stat-card">
          <h2>{hotel.totalRooms}</h2>

          <span>Total Rooms</span>
        </div>

        <div className="hotel-stat-card">
          <h2>{availableRooms}</h2>

          <span>Available</span>
        </div>

        <div className="hotel-stat-card">
          <h2>{occupancy}%</h2>

          <span>Occupancy</span>
        </div>
      </div>

      {/* Information */}

      <div className="hotel-details-grid">
        {/* Property */}

        <div className="hotel-card">
          <h3>Property Information</h3>

          <div className="hotel-row">
            <span>Hotel Name</span>
            <strong>{hotel.hotelName}</strong>
          </div>

          <div className="hotel-row">
            <span>Price</span>
            <strong>₹{hotel.pricePerDay}</strong>
          </div>

          <div className="hotel-row">
            <span>Total Rooms</span>
            <strong>{hotel.totalRooms}</strong>
          </div>

          <div className="hotel-row">
            <span>Booked Rooms</span>
            <strong>{hotel.bookedRooms}</strong>
          </div>

          <div className="hotel-row">
            <span>Available Rooms</span>
            <strong>{availableRooms}</strong>
          </div>
        </div>

        {/* Address */}

        <div className="hotel-card">
          <h3>Address</h3>

          <div className="hotel-row">
            <span>Street</span>
            <strong>{hotel.street}</strong>
          </div>

          <div className="hotel-row">
            <span>Pincode</span>
            <strong>{hotel.pincode}</strong>
          </div>

          <div className="hotel-row">
            <span>City</span>
            <strong>{hotel.location?.city}</strong>
          </div>
        </div>

        {/* Contact Information */}

        <div className="hotel-card">
          <h3>Contact Information</h3>

          <div className="hotel-row">
            <span>Email</span>
            <strong>{hotel.hotelEmail || "-"}</strong>
          </div>

          <div className="hotel-row">
            <span>Phone</span>
            <strong>{hotel.hotelContact || "-"}</strong>
          </div>

          <div className="hotel-row">
            <span>Location</span>
            <strong>
              {hotel.location?.locationName || hotel.location?.city}
            </strong>
          </div>
        </div>

        {/* Description */}
        <div className="hotel-card">
          <h3>Hotel Description</h3>

          <p className="hotel-description">
            {hotel.description || "No description available."}
          </p>
        </div>
      </div>

      {/* Occupancy */}
      <div className="occupancy-card">
        <div className="occupancy-header">
          <h3>Room Occupancy</h3>

          <span>{occupancy}%</span>
        </div>

        <div className="occupancy-progress">
          <div
            className="occupancy-fill"
            style={{
              width: `${occupancy}%`,
            }}
          ></div>
        </div>

        <p>
          {hotel.bookedRooms} of {hotel.totalRooms} rooms are currently
          occupied.
        </p>
      </div>

      {/* Features */}
      <div className="hotel-features">
        <h2>Property Highlights</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">🏨</div>

            <h4>Premium Property</h4>

            <p>Professionally managed accommodation with modern amenities.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📍</div>

            <h4>Prime Location</h4>

            <p>Located in {hotel.location?.city} with easy accessibility.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🛏️</div>

            <h4>Comfortable Rooms</h4>

            <p>{availableRooms} rooms currently available for booking.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⭐</div>

            <h4>Quality Service</h4>

            <p>Dedicated hospitality designed for guest satisfaction.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotelDetails;
