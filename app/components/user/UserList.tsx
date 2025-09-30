import type { UserSummary } from '../../types/UserType';
import styles from '~/styles/List.module.css';
import { useAuth } from "../../context/AuthContext";

interface UserListProps {
    user: UserSummary; // The user to display in the list
    onDelete?: () => void; // Callback for deleting the user
    onDeleteResult?: (success: boolean) => void; // Callback for delete result (not used here)
    onViewDetails?: () => void; // Callback for viewing user details
    authUser?: any; // Optionally passed authenticated user (not used here)
}

export default function UserList({ user: rowUser, onDelete, onViewDetails }: UserListProps) {
    const { user: authUser } = useAuth();
    // Check if the current user is an admin
    const isAdmin = authUser?.token?.role?.name === "admin";

    return (
        <div className={`${styles.listRow}`}>
            {/* User avatar (first letter of email) */}
            <div className={`${styles.listColumn} ${styles.avatar}`}>
                <span className={styles.profileAvatar} id="profileAvatar">{rowUser.email.charAt(0).toUpperCase()}</span>
            </div>
            {/* User full name */}
            <div className={`${styles.listColumn} ${styles.name}`}>{rowUser.firstName} {rowUser.lastName}</div>
            {/* User email */}
            <div className={`${styles.listColumn} ${styles.email}`}>{rowUser.email}</div>
            { isAdmin ? (
                <>
                    {/* Show details and delete buttons for admin */}
                    <div className={`${styles.listColumn} ${styles.button}`}>
                        <button className="btn-details" onClick={onViewDetails}>View Details</button>
                    </div>
                    <div className={`${styles.listColumn} ${styles.button}`}>
                        <button className="btn-delete" onClick={onDelete}>Delete</button>
                    </div>
                </>
            ) : (
                <>
                    {/* Hide details and delete buttons for non-admins */}
                    <span className={`${styles.listColumn} ${styles.button} btn-details`} style={{ visibility: "hidden" }}></span>
                    <span className={`${styles.listColumn} ${styles.button} btn-delete`} style={{ visibility: "hidden" }}></span>
                </>
            )}
        </div>
    );
}