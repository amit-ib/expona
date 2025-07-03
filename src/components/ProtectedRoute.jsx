import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { user, authLoading } = useAuth();
    if (authLoading) {
        // Optionally, render a loader here
        return null;
    }
    // user is now userDetail from AuthContext
    if (!user) {
        return <Navigate to="/signin" replace />;
    }
    return children;
};

export default ProtectedRoute; 