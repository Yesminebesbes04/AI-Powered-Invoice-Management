import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  IconFileText,
  IconUploadCloud,
  IconUsers,
  IconPlus,
  IconLogOut,
  IconSparkles,
  IconTrendingUp
} from "./Icons";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username") || "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/invoices") {
      return location.pathname === "/invoices" || location.pathname.startsWith("/invoices/");
    }
    return location.pathname === path;
  };

  return (
    <nav className="saas-navbar">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <Link to="/dashboard" className="navbar-brand">
          <div className="brand-icon-wrapper">
            <IconSparkles className="w-5 h-5" style={{ width: "20px", height: "20px" }} />
          </div>
          <span>InvoiceFlow</span>
        </Link>

        {/* Navigation Links */}
        <div className="navbar-links">
          <Link
            to="/dashboard"
            className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}
          >
            <IconTrendingUp className="w-4 h-4" style={{ width: "16px", height: "16px" }} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/invoices"
            className={`nav-item ${isActive("/invoices") ? "active" : ""}`}
          >
            <IconFileText className="w-4 h-4" style={{ width: "16px", height: "16px" }} />
            <span>Invoices</span>
          </Link>

          <Link
            to="/upload"
            className={`nav-item ${isActive("/upload") ? "active" : ""}`}
          >
            <IconUploadCloud className="w-4 h-4" style={{ width: "16px", height: "16px" }} />
            <span>Upload</span>
          </Link>

          {role === "ADMIN" && (
            <Link
              to="/admin"
              className={`nav-item ${isActive("/admin") ? "active" : ""}`}
            >
              <IconUsers className="w-4 h-4" style={{ width: "16px", height: "16px" }} />
              <span>Admin Panel</span>
            </Link>
          )}

          {role === "ADMIN" && (
            <Link
              to="/create-user"
              className={`nav-item ${isActive("/create-user") ? "active" : ""}`}
            >
              <IconPlus className="w-4 h-4" style={{ width: "16px", height: "16px" }} />
              <span>Create User</span>
            </Link>
          )}
        </div>

        {/* User Badge & Logout */}
        <div className="navbar-user-section">
          <div className="user-profile-pill">
            <div className="user-avatar-circle">
              {username.charAt(0)}
            </div>
            <span className="user-name-text">{username}</span>
            <span className={`role-badge-nav ${role === "ADMIN" ? "admin" : "user"}`}>
              {role || "User"}
            </span>
          </div>

          <button onClick={handleLogout} className="btn-logout" title="Sign out">
            <IconLogOut className="w-4 h-4" style={{ width: "15px", height: "15px" }} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;