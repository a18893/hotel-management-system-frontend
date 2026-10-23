import { useEffect, useState, useCallback } from "react";
import {
  getAllFacilities,
  getFacilitiesByHotel,
  addFacilityToHotel,
  removeFacilityFromHotel,
} from "@/api/facilityApi";
import { useManagerHotelId } from "@/hooks/useManagerHotelId";
import "./ManagerFacilities.css";

function ManagerFacilities() {
  const { hotelId, loading: hotelLoading } = useManagerHotelId();
  const [facilities, setFacilities] = useState([]);
  const [allFacilities, setAllFacilities] = useState([]);
  const [facilityId, setFacilityId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      if (!hotelId) {
        setError("No hotel assigned.");
        return;
      }

      /*===  Hotel Facilities  ===*/
      const hotelFacilities = await getFacilitiesByHotel(hotelId);
      setFacilities(hotelFacilities.data?.data?.facility || []);

      /*===  Master Facility List  ===*/
      const allFacilityRes = await getAllFacilities();
      setAllFacilities(allFacilityRes.data?.data?.facility || []);
    } catch {
      setError("Unable to load facilities.");
    } finally {
      setLoading(false);
    }
  }, [hotelId]);

  useEffect(() => {
    if (hotelId) {
      fetchData();
    }
  }, [fetchData, hotelId]);

  /*===  Refresh Hotel Facilities  ===*/
  const refreshFacilities = async () => {
    try {
      if (!hotelId) return;
      const res = await getFacilitiesByHotel(hotelId);
      setFacilities(res.data?.data?.facility || []);
    } catch {
      alert("Failed to refresh facilities.");
    }
  };

  /*===  Add Facility  ===*/
  const addFacility = async () => {
    if (!facilityId) {
      alert("Please select a facility.");
      return;
    }

    try {
      setSubmitting(true);
      await addFacilityToHotel(hotelId, { facilityId });
      setFacilityId("");
      await refreshFacilities();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to add facility.");
    } finally {
      setSubmitting(false);
    }
  };

  /*===  Remove Facility  ===*/
  const removeFacility = async (id) => {
    const confirmed = window.confirm("Remove this facility?");
    if (!confirmed) return;

    try {
      await removeFacilityFromHotel(hotelId, id);
      await refreshFacilities();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to remove facility.");
    }
  };

  /*===  Loading Screen  ===*/
  if (loading || hotelLoading) {
    return (
      <div className="manager-facilities-loading">
        <div className="facility-spinner"></div>
        <h2>Loading Facilities...</h2>
        <p>Please wait while we retrieve your hotel facilities.</p>
      </div>
    );
  }

  /*===  Error Screen  ===*/
  if (error) {
    return (
      <div className="manager-facilities-error">
        <h2>Something went wrong</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="manager-facilities-page">
      {/* Hero */}
      <div className="manager-facilities-hero">
        <div>
          <h1>Hotel Facilities</h1>
          <p>Manage all amenities available for your guests.</p>
        </div>
        <div className="facility-total-card">
          <h2>{facilities.length}</h2>
          <span>Current Facilities</span>
        </div>
      </div>

      {/* Add Facility Card */}
      <div className="facility-add-card">
        <h2>Add New Facility</h2>
        <p>Select an available facility and attach it to your hotel.</p>
        <div className="facility-form">
          <select
            value={facilityId}
            onChange={(e) => setFacilityId(e.target.value)}
          >
            <option value="">Select Facility</option>
            {allFacilities
              .filter(
                (facility) =>
                  !facilities.some(
                    (hotelFacility) =>
                      hotelFacility.facilityId === facility.facilityId,
                  ),
              )
              .map((facility) => (
                <option key={facility.facilityId} value={facility.facilityId}>
                  {facility.facilityName}
                </option>
              ))}
          </select>
          <button onClick={addFacility} disabled={submitting}>
            {submitting ? "Adding..." : "Add Facility"}
          </button>
        </div>
      </div>

      {/* Facilities List */}
      <div className="facilities-section">
        <h2>Current Hotel Facilities</h2>
        {facilities.length === 0 ? (
          <div className="facility-empty">
            <h3>No Facilities Added</h3>
            <p>Start by adding your hotel's first facility.</p>
          </div>
        ) : (
          <div className="facility-grid">
            {facilities.map((facility) => (
              <div className="facility-card" key={facility.facilityId}>
                <div className="facility-icon">✓</div>
                <div className="facility-content">
                  <h3>{facility.facilityName}</h3>
                  <p>
                    {facility.facilityDescription ??
                      "Luxury hotel facility available for guests."}
                  </p>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => removeFacility(facility.facilityId)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagerFacilities;
