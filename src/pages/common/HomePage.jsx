import "./HomePage.css";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import Carousel from "../../components/Carousel";
import HotelCard from "../../components/HotelCard";
import Footer from "../../components/Footer";
import { getAllLocations } from "../../api/locationApi";
import { getAllFacilities } from "../../api/facilityApi";
import { getHotelCards } from "../../api/hotelApi";

function HomePage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedFacility, setSelectedFacility] = useState("");
  const [keyword, setKeyword] = useState("");
  const [maxPrice, setMaxPrice] = useState(5000);

  const loadLocations = async () => {
    try {
      const response = await getAllLocations();
      setLocations(response.data?.data?.locations || []);
    } catch {
      alert("Unable to load locations.");
      setLocations([]);
    }
  };

  const loadFacilities = async () => {
    try {
      const response = await getAllFacilities();
      setFacilities(response.data?.data?.facility || []);
    } catch {
      alert("Unable to load facilities.");
      setFacilities([]);
    }
  };

  const loadHotels = useCallback(
    async (
      keywordValue = keyword,
      locationValue = selectedLocation,
      facilityValue = selectedFacility,
      priceValue = maxPrice,
    ) => {
      try {
        setLoading(true);

        const params = {};

        if (keywordValue.trim()) {
          params.keyword = keywordValue.trim();
        }

        if (locationValue) {
          params.locationId = locationValue;
        }

        if (facilityValue) {
          params.facilityId = facilityValue;
        }

        if (priceValue) {
          params.maxPrice = priceValue;
        }

        const response = await getHotelCards(params);

        setHotels(response.data?.data?.hotels || []);
      } catch {
        alert("Unable to load hotels.");
        setHotels([]);
      } finally {
        setLoading(false);
      }
    },
    [keyword, selectedLocation, selectedFacility, maxPrice],
  );

  useEffect(() => {
    loadLocations();
    loadFacilities();
  }, []);

  useEffect(() => {
    loadHotels();
  }, [loadHotels]);

  return (
    <div className="homepage">
      {/* ===  HERO === */}

      <section className="hero-section">
        <Carousel />

        <div className="hero-overlay">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">Find Your Perfect Stay</h1>

              <p className="hero-subtitle">
                Discover luxury hotels, affordable rooms and unforgettable
                experiences across India.
              </p>

              {/*===  Search  ===*/}

              <div className="search-box">
                <div className="search-field">
                  <FaMapMarkerAlt />

                  <input
                    type="text"
                    placeholder="Search hotel or destination..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>

                <div className="search-field">
                  <FaCalendarAlt />

                  <input type="date" />
                </div>

                <div className="search-field">
                  <FaCalendarAlt />

                  <input type="date" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*===  MAIN  ===*/}

      <section className="homepage-content">
        <div className="container">
          <div className="row">
            {/*===  Sidebar  ===*/}

            <aside className="col-lg-3 mb-4">
              <div className="filter-sidebar">
                <h4 className="sidebar-title">Filter Hotels</h4>

                <div className="filter-group">
                  <label>Location</label>

                  <select
                    className="form-select"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <option value="">All Locations</option>

                    {locations.map((location) => (
                      <option
                        key={location.locationId}
                        value={location.locationId}
                      >
                        {location.locationName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Maximum Price</label>

                  <input
                    type="range"
                    className="form-range"
                    min="1000"
                    max="5000"
                    step="500"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                  />

                  <div className="mt-2 fw-bold">₹{maxPrice}</div>
                </div>

                <div className="filter-group">
                  <label>Facilities</label>

                  <select
                    className="form-select"
                    value={selectedFacility}
                    onChange={(e) => setSelectedFacility(e.target.value)}
                  >
                    <option value="">All Facilities</option>

                    {facilities.map((facility) => (
                      <option
                        key={facility.facilityId}
                        value={facility.facilityId}
                      >
                        {facility.facilityName}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  className="btn btn-outline-secondary w-100 mt-3"
                  onClick={() => {
                    setKeyword("");
                    setSelectedLocation("");
                    setSelectedFacility("");
                    setMaxPrice(5000);
                  }}
                >
                  Clear Filters
                </button>
              </div>
            </aside>

            {/*===  Hotels  ===*/}

            <main className="col-lg-9">
              <div className="section-header">
                <div>
                  <h2>Recommended Hotels</h2>

                  <p>{hotels.length} Hotels Available</p>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status" />
                </div>
              ) : hotels.length === 0 ? (
                <div className="empty-hotels">
                  <h4>No Hotels Found</h4>

                  <p>Please check back later.</p>
                </div>
              ) : (
                <div className="row g-4">
                  {hotels.map((card) => (
                    <div key={card.hotel.hotelId} className="col-md-6 col-xl-4">
                      <HotelCard
                        hotel={{
                          ...card.hotel,
                          locationName:
                            card.hotel.locationName ??
                            card.hotel.location?.locationName,
                        }}
                        reviewPreview={card.reviewPreview}
                      />
                    </div>
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </section>

      {/* === FEATURES === */}

      <section className="features-section">
        <div className="container">
          <div className="section-heading">
            <h2>Why Choose Our System?</h2>

            <p>Trusted by thousands of happy travelers.</p>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">🏨</div>

                <h4>Premium Hotels</h4>

                <p>Carefully selected luxury and budget hotels.</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">💳</div>

                <h4>Secure Booking</h4>

                <p>Instant booking with secure payment methods.</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">📞</div>

                <h4>24/7 Support</h4>

                <p>Our team is available anytime you need assistance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === CTA === */}

      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Ready for Your Next Adventure?</h2>

            <p>
              Join thousands of travelers booking their dream hotels every day.
            </p>

            <Link to="/register" className="btn btn-warning btn-lg">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default HomePage;
