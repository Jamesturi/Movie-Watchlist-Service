// client/src/utils/api.js
import axios from 'axios';

// Dynamically get base URL (fallback to localhost if env is not set)
function getBaseUrl() {
  return 'http://localhost:5000';
}

// Create central Axios instance
const api = axios.create({
  baseURL: getBaseUrl(),
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor: attach token to every request if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: centralized error handling via window event
api.interceptors.response.use(
  response => response,
  error => {
    let errorMessage = 'An unexpected error occurred';

    if (error.response) {
      // Server responded with an error status
      errorMessage = error.response.data.error 
        || error.response.data.message 
        || `Error: ${error.response.status}`;

      const errorEvent = new CustomEvent('api-error', {
        detail: { message: errorMessage, status: error.response.status }
      });
      window.dispatchEvent(errorEvent);
    } else if (error.request) {
      // No response received
      errorMessage = 'No response from server. Please check your connection.';
      
      const errorEvent = new CustomEvent('api-error', {
        detail: { message: errorMessage, status: 0 }
      });
      window.dispatchEvent(errorEvent);
    }

    return Promise.reject(error);
  }
);

export default api;
