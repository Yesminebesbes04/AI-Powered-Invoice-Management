import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import { IconSparkles, IconUser, IconLock } from "../components/Icons";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await api.post("/auth/register", {
        username,
        password,
      });

      toast.success("Registration Successful");
    } catch (error) {
      toast.error("Registration Failed");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <IconSparkles className="w-6 h-6" style={{ width: "24px", height: "24px" }} />
          </div>
          <h1 className="auth-title">Create an Account</h1>
          <p className="auth-subtitle">Get started with InvoiceFlow today</p>
        </div>

        <form onSubmit={handleRegister} autoComplete="off">
          <div className="form-group">
            <label className="form-label" htmlFor="register-username">Username</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <IconUser className="w-5 h-5" style={{ width: "18px", height: "18px" }} />
              </span>
              <input
                id="register-username"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <IconLock className="w-5 h-5" style={{ width: "18px", height: "18px" }} />
              </span>
              <input
                id="register-password"
                type="password"
                placeholder="Choose a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "0.5rem" }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                <span>Registering...</span>
              </>
            ) : (
              "Create Account"
            )}
          </button>

          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Already have an account?{" "}
            </span>
            <Link to="/login" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;