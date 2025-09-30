import { useState } from "react";
import { useAuth } from "~/context/AuthContext";
import { loginApi } from "../api/auth";
import { useNavigate } from "react-router";
import styles from "~/styles/LoginForm.module.css";

export default function Login() {
    const { login, user } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Handle form submission for login
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Sanitize email input to prevent injection
        const cleanEmail = sanitizeEmail(email);

        try {
            // Call login API with sanitized email and password
            const { accessToken } = await loginApi(cleanEmail, password);
            login(accessToken); // Save token and user info in context
            console.log("Login successful");
            navigate("/home"); // Redirect to home page after login

        } catch (error) {
            // Show error if login fails
            console.error("Login error:", error);
            setError("Invalid email or password");
        }
    };

    // Remove unwanted characters from email input
    function sanitizeEmail(email: string) {
        return email.trim().replace(/[<>"'`;]/g, "");
    }

    return (
        <div>
            {/* Page header */}
            <h1 className={styles.header}>Welcome to the login page!</h1>
          
            <div className={styles.container}>
                {/* Login form */}
                <form className={styles.form} onSubmit={handleSubmit}> 
                    <h2 className={`${styles.title} pb-3`}>Login</h2>
                    <p className={`${styles.subheader} flex justify-center pb-8`}>Please log in to continue to the leave system.</p>

                    {/* Email input */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Email</label>
                        <input 
                            className="input"
                            type="email" 
                            placeholder="Enter your email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password input */}
                    <div className={`${styles.inputGroup} pb-8`}>
                        <label className={styles.label}>Password</label>
                        <input 
                            className="input"
                            type="password" 
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {/* Show error message if login fails */}
                        {error && <p className={styles.error}>{error}</p>}
                    </div>
                    {/* Login button */}
                    <div className="flex justify-center">
                       <button className="mt-4 w-full h-12 text-lg btn-primary" type="submit">Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
