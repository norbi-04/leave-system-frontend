import type { UserSummary } from '../../types/UserType';
import styles from '~/styles/List.module.css';

interface ReportingListProps {
    user: UserSummary;
    manager: UserSummary;
    startDate: string;
    endDate?: string;
    onEdit?: () => void;
    onDelete?: () => void;
}

export default function ReportingList({ user: rowUser, manager: rowManager, startDate, endDate, onEdit, onDelete }: ReportingListProps) {
    return (
        <div className={styles.listRow}>
            <div className={`${styles.listColumn} ${styles.email}`}>{rowUser.email}</div>
            <div className={`${styles.listColumn} ${styles.email}`}>{rowManager.email}</div>
            <div className={`${styles.listColumn} ${styles.button}`}>{startDate}</div>
            <div className={`${styles.listColumn} ${styles.button}`}>{endDate || "-"}</div>
            <div className={`${styles.listColumn} ${styles.button}`}>
                <button className="btn-details" onClick={onEdit}>Edit</button>
            </div>
            <div className={`${styles.listColumn} ${styles.button}`}>
                <button className="btn-delete" onClick={onDelete}>Delete</button>
            </div>
        </div>
    );
}