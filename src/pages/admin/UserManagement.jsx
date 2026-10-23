import { useEffect, useMemo, useState } from "react";
import { searchUsers, bulkDeleteUsers } from "@/api/userApi";
import "./UserManagement.css";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  /*=== Load Users ===*/
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await searchUsers();
      setUsers(res?.data?.data?.content || []);
    } catch {
      setError("Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /*=== Select User ===*/

  const toggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  /*=== Select All ===*/

  const toggleAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.userId));
    }
  };

  /*=== Delete Selected ===*/

  const handleDelete = async () => {
    if (selectedUsers.length === 0) {
      alert("Please select users.");
      return;
    }

    const confirmed = window.confirm(
      `Delete ${selectedUsers.length} selected user(s)?`,
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      await bulkDeleteUsers(selectedUsers);
      setSelectedUsers([]);
      await loadUsers();
      alert("Users deleted successfully.");
    } catch (err) {
      alert(err?.response?.data?.message || "Unable to delete users.");
    } finally {
      setDeleting(false);
    }
  };

  /*=== Searchd ===*/

  const filteredUsers = useMemo(() => {
    if (!searchText.trim()) return users;

    return users.filter((user) => {
      const keyword = searchText.toLowerCase();

      return (
        user.firstName?.toLowerCase().includes(keyword) ||
        user.lastName?.toLowerCase().includes(keyword) ||
        user.emailId?.toLowerCase().includes(keyword)
      );
    });
  }, [users, searchText]);

  /*=== Statistics ===*/

  const totalUsers = users.length;
  const selectedCount = selectedUsers.length;
  /*=== Loading Screen ===*/

  if (loading) {
    return (
      <div className="user-management-loading">
        <div className="user-spinner"></div>

        <h2>Loading Users...</h2>

        <p>Fetching all registered users.</p>
      </div>
    );
  }

  /*=== Error Screen ===*/

  if (error) {
    return (
      <div className="user-management-error">
        <h2>Something went wrong</h2>

        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="user-management-page">
      {/* Hero */}

      <div className="user-management-hero">
        <div>
          <h1>User Management</h1>

          <p>
            Manage registered users, search accounts, and remove unwanted users
            from the system.
          </p>
        </div>
      </div>

      {/* Statistics */}

      <div className="user-stats">
        <div className="user-stat-card">
          <h2>{totalUsers}</h2>

          <span>Total Users</span>
        </div>

        <div className="user-stat-card">
          <h2>{selectedCount}</h2>

          <span>Selected</span>
        </div>
      </div>

      {/* Toolbar */}

      <div className="user-toolbar">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <button
          className="delete-selected-btn"
          disabled={deleting || selectedUsers.length === 0}
          onClick={handleDelete}
        >
          {deleting ? "Deleting..." : `Delete Selected (${selectedCount})`}
        </button>
      </div>

      {/* User Table */}

      <div className="user-table-card">
        <div className="table-header">
          <h2>Registered Users</h2>

          <p>Showing {filteredUsers.length} user(s)</p>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="user-empty">
            <h3>No Users Found</h3>

            <p>No users match your search.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={
                        filteredUsers.length > 0 &&
                        selectedUsers.length === filteredUsers.length
                      }
                      onChange={toggleAll}
                    />
                  </th>

                  <th>Name</th>

                  <th>Email</th>

                  <th>Role</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.userId}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.userId)}
                        onChange={() => toggleUser(user.userId)}
                      />
                    </td>

                    <td>
                      <div className="user-name">
                        {user.firstName} {user.lastName}
                      </div>
                    </td>

                    <td>{user.emailId}</td>

                    <td>
                      <span
                        className={`role-badge ${(
                          user.roles || ""
                        ).toLowerCase()}`}
                      >
                        {user.roles}
                      </span>
                    </td>
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

export default UserManagement;
