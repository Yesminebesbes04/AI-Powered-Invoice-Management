import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import {
  IconUsers,
  IconPlus,
  IconShield,
  IconTrash,
  IconRefresh
} from "../components/Icons";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const loadUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/users", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (isMounted) {
          setUsers(response.data || []);
        }
      } catch (error) {
        console.log(error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleRole = async (user) => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.put(
        `/users/${user.id}/role`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUsers(
        users.map((u) => (u.id === user.id ? response.data : u))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm("Delete this user?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/users/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUsers(users.filter((u) => u.id !== user.id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main className="container" style={{ flex: 1 }}>
        {/* Page Header */}
        <div className="page-header">
          <div className="page-title-group">
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <h1>User Management</h1>
              <span className="status-badge admin" style={{ fontSize: "0.8rem" }}>
                {users.length} Users
              </span>
            </div>
            <p>Admin control panel for managing user access, roles, and credentials</p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={() => navigate("/create-user")}
              className="btn btn-primary"
            >
              <IconPlus className="w-4 h-4" style={{ width: "16px", height: "16px" }} />
              <span>Create New User</span>
            </button>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="table-container" style={{ padding: "2rem" }}>
            <div className="skeleton" style={{ height: "45px", marginBottom: "1rem" }}></div>
            <div className="skeleton" style={{ height: "45px", marginBottom: "1rem" }}></div>
            <div className="skeleton" style={{ height: "45px" }}></div>
          </div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <IconUsers className="w-6 h-6" style={{ width: "28px", height: "28px" }} />
            </div>
            <h3>No Users Found</h3>
            <p>There are currently no users in the database.</p>
            <button
              onClick={() => navigate("/create-user")}
              className="btn btn-primary"
            >
              <IconPlus className="w-4 h-4" style={{ width: "16px", height: "16px" }} />
              <span>Create First User</span>
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="saas-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>User ID</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const isAdmin = user.role === "ADMIN";
                  return (
                    <tr key={user.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              background: isAdmin
                                ? "linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)"
                                : "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                              color: "#ffffff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              fontSize: "0.85rem",
                              textTransform: "uppercase",
                              flexShrink: 0
                            }}
                          >
                            {(user.username || "U").charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                              {user.username}
                            </div>
                            {user.fullName && (
                              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                                {user.fullName}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${isAdmin ? "admin" : "user"}`}>
                          <IconShield className="w-3 h-3" style={{ width: "12px", height: "12px" }} />
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                          #{user.id}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            title="Toggle User Role"
                            onClick={() => handleToggleRole(user)}
                          >
                            <IconRefresh className="w-3.5 h-3.5" style={{ width: "14px", height: "14px" }} />
                            <span>Change Role</span>
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            title="Delete user"
                            onClick={() => handleDeleteUser(user)}
                          >
                            <IconTrash className="w-3.5 h-3.5" style={{ width: "14px", height: "14px" }} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminUsers;