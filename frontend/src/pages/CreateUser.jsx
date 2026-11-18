import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import Navbar from "../components/Navbar";
import {
  IconUser,
  IconMail,
  IconPhone,
  IconLock,
  IconShield,
  IconEye,
  IconEyeOff,
  IconArrowLeft,
  IconAlertTriangle,
  IconPlus
} from "../components/Icons";

function CreateUser() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "USER"
  });

  const [errors, setErrors] = useState({});
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const getPasswordStrength = (password) => {
    if (!password) {
      return "";
    }

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return "Weak";
    if (score <= 4) return "Medium";
    return "Strong";
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "fullName":
        if (!value.trim()) {
          error = "Full Name is required";
        } else if (value.trim().length < 3) {
          error = "Full Name must contain at least 3 characters";
        }
        break;

      case "username":
        if (!value.trim()) {
          error = "Username is required";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!validateEmail(value)) {
          error = "Invalid email format";
        }
        break;

      case "phoneNumber":
        if (!value.trim()) {
          error = "Phone number is required";
        } else if (!/^[0-9]+$/.test(value)) {
          error = "Phone number must contain only digits";
        }
        break;

      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 8) {
          error = "Password must contain at least 8 characters";
        } else if (!/[A-Z]/.test(value)) {
          error = "Password must contain at least one uppercase letter";
        } else if (!/[a-z]/.test(value)) {
          error = "Password must contain at least one lowercase letter";
        } else if (!/[0-9]/.test(value)) {
          error = "Password must contain at least one number";
        } else if (!/[^a-zA-Z0-9]/.test(value)) {
          error = "Password must contain at least one special character";
        }
        break;

      case "confirmPassword":
        if (!value) {
          error = "Please confirm your password";
        } else if (value !== formData.password) {
          error = "Passwords do not match";
        }
        break;

      case "role":
        if (!["USER", "ADMIN"].includes(value)) {
          error = "Role must be USER or ADMIN";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

    const error = validateField(name, value);

    setErrors((previous) => ({
      ...previous,
      [name]: error
    }));

    // Real-time username uniqueness check
    if (name === "username" && value.trim()) {
      setUsernameChecking(true);

      try {
        const token = localStorage.getItem("token");

        const response = await api.get(
          `/users/check-username?username=${encodeURIComponent(value)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.exists) {
          setErrors((previous) => ({
            ...previous,
            username: "Username already exists"
          }));
        }
      } catch (error) {
        console.log("Username check failed:", error);
      } finally {
        setUsernameChecking(false);
      }
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const hasErrors =
    Object.values(errors).some((error) => error !== "") ||
    !formData.fullName.trim() ||
    !formData.username.trim() ||
    !formData.email.trim() ||
    !formData.phoneNumber.trim() ||
    !formData.password ||
    !formData.confirmPassword;

  const isPasswordValid =
    formData.password.length >= 8 &&
    /[A-Z]/.test(formData.password) &&
    /[a-z]/.test(formData.password) &&
    /[0-9]/.test(formData.password) &&
    /[^a-zA-Z0-9]/.test(formData.password);

  const isFormValid =
    !hasErrors &&
    !usernameChecking &&
    isPasswordValid &&
    formData.password === formData.confirmPassword;

  const handleCreateUser = async (e) => {
    e.preventDefault();

    const validationErrors = {};

    Object.keys(formData).forEach((field) => {
      if (field !== "confirmPassword") {
        const error = validateField(field, formData[field]);
        if (error) {
          validationErrors[field] = error;
        }
      }
    });

    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      await api.post(
        "/users",
        {
          fullName: formData.fullName,
          username: formData.username,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
          role: formData.role
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success("User created successfully");

      setFormData({
        fullName: "",
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        role: "USER"
      });

      setErrors({});
    } catch (error) {
      console.log(error);

      const backendMessage = error.response?.data?.message;
      const fieldErrors = error.response?.data?.fieldErrors;

      if (fieldErrors) {
        setErrors(fieldErrors);
        const firstError = Object.values(fieldErrors)[0];
        toast.error(firstError);
      } else if (backendMessage) {
        toast.error(backendMessage);
      } else {
        toast.error("Failed to create user");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main className="container" style={{ flex: 1 }}>
        {/* Navigation & Breadcrumb */}
        <div style={{ marginBottom: "1.5rem" }}>
          <button
            onClick={() => navigate("/admin")}
            className="btn btn-secondary btn-sm"
            style={{ marginBottom: "0.75rem" }}
          >
            <IconArrowLeft className="w-4 h-4" style={{ width: "16px", height: "16px" }} />
            <span>Back to User Directory</span>
          </button>

          <div className="page-header" style={{ marginBottom: "1rem" }}>
            <div className="page-title-group">
              <h1>Create New User</h1>
              <p>Add a new team member, configure their security role, and set initial access</p>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: "780px", margin: "0 auto" }}>
          <div className="card">
            <form onSubmit={handleCreateUser} autoComplete="off">
              {/* Section 1: Personal Information */}
              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.5rem", marginBottom: "1.25rem", color: "var(--primary)" }}>
                  1. Personal Information
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
                  {/* Full Name */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="fullName">Full Name</label>
                    <div className="input-wrapper">
                      <span className="input-icon">
                        <IconUser className="w-4 h-4" style={{ width: "16px", height: "16px" }} />
                      </span>
                      <input
                        id="fullName"
                        type="text"
                        name="fullName"
                        placeholder="e.g. Jane Doe"
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="error">
                        <IconAlertTriangle className="w-3.5 h-3.5" style={{ width: "14px", height: "14px" }} />
                        <span>{errors.fullName}</span>
                      </p>
                    )}
                  </div>

                  {/* Username */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="username">Username</label>
                    <div className="input-wrapper">
                      <span className="input-icon">
                        <IconUser className="w-4 h-4" style={{ width: "16px", height: "16px" }} />
                      </span>
                      <input
                        id="username"
                        type="text"
                        name="username"
                        placeholder="e.g. jdoe"
                        value={formData.username}
                        onChange={handleChange}
                      />
                    </div>
                    {usernameChecking && (
                      <p style={{ fontSize: "0.8rem", color: "var(--primary)", marginTop: "0.3rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <span className="spinner spinner-dark" style={{ width: "12px", height: "12px" }}></span>
                        <span>Checking username availability...</span>
                      </p>
                    )}
                    {errors.username && (
                      <p className="error">
                        <IconAlertTriangle className="w-3.5 h-3.5" style={{ width: "14px", height: "14px" }} />
                        <span>{errors.username}</span>
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Email Address</label>
                    <div className="input-wrapper">
                      <span className="input-icon">
                        <IconMail className="w-4 h-4" style={{ width: "16px", height: "16px" }} />
                      </span>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="e.g. jane@company.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.email && (
                      <p className="error">
                        <IconAlertTriangle className="w-3.5 h-3.5" style={{ width: "14px", height: "14px" }} />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="phoneNumber">Phone Number</label>
                    <div className="input-wrapper">
                      <span className="input-icon">
                        <IconPhone className="w-4 h-4" style={{ width: "16px", height: "16px" }} />
                      </span>
                      <input
                        id="phoneNumber"
                        type="text"
                        name="phoneNumber"
                        placeholder="e.g. 5551234567"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.phoneNumber && (
                      <p className="error">
                        <IconAlertTriangle className="w-3.5 h-3.5" style={{ width: "14px", height: "14px" }} />
                        <span>{errors.phoneNumber}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Security & Password */}
              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.5rem", marginBottom: "1.25rem", color: "var(--primary)" }}>
                  2. Security & Credentials
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
                  {/* Password */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="password">Password</label>
                    <div className="input-wrapper">
                      <span className="input-icon">
                        <IconLock className="w-4 h-4" style={{ width: "16px", height: "16px" }} />
                      </span>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Min 8 chars, uppercase, number & symbol"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="toggle-password-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <IconEyeOff className="w-4 h-4" style={{ width: "16px", height: "16px" }} />
                        ) : (
                          <IconEye className="w-4 h-4" style={{ width: "16px", height: "16px" }} />
                        )}
                      </button>
                    </div>

                    {/* Password Strength Meter */}
                    {formData.password && (
                      <div className="strength-meter-container">
                        <div className="strength-bar-bg">
                          <div
                            className={`strength-bar-fill ${passwordStrength.toLowerCase()}`}
                          ></div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          <span>Password Strength:</span>
                          <strong style={{
                            color: passwordStrength === "Strong" ? "var(--success)" : passwordStrength === "Medium" ? "var(--warning)" : "var(--danger)"
                          }}>
                            {passwordStrength}
                          </strong>
                        </div>
                      </div>
                    )}

                    {errors.password && (
                      <p className="error">
                        <IconAlertTriangle className="w-3.5 h-3.5" style={{ width: "14px", height: "14px" }} />
                        <span>{errors.password}</span>
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                    <div className="input-wrapper">
                      <span className="input-icon">
                        <IconLock className="w-4 h-4" style={{ width: "16px", height: "16px" }} />
                      </span>
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Re-enter password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="toggle-password-btn"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        title={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? (
                          <IconEyeOff className="w-4 h-4" style={{ width: "16px", height: "16px" }} />
                        ) : (
                          <IconEye className="w-4 h-4" style={{ width: "16px", height: "16px" }} />
                        )}
                      </button>
                    </div>

                    {errors.confirmPassword && (
                      <p className="error">
                        <IconAlertTriangle className="w-3.5 h-3.5" style={{ width: "14px", height: "14px" }} />
                        <span>{errors.confirmPassword}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Role & Permissions */}
              <div style={{ marginBottom: "2.5rem" }}>
                <h3 style={{ borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.5rem", marginBottom: "1.25rem", color: "var(--primary)" }}>
                  3. Access Level & Permissions
                </h3>

                <div className="role-cards-grid">
                  <label className={`role-selection-card ${formData.role === "USER" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="role"
                      value="USER"
                      checked={formData.role === "USER"}
                      onChange={handleChange}
                    />
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 700, fontSize: "0.95rem" }}>
                        <IconUser className="w-4 h-4" style={{ width: "16px", height: "16px", color: "var(--info)" }} />
                        <span>USER</span>
                      </div>
                      <p style={{ margin: "0.25rem 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        Standard access to upload, view, search, and update invoices.
                      </p>
                    </div>
                  </label>

                  <label className={`role-selection-card ${formData.role === "ADMIN" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="role"
                      value="ADMIN"
                      checked={formData.role === "ADMIN"}
                      onChange={handleChange}
                    />
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 700, fontSize: "0.95rem" }}>
                        <IconShield className="w-4 h-4" style={{ width: "16px", height: "16px", color: "var(--primary)" }} />
                        <span>ADMIN</span>
                      </div>
                      <p style={{ margin: "0.25rem 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        Full access including user management, role adjustments, and system control.
                      </p>
                    </div>
                  </label>
                </div>

                {errors.role && (
                  <p className="error" style={{ marginTop: "0.5rem" }}>
                    <IconAlertTriangle className="w-3.5 h-3.5" style={{ width: "14px", height: "14px" }} />
                    <span>{errors.role}</span>
                  </p>
                )}
              </div>

              {/* Submit Actions */}
              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ flex: 1 }}
                  disabled={!isFormValid || submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner"></span>
                      <span>Creating User...</span>
                    </>
                  ) : (
                    <>
                      <IconPlus className="w-5 h-5" style={{ width: "18px", height: "18px" }} />
                      <span>Create User</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary btn-lg"
                  onClick={() => navigate("/admin")}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateUser;