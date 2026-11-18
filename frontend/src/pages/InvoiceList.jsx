import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import {
  IconFileText,
  IconSearch,
  IconEdit,
  IconTrash,
  IconUploadCloud,
  IconBuilding,
  IconXCircle
} from "../components/Icons";

function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await api.get("/invoices", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setInvoices(response.data || []);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount || 0);
  };

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.invoiceNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main className="container" style={{ flex: 1 }}>
        {/* Page Header */}
        <div className="page-header">
          <div className="page-title-group">
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <h1>Invoices</h1>
              <span className="status-badge user" style={{ fontSize: "0.8rem" }}>
                {invoices.length} Total
              </span>
            </div>
            <p>Manage, inspect, and organize all processed and pending invoices</p>
          </div>

          <div>
            <button
              onClick={() => navigate("/upload")}
              className="btn btn-primary"
            >
              <IconUploadCloud className="w-4 h-4" style={{ width: "16px", height: "16px" }} />
              <span>Upload New Invoice</span>
            </button>
          </div>
        </div>

        {/* Search Bar Toolbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <div className="search-bar-wrapper" style={{ flex: "1 1 300px" }}>
            <span className="input-icon">
              <IconSearch className="w-5 h-5" style={{ width: "18px", height: "18px" }} />
            </span>
            <input
              type="text"
              placeholder="Search by invoice number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearch("")}
                title="Clear search"
              >
                <IconXCircle className="w-4 h-4" style={{ width: "16px", height: "16px" }} />
              </button>
            )}
          </div>

          {search && (
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Found {filteredInvoices.length} matching result{filteredInvoices.length === 1 ? "" : "s"}
            </div>
          )}
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="table-container" style={{ padding: "2rem" }}>
            <div className="skeleton" style={{ height: "45px", marginBottom: "1rem" }}></div>
            <div className="skeleton" style={{ height: "45px", marginBottom: "1rem" }}></div>
            <div className="skeleton" style={{ height: "45px", marginBottom: "1rem" }}></div>
            <div className="skeleton" style={{ height: "45px" }}></div>
          </div>
        ) : invoices.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <IconFileText className="w-6 h-6" style={{ width: "28px", height: "28px" }} />
            </div>
            <h3>No Invoices Found</h3>
            <p>You have not added any invoices yet. Start by uploading an invoice document.</p>
            <button
              onClick={() => navigate("/upload")}
              className="btn btn-primary"
            >
              <IconUploadCloud className="w-4 h-4" style={{ width: "16px", height: "16px" }} />
              <span>Upload Invoice Now</span>
            </button>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <IconSearch className="w-6 h-6" style={{ width: "28px", height: "28px" }} />
            </div>
            <h3>No Matching Invoices</h3>
            <p>No invoices matched your search query "{search}". Try searching by another number.</p>
            <button
              onClick={() => setSearch("")}
              className="btn btn-secondary"
            >
              Clear Search Query
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="saas-table">
              <thead>
                <tr>
                  <th>Invoice Number</th>
                  <th>Supplier</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => {
                  const status = invoice.status || "PENDING";
                  return (
                    <tr
                      key={invoice.id}
                      onClick={() => navigate(`/invoices/${invoice.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <td style={{ fontWeight: 600 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                          <div style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "var(--radius-md)",
                            background: "var(--primary-light)",
                            color: "var(--primary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0
                          }}>
                            <IconFileText className="w-4 h-4" style={{ width: "16px", height: "16px" }} />
                          </div>
                          <span>{invoice.invoiceNumber || "Untitled Invoice"}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-secondary)" }}>
                          <IconBuilding className="w-4 h-4" style={{ width: "14px", height: "14px", color: "var(--text-muted)" }} />
                          <span>{invoice.supplierName || "—"}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 700 }}>
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
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            title="Edit invoice"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/invoices/${invoice.id}`);
                            }}
                          >
                            <IconEdit className="w-3.5 h-3.5" style={{ width: "14px", height: "14px" }} />
                            <span>Edit</span>
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            title="Delete invoice"
                            onClick={async (e) => {
                              e.stopPropagation();

                              if (!window.confirm("Delete this invoice?")) {
                                return;
                              }

                              try {
                                const token = localStorage.getItem("token");

                                await api.delete(`/invoices/${invoice.id}`, {
                                  headers: {
                                    Authorization: `Bearer ${token}`
                                  }
                                });

                                setInvoices(
                                  invoices.filter((i) => i.id !== invoice.id)
                                );
                              } catch (error) {
                                console.log(error);
                              }
                            }}
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

export default InvoiceList;