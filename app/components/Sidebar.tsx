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
                {/* sidebar title */}
                <h2 className={styles.sidebarTitle}>Leave Dashboard</h2>

                {/* sidebar menu list */}
                <ul className={styles.menuList}>
                    <li className={styles.menuItem}>
                        <button className="cursor-pointer" type="button" onClick={() => navigate("/home")}>Home</button>
                    </li>
                    <li className={styles.menuItem}>
                        <button className="cursor-pointer" type="button" onClick={() => navigate("/my-leave")}>My Leave</button>
                    </li>
                    {profile?.role.id !== 3 && (
                        <li className={styles.menuItem}>
                            <button className="cursor-pointer" type="button" onClick={() => navigate("/pending-leave")}>Manage Leave Requests</button>
                        </li>
                    )}
                    <li className={styles.menuItem}>
                        <button className="cursor-pointer"  type="button" onClick={() => navigate("/users")}>Users</button>
                    </li>
                
                    <li className={styles.menuItem}>
                        <button className="cursor-pointer" type="button" onClick={() => navigate("/reporting")}>Reporting Line</button>
                    </li>
                </ul>

                {/* profile section */}
                {profile && (
                <div className={styles.profileContainer}>
                    <div className={styles.profileSection}>
                        {/* avatar */}
                        <div className={styles.profileAvatar}>
                            {profile.email.charAt(0).toUpperCase()}
                        </div>
                        {/* user info */}
                        <div className={styles.profileInfo}>
                            <span className={styles.profileName}>{profile.firstName} {profile.lastName}</span>
                            <span className={styles.profileEmail}>{profile.email}</span>
                        </div>
                    </div>
                    {/* logout button */}
                    <button className="btn-secondary" onClick={() => logout()}>Logout</button>
                </div>
                )}
            </div>
        </div>
    );
}