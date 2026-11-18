import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import Navbar from "../components/Navbar";
import {
  IconFileText,
  IconArrowLeft,
  IconBuilding,
  IconDollarSign,
  IconCheckCircle,
  IconCheck
} from "../components/Icons";

function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get(`/invoices/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setInvoice(response.data);
        setInvoiceNumber(response.data.invoiceNumber || "");
        setSupplierName(response.data.supplierName || "");
        setTotalAmount(response.data.totalAmount !== undefined ? response.data.totalAmount : "");
        setStatus(response.data.status || "PENDING");
      } catch (error) {
        console.log(error);
        toast.error("Failed to load invoice");
      }
    };

    loadInvoice();
  }, [id]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      await api.put(
        `/invoices/${id}`,
        {
          invoiceNumber,
          supplierName,
          totalAmount,
          status
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success("Invoice Updated");

      setTimeout(() => {
        navigate("/invoices");
      }, 1000);
    } catch (error) {
      console.log(error);
      toast.error("Update Failed");
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (val) => {
    const num = parseFloat(val);
    if (isNaN(num)) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(num);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main className="container" style={{ flex: 1 }}>
        {/* Navigation & Breadcrumb */}
        <div style={{ marginBottom: "1.5rem" }}>
          <button
            onClick={() => navigate("/invoices")}
            className="btn btn-secondary btn-sm"
            style={{ marginBottom: "1rem" }}
          >
            <IconArrowLeft className="w-4 h-4" style={{ width: "16px", height: "16px" }} />
            <span>Back to Invoices</span>
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
            <Link to="/invoices">Invoices</Link>
            <span>/</span>
            <span>Invoice Details</span>
            <span>/</span>
            <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>#{id}</span>
          </div>
        </div>

        {!invoice ? (
          <div className="card loading-container">
            <span className="spinner spinner-dark" style={{ width: "2rem", height: "2rem", marginBottom: "1rem" }}></span>
            <h3>Loading invoice details...</h3>
            <p>Retrieving invoice records and line items</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
            {/* Left Column: Edit Form */}
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "1rem" }}>
                <div>
                  <h2 style={{ margin: 0 }}>Edit Invoice Details</h2>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    Update invoice reference, vendor, or total amounts
                  </p>
                </div>
                <span className={`status-badge ${status.toLowerCase()}`}>
                  {status}
                </span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="invoiceNumber">Invoice Number</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <IconFileText className="w-4 h-4" style={{ width: "16px", height: "16px" }} />
                  </span>
                  <input
                    id="invoiceNumber"
                    type="text"
                    value={invoiceNumber}
                    placeholder="e.g. INV-2024-001"
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="supplierName">Supplier / Vendor Name</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <IconBuilding className="w-4 h-4" style={{ width: "16px", height: "16px" }} />
                  </span>
                  <input
                    id="supplierName"
                    type="text"
                    value={supplierName}
                    placeholder="e.g. Acme Corp"
                    onChange={(e) => setSupplierName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="totalAmount">Total Amount ($)</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <IconDollarSign className="w-4 h-4" style={{ width: "16px", height: "16px" }} />
                  </span>
                  <input
                    id="totalAmount"
                    type="number"
                    step="0.01"
                    value={totalAmount}
                    placeholder="0.00"
                    onChange={(e) => setTotalAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="statusSelect">Processing Status</label>
                <select
                  id="statusSelect"
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="PENDING">⏳ PENDING — Under Review</option>
                  <option value="PROCESSED">✅ PROCESSED — Verified & Complete</option>
                  <option value="FAILED">❌ FAILED — Extraction Error</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                <button
                  type="button"
                  onClick={handleSave}
                  className="btn btn-primary"
                  disabled={saving}
                  style={{ flex: 1 }}
                >
                  {saving ? (
                    <>
                      <span className="spinner"></span>
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <IconCheck className="w-4 h-4" style={{ width: "16px", height: "16px" }} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/invoices")}
                  className="btn btn-secondary"
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Right Column: Live Summary Preview Card */}
            <div>
              <div className="card" style={{ background: "linear-gradient(to bottom, #ffffff, #f8fafc)", position: "sticky", top: "5rem" }}>
                <h3 style={{ marginBottom: "1.25rem", color: "var(--text-secondary)" }}>
                  Live Document Preview
                </h3>

                <div style={{
                  padding: "1.5rem",
                  background: "#ffffff",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)",
                  boxShadow: "var(--shadow-xs)",
                  marginBottom: "1.5rem"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                    <div>
                      <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>
                        INVOICE
                      </span>
                      <h2 style={{ margin: "0.2rem 0", fontSize: "1.3rem" }}>
                        {invoiceNumber || "INV-XXXX"}
                      </h2>
                    </div>
                    <span className={`status-badge ${status.toLowerCase()}`}>
                      {status}
                    </span>
                  </div>

                  <div style={{ borderTop: "1px dashed var(--border-subtle)", paddingTop: "1rem", marginTop: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                      <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Supplier</span>
                      <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{supplierName || "—"}</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                      <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Database ID</span>
                      <span style={{ fontSize: "0.85rem", fontFamily: "monospace", color: "var(--text-muted)" }}>{id}</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-subtle)", paddingTop: "1rem", marginTop: "0.5rem" }}>
                      <span style={{ fontSize: "0.95rem", fontWeight: 700 }}>Total Due</span>
                      <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--primary)" }}>
                        {formatCurrency(totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  <IconCheckCircle className="w-4 h-4" style={{ width: "16px", height: "16px", color: "var(--success)" }} />
                  <span>Changes sync directly to the PostgreSQL database</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default InvoiceDetails;