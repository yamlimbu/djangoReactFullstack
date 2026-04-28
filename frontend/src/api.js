import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost';

// URLs for different backends
const choreoApiUrl = "/choreo-apis/awbo/backend/rest-api-be2/v1.0";
const localApiUrl = "http://localhost:8000/api";

// Main API instance for Choreo endpoints (notes, auth, etc.)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || choreoApiUrl,
});

// Separate API instance for YouTube endpoints (points to local Django)
export const youtubeApi = axios.create({
  baseURL: isDevelopment ? localApiUrl : (import.meta.env.VITE_YOUTUBE_API_URL || choreoApiUrl),
});

// Add auth interceptors to both instances
const addAuthInterceptor = (axiosInstance) => {
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

  // Response interceptor to handle token refresh
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If 401 error and not already retrying
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem("refresh_token");

          if (refreshToken) {
            // Request new access token
            const response = await axios.post(
              `${isDevelopment ? localApiUrl : (import.meta.env.VITE_API_URL || choreoApiUrl)}/token/refresh/`,
              { refresh: refreshToken }
            );

            const newAccessToken = response.data.access;

            // Store new token
            localStorage.setItem(ACCESS_TOKEN, newAccessToken);

            // Update the original request with new token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            // Retry the original request
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed - clear tokens and redirect to login
          localStorage.removeItem(ACCESS_TOKEN);
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

// Apply interceptors to both API instances
addAuthInterceptor(api);
addAuthInterceptor(youtubeApi);

export default api;