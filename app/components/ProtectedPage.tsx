import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // check for token in context or localstorage
    const localToken = localStorage.getItem("token");
    if (!token && !localToken) {
      navigate("/", { replace: true });
    } else {
      setChecking(false);
    }
  }, [token, navigate]);

  if (checking) {
    return null;
  }

  return <>{children}</>;
}