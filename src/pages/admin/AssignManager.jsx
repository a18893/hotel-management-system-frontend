import { useEffect, useMemo, useState } from "react";
import { assignManager, unassignManager, getAllHotels } from "@/api/hotelApi";
import { searchUsers } from "@/api/userApi";
import "./AssignManager.css";

function AssignManager() {
  const [hotels, setHotels] = useState([]);
  const [managers, setManagers] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("");
  const [selectedManager, setSelectedManager] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  //--- Load Hotels + Managers ---
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [hotelRes, managerRes] = await Promise.all([
        getAllHotels(),
        searchUsers({ role: "MANAGER", size: 100 }),
      ]);

      const hotelList = hotelRes?.data?.data?.hotels || [];
      const managerList = managerRes?.data?.data?.content || [];
      setHotels(hotelList);
      setManagers(managerList);
    } catch {
      setError("Unable to load manager assignment data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  //--- Derived Lists ---
  const assignedManagers = useMemo(() => {
    return managers.filter((manager) => manager.hotelId);
  }, [managers]);

  const unassignedManagers = useMemo(() => {
    return managers.filter((manager) => !manager.hotelId);
  }, [managers]);

  const assignedHotelIds = useMemo(() => {
    return assignedManagers.map((manager) => manager.hotelId);
  }, [assignedManagers]);

  const vacantHotels = useMemo(() => {
    return hotels.filter((hotel) => !assignedHotelIds.includes(hotel.hotelId));
  }, [hotels, assignedHotelIds]);

  const getHotelName = (hotelId) => {
    const hotel = hotels.find((item) => item.hotelId === hotelId);

    return hotel?.hotelName || "Unknown Hotel";
  };

  //--- Assign Manager ---
  const handleAssign = async () => {
    if (!selectedHotel || !selectedManager) {
      alert("Please select both hotel and manager.");
      return;
    }

    try {
      setActionLoading(true);
      await assignManager(selectedHotel, selectedManager);
      alert("Manager assigned successfully.");
      setSelectedHotel("");
      setSelectedManager("");
      await loadData();
    } catch {
      alert("Failed to assign manager.");
    } finally {
      setActionLoading(false);
    }
  };

  //---Unassign Manager ---
  const handleUnassign = async (hotelId, userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to unassign this manager?",
    );
    if (!confirmed) return;
    try {
      setActionLoading(true);
      await unassignManager(hotelId, userId);
      alert("Manager unassigned successfully.");
      await loadData();
    } catch {
      alert("Failed to unassign manager.");
    } finally {
      setActionLoading(false);
    }
  };

  //--- Loading Screen ---
  if (loading) {
    return (
      <div className="assign-manager-loading">
        <div className="assign-spinner"></div>
        <h2>Loading Manager Dashboard...</h2>
        <p>Please wait while we retrieve hotels, managers and assignments.</p>
      </div>
    );
  }

  //--- Error Screen ---
  if (error) {
    return (
      <div className="assign-manager-error">
        <h2>Something went wrong</h2>

        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="assign-manager-page">
      {/* Hero */}
      <div className="assign-manager-hero">
        <div>
          <h1>Manager Assignment</h1>
          <p>
            Assign hotel managers, monitor active assignments and maintain
            operational coverage across all hotel properties.
          </p>
        </div>
      </div>
      {/* Summary */}
      <div className="assign-summary-grid">
        <div className="assign-summary-card">
          <span>Total Hotels</span>
          <h2> {hotels.length} </h2>
        </div>
        <div className="assign-summary-card">
          <span> Assigned Managers </span>
          <h2> {assignedManagers.length} </h2>
        </div>
        <div className="assign-summary-card">
          <span> Available Managers </span>
          <h2> {unassignedManagers.length} </h2>
        </div>
        <div className="assign-summary-card">
          <span> Hotels Without Manager </span>
          <h2> {vacantHotels.length} </h2>
        </div>
      </div>

      {/* Assign Card */}
      <div className="assign-card">
        <div className="section-header">
          <h2> Assign New Manager </h2>
          <p>
            Select an available hotel and an available manager to create a new
            assignment.
          </p>
        </div>

        <div className="assign-form">
          <div className="form-group">
            <label> Hotel </label>
            <select
              value={selectedHotel}
              onChange={(e) => setSelectedHotel(e.target.value)}
            >
              <option value=""> Select Hotel </option>
              {vacantHotels.map((hotel) => (
                <option key={hotel.hotelId} value={hotel.hotelId}>
                  {hotel.hotelName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label> Manager </label>
            <select
              value={selectedManager}
              onChange={(e) => setSelectedManager(e.target.value)}
            >
              <option value=""> Select Manager </option>
              {unassignedManagers.map((manager) => (
                <option key={manager.userId} value={manager.userId}>
                  {manager.firstName} {manager.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label style={{ visibility: "hidden" }}> Action </label>
            <button
              className="assign-btn"
              onClick={handleAssign}
              disabled={actionLoading}
            >
              {actionLoading ? "Assigning..." : "Assign Manager"}
            </button>
          </div>
        </div>
      </div>

      {/* Current Assignments */}
      <div className="assignment-table-card">
        <div className="section-header">
          <h2> Current Assignments</h2>
          <p> Managers currently assigned to hotels. </p>
        </div>

        {assignedManagers.length === 0 ? (
          <div className="empty-state">
            <h3> No Assignments </h3>
            <p> No hotel currently has an assigned manager. </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Hotel</th>
                  <th>Hotel ID</th>
                  <th>Manager</th>
                  <th>User ID</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {assignedManagers.map((manager) => (
                  <tr key={manager.userId}>
                    <td>{getHotelName(manager.hotelId)}</td>

                    <td>{manager.hotelId}</td>

                    <td>
                      {manager.firstName} {manager.lastName}
                    </td>

                    <td>{manager.userId}</td>

                    <td>
                      <button
                        className="danger-btn"
                        onClick={() =>
                          handleUnassign(manager.hotelId, manager.userId)
                        }
                        disabled={actionLoading}
                      >
                        Unassign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Available Managers */}
      <div className="assignment-table-card">
        <div className="section-header">
          <h2> Available Managers </h2>
          <p> Managers waiting to be assigned to a hotel. </p>
        </div>

        {unassignedManagers.length === 0 ? (
          <div className="empty-state">
            <h3> No Available Managers </h3>
            <p> Every manager has already been assigned to a hotel. </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>User ID</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {unassignedManagers.map((manager) => (
                  <tr key={manager.userId}>
                    <td>
                      {manager.firstName} {manager.lastName}
                    </td>
                    <td> {manager.userId} </td>
                    <td> {manager.emailId} </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
export default AssignManager;
