import axios from 'axios';

// 1. Resolve API URL from environment variables
// During development, Vite proxies requests from localhost:5173 to localhost:5000 via proxy config.
// In production, we read the environment variable.
const API_URL = import.meta.env.VITE_API_URL || '';

// 2. Instantiate custom Axios Client
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Safe 10-second request timeout limit
});

/**
 * Request Interceptor (Outgoing Requests)
 * Automatically intercepts every outgoing request and injects the JWT token
 * into the Authorization header if the session exists in localStorage.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sniplink_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Bind Bearer token structure
    }
    return config;
  },
  (error) => {
    // Forward request-level exceptions to the caller
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor (Incoming Responses & Errors)
 * Intercepts every response from the backend. 
 * Resolves successful cases immediately, and normalizes error messages 
 * for immediate rendering by react-hot-toast.
 */
api.interceptors.response.use(
  (response) => {
    // Return the response directly if HTTP status is in the 2xx range
    return response;
  },
  (error) => {
    let normalizedMessage = 'An unexpected connection error occurred. Please try again.';

    // 1. Check if backend returned a response (HTTP status outside 2xx)
    if (error.response) {
      const { status, data } = error.response;

      // Extract user-friendly error message returned by our backend's global error handler
      normalizedMessage = data?.message || normalizedMessage;

      // Handle 401 Unauthorized globally (Token expired, manipulated, or missing)
      if (status === 401) {
        localStorage.removeItem('sniplink_token');
        localStorage.removeItem('sniplink_user');

        // Redirect to login if user is not already on the landing or registration screens
        const publicPaths = ['/login', '/register', '/'];
        if (!publicPaths.includes(window.location.pathname)) {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      // 2. The request was made but no response was received (Server is offline or CORS issue)
      normalizedMessage = 'The server is currently unreachable. Please check your internet connection.';
    } else {
      // 3. Exception triggered during request setup
      normalizedMessage = error.message;
    }

    // Mutate the error object to store our unified message
    error.friendlyMessage = normalizedMessage;

    // Reject the promise so calling controllers can catch it and display a Toast alert instantly
    return Promise.reject(error);
  }
);

export default api;
