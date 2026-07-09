/**
 * Axios client configured for the backend API.
 *
 * Base URL comes from the environment variable so it's easy to swap
 * between local development and production deployment.
 */

import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  timeout: 600000, // 10 minutes — AI processing can take a while for large files
  headers: {
    Accept: "application/json",
  },
});

// Response interceptor: unwrap data or normalise errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Pull the backend error message if available
    const serverMessage =
      error.response?.data?.error?.message ||
      error.response?.data?.message;

    const friendlyMessage =
      serverMessage ||
      (error.code === "ECONNABORTED"
        ? "Request timed out. The file might be too large or the server is busy."
        : "Something went wrong. Please check your connection and try again.");

    return Promise.reject(new Error(friendlyMessage));
  }
);

/**
 * Uploads a CSV file to the backend for AI extraction.
 *
 * @param {File} file - The CSV file to upload
 * @returns {Promise<object>} - Parsed CRM results
 */
export async function importCSV(file) {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/import", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export default api;
