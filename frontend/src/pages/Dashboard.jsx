import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import {
  IconFileText,
  IconCheckCircle,
  IconClock,
  IconAlertTriangle,
  IconDollarSign,
  IconUploadCloud,
  IconArrowRight,
  IconBuilding
} from "../components/Icons";

function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [processedInvoices, setProcessedInvoices] = useState(0);
  const [pendingInvoices, setPendingInvoices] = useState(0);
  const [failedInvoices, setFailedInvoices] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await api.get("/invoices", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const invoices = response.data || [];
        setInvoices(invoices);
        setTotalInvoices(invoices.length);
        setProcessedInvoices(
          invoices.filter((invoice) => invoice.status === "PROCESSED").length
        );
        setPendingInvoices(
          invoices.filter((invoice) => invoice.status === "PENDING").length
        );
        setFailedInvoices(
          invoices.filter((invoice) => invoice.status === "FAILED").length
        );
        setTotalAmount(
          invoices.reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0)
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount || 0);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main className="container" style={{ flex: 1 }}>
        {/* Page Header */}
        <div className="page-header">
          <div className="page-title-group">
            <h1>Executive Dashboard</h1>
            <p>Real-time analytics and invoice processing overview</p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={() => navigate("/upload")}
              className="btn btn-primary"
            >
              <IconUploadCloud className="w-4 h-4" style={{ width: "16px", height: "16px" }} />
              <span>Upload Invoice</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Total Invoices</span>
              <div className="stat-icon-wrapper indigo">
                <IconFileText className="w-5 h-5" style={{ width: "18px", height: "18px" }} />
              </div>
            </div>
            <div className="stat-card-value">{loading ? "—" : totalInvoices}</div>
            <div className="stat-card-footer">
              <span>All registered invoices</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Processed</span>
              <div className="stat-icon-wrapper emerald">
                <IconCheckCircle className="w-5 h-5" style={{ width: "18px", height: "18px" }} />
              </div>
            </div>
            <div className="stat-card-value">{loading ? "—" : processedInvoices}</div>
            <div className="stat-card-footer" style={{ color: "var(--success)" }}>
              <span>Successfully extracted</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Pending</span>
              <div className="stat-icon-wrapper amber">
                <IconClock className="w-5 h-5" style={{ width: "18px", height: "18px" }} />
              </div>
            </div>
            <div className="stat-card-value">{loading ? "—" : pendingInvoices}</div>
            <div className="stat-card-footer" style={{ color: "var(--warning)" }}>
              <span>Queued or extracting</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Failed</span>
              <div className="stat-icon-wrapper rose">
                <IconAlertTriangle className="w-5 h-5" style={{ width: "18px", height: "18px" }} />
              </div>
            </div>
            <div className="stat-card-value">{loading ? "—" : failedInvoices}</div>
            <div className="stat-card-footer" style={{ color: "var(--danger)" }}>
              <span>Requires attention</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Total Amount</span>
              <div className="stat-icon-wrapper cyan">
                <IconDollarSign className="w-5 h-5" style={{ width: "18px", height: "18px" }} />
              </div>
            </div>
            <div className="stat-card-value" style={{ fontSize: "1.55rem" }}>
              {loading ? "—" : formatCurrency(totalAmount)}
            </div>
            <div className="stat-card-footer">
              <span>Cumulative value</span>
            </div>
          </div>
        </div>

        {/* Quick Action Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
          <div
            className="card card-interactive"
            onClick={() => navigate("/upload")}
            style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}
          >
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "var(--radius-lg)",
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              <IconUploadCloud className="w-6 h-6" style={{ width: "22px", height: "22px" }} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: "0.25rem" }}>Upload Invoice</h3>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Process a new PDF or scan via OCR
              </p>
            </div>
            <IconArrowRight className="w-5 h-5" style={{ width: "18px", height: "18px", color: "var(--text-muted)" }} />
          </div>

          <div
            className="card card-interactive"
            onClick={() => navigate("/invoices")}
            style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}
          >
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "var(--radius-lg)",
              background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              <IconFileText className="w-6 h-6" style={{ width: "22px", height: "22px" }} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: "0.25rem" }}>Browse Invoices</h3>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Search, filter, and review stored records
              </p>
            </div>
            <IconArrowRight className="w-5 h-5" style={{ width: "18px", height: "18px", color: "var(--text-muted)" }} />
          </div>
        </div>

        {/* Recent Invoices Section */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <div>
            <h2>Recent Invoices</h2>
            <p>Showing latest {invoices.length} invoices</p>
          </div>
          <button
            onClick={() => navigate("/invoices")}
            className="btn btn-secondary btn-sm"
          >
            <span>View All</span>
            <IconArrowRight className="w-4 h-4" style={{ width: "14px", height: "14px" }} />
          </button>
        </div>

        {loading ? (
          <div className="table-container" style={{ padding: "2rem" }}>
            <div className="skeleton" style={{ height: "40px", marginBottom: "1rem" }}></div>
            <div className="skeleton" style={{ height: "40px", marginBottom: "1rem" }}></div>
            <div className="skeleton" style={{ height: "40px" }}></div>
          </div>
        ) : invoices.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <IconFileText className="w-6 h-6" style={{ width: "28px", height: "28px" }} />
            </div>
            <h3>No Invoices Stored Yet</h3>
            <p>Get started by uploading your first invoice to automatically extract supplier and payment data.</p>
            <button
              onClick={() => navigate("/upload")}
              className="btn btn-primary"
            >
              <IconUploadCloud className="w-4 h-4" style={{ width: "16px", height: "16px" }} />
              <span>Upload Your First Invoice</span>
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="saas-table">
              <thead>
                <tr>
                  <th>Invoice Number</th>
                  <th>Supplier</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => {
                  const status = invoice.status || "PENDING";
                  return (
                    <tr
                      key={invoice.id}
                      onClick={() => navigate(`/invoices/${invoice.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <td style={{ fontWeight: 600 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <IconFileText className="w-4 h-4" style={{ width: "16px", height: "16px", color: "var(--primary)" }} />
                          <span>{invoice.invoiceNumber || "—"}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-secondary)" }}>
                          <IconBuilding className="w-4 h-4" style={{ width: "14px", height: "14px", color: "var(--text-muted)" }} />
                          <span>{invoice.supplierName || "—"}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {formatCurrency(invoice.totalAmount)}
                      </td>
                      <td>
                        <span className={`status-badge ${status.toLowerCase()}`}>
                          {status === "PROCESSED" && "✓ "}
                          {status === "FAILED" && "✕ "}
                          {status === "PENDING" && "⏳ "}
                          {status}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/invoices/${invoice.id}`);
                          }}
                        >
                          View Details
                        </button>
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

export default Dashboard;