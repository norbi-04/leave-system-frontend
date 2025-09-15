import { Link } from "react-router"; 
import styles from "../styles/Card.module.css";

interface UserCardProps {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <Link to={`/users/${user.id}`}>

      <div style={{ marginBottom: "40px" }} className={styles.card}>

        <div>
          <p className={styles.name}>{user.firstName} {user.lastName} &nbsp;</p>
          <p className={styles.email}>{user.email} </p>
        </div>

        <div className="flex justify-end mt-auto">
          <span className="btn-primary" aria-hidden="true">
            View Details
          </span>
        </div>

      </div>

    </Link>
  );
}
