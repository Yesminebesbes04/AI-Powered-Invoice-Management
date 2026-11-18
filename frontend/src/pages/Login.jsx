import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import { IconSparkles, IconUser, IconLock } from "../components/Icons";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      console.log("ROLE =", response.data.role);
      localStorage.setItem("username", username);

      toast.success("Login Successful");
      setLoading(false);
      navigate("/dashboard");
      console.log(response.data);
    } catch (error) {
      setLoading(false);
      toast.error("Login Failed");
      console.log(error);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <IconSparkles className="w-6 h-6" style={{ width: "24px", height: "24px" }} />
          </div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to your InvoiceFlow account</p>
        </div>

        <form onSubmit={handleLogin} autoComplete="off">
          <div className="form-group">
            <label className="form-label" htmlFor="login-username">Username</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <IconUser className="w-5 h-5" style={{ width: "18px", height: "18px" }} />
              </span>
              <input
                id="login-username"
                type="text"
                name="username"
                autoComplete="off"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <IconLock className="w-5 h-5" style={{ width: "18px", height: "18px" }} />
              </span>
              <input
                id="login-password"
                type="password"
                name="password"
                autoComplete="new-password"
                placeholder="••••••••"
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
                <span>Logging in...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="auth-info-box">
            <p style={{ margin: 0, fontSize: "0.825rem" }}>
              Contact your administrator to obtain an account.
            </p>
          </div>

          <div style={{ textAlign: "center", marginTop: "1.25rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Need to register a new account?{" "}
            </span>
            <Link to="/register" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
              Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;