import type { User } from "~/types/UserType";
import styles from '~/styles/PanelDetails.module.css';

interface UserDetailsProps {
  user: User; 
}

export default function UserDetails({ user }: UserDetailsProps) {
  return (
    <div className={styles.container}>
      <div className={styles.field}>
        <label className={styles.label}>First Name</label>
        <span className={styles.value}>{user.firstName}</span>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Last Name</label>
        <span className={styles.value}>{user.lastName}</span>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Email</label>
        <span className={styles.value}>{user.email}</span>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Department</label>
        <span className={styles.value}>{user.department?.name || "—"}</span>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Role</label>
        <span className={styles.value}>{user.role?.name || "—"}</span>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Leave Balance</label>
        <span className={styles.value}>{user.leaveBalance}</span>
      </div>
    </div>
  );
}
