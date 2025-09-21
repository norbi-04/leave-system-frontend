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
        <div className={`${styles.listRow2}`}>
            <div className={`${styles.listColumn2} ${styles.email}`}>{rowUser.email}</div>
            <div className={`${styles.listColumn2} ${styles.email}`}>{rowManager.email}</div>
            <div className={`${styles.listColumn2} ${styles.date}`}>{startDate}</div>
            <div className={`${styles.listColumn2} ${styles.date} `}>{endDate || "-"}</div>
            <div className={`${styles.listColumn2} ${styles.button}`}>
                <button className="btn-details" onClick={onEdit}>Edit Line</button>
            </div>
            <div className={`${styles.listColumn2} ${styles.button}`}>
                <button className="btn-delete" onClick={onDelete}>Delete</button>
            </div>
        </div>
    );
}