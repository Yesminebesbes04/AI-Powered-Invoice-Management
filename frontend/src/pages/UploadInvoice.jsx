import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import Navbar from "../components/Navbar";
import {
  IconUploadCloud,
  IconFileText,
  IconTrash,
  IconSparkles
} from "../components/Icons";

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
const MAX_FILE_SIZE_MB = 10;

function UploadInvoice() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);
  const navigate = useNavigate();

  const processSelectedFile = (selectedFile) => {
    if (!selectedFile) return;

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      toast.error("Invalid file type. Please upload a PDF, JPG, JPEG, or PNG file.");
      setFile(null);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    processSelectedFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setProgress(0);

      await api.post("/upload/process", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      });

      toast.success("Invoice processed successfully!");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (error) {
      const message = error.response?.data?.message || "Upload and processing failed.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main className="container" style={{ flex: 1 }}>
        <div className="upload-container">
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h1>Upload & Extract Invoice</h1>
            <p>
              Upload your invoice in PDF or image format for automated optical extraction and database indexing.
            </p>
          </div>

          <form onSubmit={handleUpload}>
            {/* Interactive Dropzone */}
            <div
              className={`dropzone-box ${isDragActive ? "drag-active" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                id="file-upload-input"
                type="file"
                className="dropzone-hidden-input"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                disabled={loading}
              />

              <div className="dropzone-icon">
                <IconUploadCloud className="w-8 h-8" style={{ width: "32px", height: "32px" }} />
              </div>

              <h3 style={{ fontSize: "1.1rem", marginBottom: "0.35rem" }}>
                {file ? "Choose a different file or drop here" : "Click to select or drag and drop"}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                Supports standard invoice documents up to {MAX_FILE_SIZE_MB}MB
              </p>

              <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                <span className="status-badge user" style={{ fontSize: "0.75rem" }}>PDF</span>
                <span className="status-badge user" style={{ fontSize: "0.75rem" }}>PNG</span>
                <span className="status-badge user" style={{ fontSize: "0.75rem" }}>JPG / JPEG</span>
              </div>
            </div>

            {/* Selected File Preview Card */}
            {file && (
              <div className="file-preview-card">
                <div className="file-preview-left">
                  <div className="file-preview-icon">
                    <IconFileText className="w-5 h-5" style={{ width: "20px", height: "20px" }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.925rem", color: "var(--text-primary)" }}>
                      {file.name}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for processing
                    </div>
                  </div>
                </div>

                {!loading && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setFile(null)}
                    title="Remove file"
                  >
                    <IconTrash className="w-4 h-4" style={{ width: "15px", height: "15px" }} />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            )}

            {/* Progress Bar */}
            {loading && (
              <div className="progress-container">
                <div className="progress-header">
                  <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span className="spinner spinner-dark" style={{ width: "14px", height: "14px" }}></span>
                    <span>Analyzing & Extracting Invoice Data...</span>
                  </span>
                  <span>{progress}%</span>
                </div>
                <div className="progress-bar-track">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div style={{ marginTop: "1.75rem" }}>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: "100%" }}
                disabled={loading || !file}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    <span>Processing with AI Engine...</span>
                  </>
                ) : (
                  <>
                    <IconSparkles className="w-5 h-5" style={{ width: "18px", height: "18px" }} />
                    <span>Upload & Extract Data</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default UploadInvoice;