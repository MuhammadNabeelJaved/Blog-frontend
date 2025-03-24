import dotenv from "dotenv";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import axios from "axios";
import Loader from "../components/Loader.jsx";

// dotenv.config();
// Create the Authentication Context
const AuthContext = createContext(null);

const route =
  import.meta.env.VITE_API_USERS_BASE_URL || "http://localhost:3000/api/users";

// Create the Authentication Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Setup axios interceptor for token refresh
  useEffect(() => {
    // Set up axios interceptor for handling 401 errors
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried refreshing token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Get refresh token from storage
            const refreshToken = localStorage.getItem("refreshToken");

            if (!refreshToken) {
              throw new Error("No refresh token available");
            }

            // Call the refresh token endpoint
            const response = await axios.post(`${route}/refresh-token`, {
              refreshToken,
            });

            if (response.data?.data?.accessToken) {
              // Update tokens in storage
              localStorage.setItem(
                "accessToken",
                response.data.data.accessToken
              );
              localStorage.setItem(
                "refreshToken",
                response.data.data.refreshToken
              );

              // Update authorization header and retry original request
              originalRequest.headers[
                "Authorization"
              ] = `Bearer ${response.data.data.accessToken}`;
              return axios(originalRequest);
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            // Logout on refresh token failure
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setCurrentUser(null);
            setIsLoggedIn(false);
          }
        }

        return Promise.reject(error);
      }
    );

    // Clean up interceptor when component unmounts
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  });

  // Check if the user is logged in when the component mounts
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        // Get the token from localStorage
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          setLoading(false);
          setIsLoggedIn(false);
          return;
        }

        try {
          // Validate the token with your backend
          const response = await axios.get(`${route}/me`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (response.status === 200 && response.data?.data) {
            setCurrentUser(response.data.data);
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.error("Token validation error:", error);

          // Handle failed validation - token refresh will be handled by interceptor
          if (error.response?.status === 401) {
            // Let the interceptor handle token refresh
            // If that fails, the interceptor will clear tokens and log out
          } else {
            // For other errors, log out
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setIsLoggedIn(false);
          }
        }
      } catch (error) {
        console.error("Authentication error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // Login function - memoized with useCallback to prevent recreation on each render
  const login = useCallback(async (email, password) => {
    try {
      // Make the login API request
      const response = await axios.post(`${route}/login`, {
        email,
        password,
      });

      // Check if the response structure matches what you expect
      const responseData = response.data?.data;

      if (!responseData?.accessToken) {
        throw new Error("Invalid response format from login endpoint");
      }

      // Extract data from response
      const { accessToken, refreshToken, user } = responseData;

      // Save tokens to localStorage
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      // Set the current user
      setCurrentUser(user);
      setIsLoggedIn(true);

      return user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }, []);

  // Logout function - memoized with useCallback
  const logout = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (accessToken) {
        // Call the logout endpoint
        await axios.post(
          `${route}/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local storage and state, even if the API call fails
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setCurrentUser(null);
      setIsLoggedIn(false);
    }
  }, []);

  // Context value to be provided - memoized to prevent unnecessary re-renders
  const value = React.useMemo(
    () => ({
      currentUser,
      loading,
      isLoggedIn,
      login,
      logout,
    }),
    [currentUser, loading, isLoggedIn, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <Loader />}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
