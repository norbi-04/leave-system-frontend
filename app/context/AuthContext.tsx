import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import type { AuthUser } from "~/types/UserType";
import { useNavigate } from "react-router";

// Auth context type definition
type AuthProps = {
    token: string | null; // JWT token or null if not authenticated
    user: AuthUser | null; // Decoded user object or null
    login: (token: string) => void; // Function to log in and set token
    logout: () => void; // Function to log out and clear token/user
}

// Create the AuthContext
const AuthContext = createContext<AuthProps | undefined>(undefined);

export { AuthContext };

// AuthProvider component to wrap the app and provide auth state
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null); // Store JWT token
    const [user, setUser] = useState<AuthUser | null>(null); // Store decoded user
    const navigate = useNavigate();

    // On mount, load token from localStorage (if present)
    useEffect(() => {
        const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        setToken(storedToken);
    }, []);

    // When token changes, decode it and set user
    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode<AuthUser>(token);
                console.log("Decoded JWT:", decoded)
                setUser({
                    ...decoded,
                    token: {
                        ...decoded.token,
                        leaveBalance: decoded.token.leaveBalance,
                    }
                });
            } catch {
                setUser(null);
            }
        }
    }, [token]);

    // Login function: set token and save to localStorage
    const login = (jwt: string) => {
        setToken(jwt);
        if (typeof window !== "undefined") {
            localStorage.setItem("token", jwt);
        }
    };

    // Logout function: clear token/user and redirect to login
    const logout = () => {
        setToken(null);
        setUser(null);
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
        }
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use the AuthContext
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be inside AuthProvider");
    }
    return context;
}