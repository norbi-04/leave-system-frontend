import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import styles from "~/styles/Sidebar.module.css";


interface Profile {
    firstName: string;
    lastName: string;
    email: string;
    role: {
      id: number;
    };
}

interface SidebarProps {
    profile?: Profile
}

export function Sidebar({ profile }: SidebarProps) {
    const { logout } = useAuth();
    const navigate = useNavigate();    

    return (
         <div className="sticky top-0 h-screen">
            <div className={styles.sidebar}>
                {/* Title */}
                <h2 className={styles.sidebarTitle}>Leave Dashboard</h2>

                {/* Menu list (hardcoded) */}
                <ul className={styles.menuList}>
                    <li className={styles.menuItem} onClick={() => navigate("/home")}>
                        Home
                    </li>
                    <li className={styles.menuItem} onClick={() => navigate("/")}>
                        My Leave
                    </li>
                    {profile?.role.id === 1 && (
                        <li className={styles.menuItem} onClick={() => navigate("/")}>
                            Manage Leave Requests
                        </li>
                    )}
                    <li className={styles.menuItem} onClick={() => navigate("/users")}>
                        Users
                    </li>
                    <li className={styles.menuItem} onClick={() => navigate("/reporting")}>
                        Reporting Line
                    </li>
                    <li className={styles.menuItem} onClick={() => navigate("/")}>
                        Roles
                    </li>
                    <li className={styles.menuItem} onClick={() => navigate("/")}>
                        Departments
                    </li>
                </ul>

                {/* Bottom profile */}
                {profile && (
                <div className={styles.profileContainer}>
                    <div className={styles.profileSection}>
                    <div className={styles.profileAvatar}>
                        {profile.email.charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.profileInfo}>
                        <span className={styles.profileName}>{profile.firstName} {profile.lastName}</span>
                        <span className={styles.profileEmail}>{profile.email}</span>
                    </div>
                    </div>
                    <button className="btn-secondary" onClick={() => logout()}>Logout</button>
                </div>
                )}
            </div>
        </div>
    );
}