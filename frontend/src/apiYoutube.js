import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV || !import.meta.env.VITE_API_URL;

// Use local backend for YouTube API in development, Choreo for production
const youtubeApiUrl = isDevelopment 
  ? "http://localhost:8000/api"  // Local Django backend
  : "/choreo-apis/awbo/backend/rest-api-be2/v1.0";  // Choreo backend

// Main API instance for Choreo endpoints (notes, auth, etc.)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
});

// Separate API instance for YouTube endpoints
export const youtubeApi = axios.create({
  baseURL: youtubeApiUrl,
});

// Add auth interceptors to both
[youtubeApi, api].forEach(axiosInstance => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
});

export default api;