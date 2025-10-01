import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import type { AuthUser } from "~/types/UserType";
import { useNavigate } from "react-router";

type AuthProps = {
    token: string | null;
    user: AuthUser | null;
    login: (token: string) => void;
    logout: () => void;
}

// context
const AuthContext = createContext<AuthProps | undefined>(undefined);
export { AuthContext };

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<AuthUser | null>(null);
    const navigate = useNavigate();

    // load token from localstorage
    useEffect(() => {
        const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        setToken(storedToken);
    }, []);

    // decode token and set user
    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode<AuthUser>(token);
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

    // login
    const login = (jwt: string) => {
        setToken(jwt);
        if (typeof window !== "undefined") {
            localStorage.setItem("token", jwt);
        }
    };

    // logout
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

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be inside AuthProvider");
    }
    return context;
}