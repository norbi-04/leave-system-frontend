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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const { accessToken } = await loginApi(email, password);
            login(accessToken);
            console.log("Login successful");
            navigate("/home");

        } catch (error) {
            console.error("Login error:", error);
            setError("Invalid email or password");
        }
    };

    return (
        <div>
            <h1 className={styles.header}>Welcome!</h1>
          
            <div className={styles.container}>
        
                <form className={styles.form} onSubmit={handleSubmit}> 
                    <h2 className={`${styles.title} pb-3`}>Login</h2>
                    <p className={`${styles.subheader} flex justify-center pb-8`}>Please log in to continue.</p>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Email</label>
                        <input 
                            className={styles.input} 
                            type="email" 
                            placeholder="Enter your email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className={`${styles.inputGroup} pb-8`}>
                        <label className={styles.label}>Password</label>
                        <input 
                            className={styles.input} 
                            type="password" 
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    {error && <p className={styles.error}>{error}</p>}
                    </div>
                    <div className="flex justify-center">
                       <button className="mt-4 w-full h-12 text-lg btn-primary" type="submit">Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
