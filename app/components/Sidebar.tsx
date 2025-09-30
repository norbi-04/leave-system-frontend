import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import styles from "~/styles/Sidebar.module.css";

// Profile type for sidebar user info
interface Profile {
    firstName: string;
    lastName: string;
    email: string;
    role: {
      id: number;
    };
}

// Props for Sidebar component
interface SidebarProps {
    profile?: Profile
}

export function Sidebar({ profile }: SidebarProps) {
    const { logout } = useAuth();
    const navigate = useNavigate();    

    return (
         <div className="sticky top-0 h-screen">
            <div className={styles.sidebar}>
                {/* Sidebar title */}
                <h2 className={styles.sidebarTitle}>Leave Dashboard</h2>

                {/* Sidebar menu list */}
                <ul className={styles.menuList}>
                    {/* Home navigation */}
                    <li className={styles.menuItem}>
                        <button className="cursor-pointer" type="button" onClick={() => navigate("/home")}>Home</button>
                    </li>
                    {/* My Leave navigation */}
                    <li className={styles.menuItem}>
                        <button className="cursor-pointer" type="button" onClick={() => navigate("/my-leave")}>My Leave</button>
                    </li>
                    {/* Manage Leave Requests (not shown for role id 3) */}
                    {profile?.role.id !== 3 && (
                        <li className={styles.menuItem}>
                            <button className="cursor-pointer" type="button" onClick={() => navigate("/pending-leave")}>Manage Leave Requests</button>
                        </li>
                    )}
                    {/* Users navigation */}
                    <li className={styles.menuItem}>
                        <button className="cursor-pointer"  type="button" onClick={() => navigate("/users")}>Users</button>
                    </li>
                    {/* Reporting Line navigation */}
                    <li className={styles.menuItem}>
                        <button className="cursor-pointer" type="button" onClick={() => navigate("/reporting")}>Reporting Line</button>
                    </li>
                </ul>

                {/* Bottom profile section */}
                {profile && (
                <div className={styles.profileContainer}>
                    <div className={styles.profileSection}>
                        {/* User avatar (first letter of email) */}
                        <div className={styles.profileAvatar}>
                            {profile.email.charAt(0).toUpperCase()}
                        </div>
                        {/* User name and email */}
                        <div className={styles.profileInfo}>
                            <span className={styles.profileName}>{profile.firstName} {profile.lastName}</span>
                            <span className={styles.profileEmail}>{profile.email}</span>
                        </div>
                    </div>
                    {/* Logout button */}
                    <button className="btn-secondary" onClick={() => logout()}>Logout</button>
                </div>
                )}
            </div>
        </div>
    );
}