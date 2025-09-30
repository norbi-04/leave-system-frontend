import type { User } from "~/types/UserType";
import styles from '~/styles/PanelDetails.module.css';

interface UserDetailsProps {
  user: User; // The user object to display details for
}

export default function UserDetails({ user }: UserDetailsProps) {
  return (
    <div className={styles.container}>
      {/* Display user's first name */}
      <div className={styles.field}>
        <label className={styles.label}>First Name</label>
        <span className={styles.value}>{user.firstName}</span>
      </div>

      {/* Display user's last name */}
      <div className={styles.field}>
        <label className={styles.label}>Last Name</label>
        <span className={styles.value}>{user.lastName}</span>
      </div>

      {/* Display user's email */}
      <div className={styles.field}>
        <label className={styles.label}>Email</label>
        <span className={styles.value}>{user.email}</span>
      </div>

      {/* Display user's department name, or dash if not set */}
      <div className={styles.field}>
        <label className={styles.label}>Department</label>
        <span className={styles.value}>{user.department?.name || "—"}</span>
      </div>

      {/* Display user's role name, or dash if not set */}
      <div className={styles.field}>
        <label className={styles.label}>Role</label>
        <span className={styles.value}>{user.role?.name || "—"}</span>
      </div>

      {/* Display user's leave balance */}
      <div className={styles.field}>
        <label className={styles.label}>Leave Balance</label>
        <span className={styles.value}>{user.leaveBalance}</span>
      </div>
    </div>
  );
}
