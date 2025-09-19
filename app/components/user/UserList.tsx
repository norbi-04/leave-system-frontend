import type { UserSummary } from '../../types/UserType';
import styles from '~/styles/List.module.css';

interface UserListProps {
    user: UserSummary;
}

export default function UserList({ user }: UserListProps) {
    return (
        <div className={styles.listRow}>
            <div className={`${styles.listColumn} ${styles.avatar}`}>
                <span className={styles.profileAvatar}>{user.email.charAt(0).toUpperCase()}</span>
            </div>
            <div className={`${styles.listColumn} ${styles.name}`}>{user.firstName} {user.lastName}</div>
            <div className={`${styles.listColumn} ${styles.email}`}>{user.email}</div>
            <div className={`${styles.listColumn} ${styles.button}`}>
                <button className="btn-details">View Details</button>
            </div>
            <div className={`${styles.listColumn} ${styles.button}`}>
                <button className="btn-delete">Delete</button>
            </div>
        </div>
    );
}