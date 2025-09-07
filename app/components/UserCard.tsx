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
      <div style={{ marginBottom: "20px" }} className={styles.card}>
        <b>Name: </b>
        {user.firstName} &nbsp; {user.lastName}
        <br />

        <b>Email: </b>
        {user.email}
        <br />

        <div className="flex justify-end">
          <span className={styles.button} aria-hidden="true">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
}
