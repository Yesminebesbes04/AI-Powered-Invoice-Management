// src/services/api.js

import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically add JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ======================
// Authentication
// ======================

export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", response.data.role);
  }

  return response.data;
};

export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};

// ======================
// Invoices
// ======================

export const getInvoices = async () => {
  const response = await api.get("/invoices");
  return response.data;
};

export const getInvoiceById = async (id) => {
  const response = await api.get(`/invoices/${id}`);
  return response.data;
};

export const searchInvoices = async (supplier) => {
  const response = await api.get(
    `/invoices/search?supplier=${supplier}`
  );

  return response.data;
};

// ======================
// Upload Invoice
// ======================

export const uploadInvoice = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    "/upload/process",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// ======================
// Admin
// ======================

export const getUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const createUser = async (userData) => {
  const response = await api.post(
    "/admin/users",
    userData
  );

  return response.data;
};

export default api;