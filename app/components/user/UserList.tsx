import type { UserSummary } from '../../types/UserType';
import styles from '~/styles/List.module.css';
import { useAuth } from "../../context/AuthContext";

interface UserListProps {
    user: UserSummary;
    onDelete?: () => void;
    onDeleteResult?: (success: boolean) => void;
    onViewDetails?: () => void;
    authUser?: any;
}

export default function UserList({ user: rowUser, onDelete, onViewDetails }: UserListProps) {
    const { user: authUser } = useAuth();
    const isStaff = authUser?.token?.role?.name === "staff";

    return (
        <div className={`${styles.listRow}`}>
            <div className={`${styles.listColumn} ${styles.avatar}`}>
                <span className={styles.profileAvatar} id="profileAvatar">{rowUser.email.charAt(0).toUpperCase()}</span>
            </div>
            <div className={`${styles.listColumn} ${styles.name}`}>{rowUser.firstName} {rowUser.lastName}</div>
            <div className={`${styles.listColumn} ${styles.email}`}>{rowUser.email}</div>
            { !isStaff ? (
                <>
                    <div className={`${styles.listColumn} ${styles.button}`}>
                        <button className="btn-details" onClick={onViewDetails}>View Details</button>
                    </div>
                    <div className={`${styles.listColumn} ${styles.button}`}>
                        <button className="btn-delete" onClick={onDelete}>Delete</button>
                    </div>
                </>
            ) : (
                <>
                    <span className={`${styles.listColumn} ${styles.button} btn-details`} style={{ visibility: "hidden" }}></span>
                    <span className={`${styles.listColumn} ${styles.button} btn-delete`} style={{ visibility: "hidden" }}></span>
                </>
            )}
        </div>
    );
}