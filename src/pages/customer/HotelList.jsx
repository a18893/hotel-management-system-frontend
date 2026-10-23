import "./HotelList.css";
import { useEffect, useState } from "react";
import { searchHotels } from "../../api/hotelApi";
import HotelCard from "../../components/HotelCard";

function HotelList() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await searchHotels();
        setHotels(response.data?.data?.content || []);
      } catch {
        setError("Unable to load hotels.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  return (
    <div className="hotel-list-page">
      {/*===  Header  ===*/}

      <div className="hotel-list-header">
        <h1>Browse Hotels</h1>

        <p>
          Explore our premium collection of hotels and book your perfect stay.
        </p>
      </div>

      {/*===  Loading  ===*/}

      {loading && <div className="hotel-list-message">Loading hotels...</div>}

      {/*===  Error  ===*/}

      {!loading && error && (
        <div className="hotel-list-message error">{error}</div>
      )}

      {/*===  Empty  ===*/}

      {!loading && !error && hotels.length === 0 && (
        <div className="hotel-list-message">No hotels available.</div>
      )}

      {/*===  Hotels  ===*/}

      {!loading && !error && hotels.length > 0 && (
        <>
          <div className="hotel-count">{hotels.length} Hotels Found</div>

          <div className="hotel-grid">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.hotelId} hotel={hotel} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default HotelList;
