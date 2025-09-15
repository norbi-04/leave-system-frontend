import { Link } from "react-router";
import styles from "../styles/List.module.css";
import type { UserSummary } from "~/routes/types/User";

interface UserListProps {
  user: UserSummary;
  onViewDetails: (id: number) => void;
}

export default function UserList({ user, onViewDetails }: UserListProps) {
  return (
    <div className="listWrapper">
      <div className={styles.list}>
        <ul className={styles.userRow}>
          <li className={styles.profileAvatar}>
            {user.email.charAt(0).toUpperCase()}
          </li>
          <li className={styles.name}>
            {user.firstName} {user.lastName}
          </li>
          <li className={styles.email}>{user.email}</li>
          <li className="ml-auto">
            {/* Pass only the ID here */}
            <button onClick={() => onViewDetails(user.id)} className="btn-trietery">
              View Details
            </button>
          </li>
          <li className="ml-auto pr-2">
            <button className="btn-primary">Edit User</button>
          </li>
          <li className="ml-auto pr-3">
            <button className="btn-cancel">Delete User</button>
          </li>
        </ul>
      </div>
    </div>
  );
}
