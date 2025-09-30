import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

// Component to protect routes that require authentication
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth(); // Get authentication token from context
  const navigate = useNavigate(); // Hook for navigation
  const [checking, setChecking] = useState(true); // State to track if auth check is in progress

  useEffect(() => {
    // Check for token in context or localStorage
    const localToken = localStorage.getItem("token");
    if (!token && !localToken) {
      // If no token, redirect to login page
      navigate("/", { replace: true });
    } else {
      // If token exists, stop checking and render children
      setChecking(false);
    }
  }, [token, navigate]);

  if (checking) {
    // Optionally, show a loading spinner here while checking auth
    return null;
  }

  // Render protected content if authenticated
  return <>{children}</>;
}