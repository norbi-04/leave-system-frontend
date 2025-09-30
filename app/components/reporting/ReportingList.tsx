import type { UserSummary } from '../../types/UserType';
import styles from '~/styles/List.module.css';
import { useAuth } from "../../context/AuthContext";

interface ReportingListProps {
    user: UserSummary;        // The user in the reporting line
    manager: UserSummary;     // The manager for the user
    startDate: string;        // Start date of the reporting line
    endDate?: string;         // Optional end date of the reporting line
    onEdit?: () => void;      // Callback for editing the reporting line
    onDelete?: () => void;    // Callback for deleting the reporting line
}

export default function ReportingList({ user: rowUser, manager: rowManager, startDate, endDate, onEdit, onDelete }: ReportingListProps) {
    const { user } = useAuth();
    // Check if the current user is an admin
    const isAdmin = user?.token?.role?.name === "admin";
    return (
        <div className={`${styles.listRow2}`}>
            {/* Display user email */}
            <div className={`${styles.listColumn2} ${styles.email} py-3`}>{rowUser.email}</div>
            {/* Display manager email */}
            <div className={`${styles.listColumn2} ${styles.email}`}>{rowManager.email}</div>
            {/* Display start date */}
            <div className={`${styles.listColumn2} ${styles.date}`}>{startDate}</div>
            {/* Display end date or dash if not set */}
            <div className={`${styles.listColumn2} ${styles.date} `}>{endDate || "-"}</div>
            { isAdmin ? (
                <>
                    {/* Show edit and delete buttons for admin */}
                    <div className={`${styles.listColumn2} ${styles.button}`}>
                        <button className="btn-details" onClick={onEdit}>Edit Line</button>
                    </div>
                    <div className={`${styles.listColumn2} ${styles.button}`}>
                        <button className="btn-delete" onClick={onDelete}>Delete</button>
                    </div>
                </>
            ) : (
                <>
                    {/* Hide edit and delete buttons for non-admins */}
                    <div className={`${styles.listColumn2} ${styles.button}`}>
                        <button className="btn-details" hidden>Edit Line</button>
                    </div>
                    <div className={`${styles.listColumn2} ${styles.button}`}>
                        <button className="btn-delete" hidden>Delete</button>
                    </div>
                </>
            )}
        </div>
    );
}