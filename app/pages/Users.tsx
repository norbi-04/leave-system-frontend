import { useAuth } from "../context/AuthContext";
import { Sidebar } from "../components/Sidebar";
import { fetchUsers } from "../api/user";
import { useEffect, useState } from "react";
import UserList from "~/components/user/UserList";
import type { UserSummary } from "~/types/UserType";
import styles from '~/styles/List.module.css';
import ProtectedRoute from "~/components/ProtectedPage";

export default function Users() {
  const { user, token } = useAuth();
  const [users, setUsers] = useState<UserSummary[]>([])
  
  useEffect(() => {
    if (token) {
      fetchUsers(token).then(users => {
        setUsers(users);
        console.log("Successful fetch:", users);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
      });
    }
  }, [token]);

  return (
    <ProtectedRoute>
    <div className="flex h-screen w-full">
        <Sidebar
            profile={
                user
                ? {
                    firstName: (user.token.firstName ?? ""),
                    lastName: (user.token.lastName ?? ""),
                    email: user.token.email,
                    role: { id: user.token.role.id }
                  }
                : undefined
            }
        />

        <div className="flex-1 p-6">
            <div className={styles.listWrapper}>
                <div className="mb-25">
                    <label className="page-title">User index</label>
                    <hr className="border-gray-300 my-1" />
                    <p className="text-gray-700 mb-10 mt-3">
                        Welcome to the User index page. Below is the list of users in your organisation.
                    </p>
                </div>
                <div className="flex justify-end w-full mb-1">
                  <button className="btn-primary px-23">
                    Create User
                  </button>
                </div>
                <div className={styles.listHeader}>
                    <div className={`${styles.listColumn} ${styles.avatar}`}></div>
                    <div className={`${styles.listColumn} ${styles.name} pl-3`}>Name</div>
                    <div className={`${styles.listColumn} ${styles.email}`}>Email</div>
                    <div className={`${styles.listColumn} ${styles.button}`}></div>
                    <div className={`${styles.listColumn} ${styles.button}`}> </div>
                </div>
                {users.map(user => (
                <UserList key={user.id} user={user} />
                ))}
            </div>
        </div>
    </div>
    </ProtectedRoute>
  );
}
