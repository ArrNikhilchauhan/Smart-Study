import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ element }) {
  const token = localStorage.getItem("token"); // Check for authentication token
  return token ? element : <Navigate to="/login" />; // Redirect to login if no token
}

export default ProtectedRoute;
