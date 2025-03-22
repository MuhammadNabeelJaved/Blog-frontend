// src/authentication/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "./Auth.jsx";

const ProtectedRoute = () => {
  const { isLoggedIn, loading } = useAuth(); // Changed from isAuthenticated to isLoggedIn
  const location = useLocation();

  console.log("isLoggedIn:", isLoggedIn);
  console.log("loading:", loading);

  // If still loading, show a loading spinner
  if (loading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to login page
  if (!isLoggedIn) {
    // Pass the current location to redirect back after login
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
