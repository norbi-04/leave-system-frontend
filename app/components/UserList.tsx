import { Link } from "react-router-dom";
import styles from "../styles/List.module.css";
import type { UserSummary } from "~/routes/types/User";

interface UserListProps {
  user: UserSummary;
  onViewDetails: (id: number) => void;
  onEditUser: (id: number) => void;
}

export default function UserList({ user, onViewDetails, onEditUser }: UserListProps) {
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
            <button onClick={() => onViewDetails(user.id)} className="btn-trietery">
              View Details
            </button>
          </li>
          <li className="ml-auto pr-2">
            <button className="btn-primary" onClick={() => onEditUser(user.id)}>
              Edit User
            </button>
          </li>
          <li className="ml-auto pr-3">
            <button className="text-sm btn-delete">Delete User</button>
          </li>
        </ul>
      </div>
    </div>
  );
}
