import { useAuth } from "../context/AuthContext";
import { Sidebar } from "../components/Sidebar";
import { fetchUsers, fetchUserById, updateUser, deleteUser, createUser } from "../api/user";
import { fetchRoles } from "~/api/role";
import { fetchDepartments } from "~/api/deparment";
import { useEffect, useState, useRef } from "react";
import UserList from "~/components/user/UserList";
import type { UserSummary, User } from "~/types/UserType";
import type { Role } from "~/types/RoleType";
import type { Department } from "~/types/DepartmentType";
import styles from '~/styles/List.module.css';
import ProtectedRoute from "~/components/ProtectedPage";
import MessageDialog from "../components/MessageDialog";
import RightPanel from "~/components/RightPanel";
import UserForm from "~/components/user/UserForm";
import UserDetails from "~/components/user/UserDetails";
import DeleteDialog from "../components/DeleteDialog";

export default function Users() {
  const { user, token } = useAuth();
  const isStaff = user?.token.role.name === "staff";

  const [users, setUsers] = useState<UserSummary[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserSummary | null>(null);
  const [creating, setCreating] = useState(false);

  const userFormRef = useRef<any>(null);

  useEffect(() => {
    if (token) {
      fetchRoles(token).then(roles => setRoles(roles));
      fetchDepartments(token).then(departments => setDepartments(departments));
      fetchUsers(token).then(users => {
        setUsers(users);
        console.log("Successful fetch");
      })
      .catch(error => {
        console.error(error);
      });
    }
  }, [token]);

  const handleViewDetails = async (user: UserSummary) => {
    if (token && user.id !== undefined) {
      const userDetails = await fetchUserById(user.id, String(token));
      setSelectedUser(userDetails);
      setEditing(false);
      setRightPanelOpen(true);
    }
  };

  const handleDeleteUser = async (): Promise<boolean> => {
    if (!userToDelete || !token) return false;
    try {
      await deleteUser(userToDelete.id!, token);
      setDeleteDialogOpen(false);
      setRightPanelOpen(false);
      setMessage({ type: "success", text: "User account has been deleted." });
      const users = await fetchUsers(token);
      setUsers(users);
      return true;
    } catch {
      setMessage({ type: "error", text: "Failed to delete user account." });
      return false;
    }
  };

  const handleUserDeleted = async (success: boolean) => {
    if (success) {
      setMessage({ type: "success", text: `User account has been deleted.` });
      if (token) {
        const users = await fetchUsers(token);
        setUsers(users);
      }
    } else {
      setMessage({ type: "error", text: "Failed to delete user account." });
    }
  };

  const handleSave = () => {
    userFormRef.current?.submitForm();
  };

  const handleFormSubmit = async (userData: Partial<User> & { password?: string }) => {
    if (!token) return;

    const payload: any = {};

    if (userData.firstName !== undefined) payload.firstName = userData.firstName;
    if (userData.lastName !== undefined) payload.lastName = userData.lastName;
    if (userData.email !== undefined) payload.email = userData.email;
    if (userData.leaveBalance !== undefined) payload.leaveBalance = userData.leaveBalance;
    if (userData.department?.id !== undefined) payload.department_id = userData.department.id;
    if (userData.role?.id !== undefined) payload.role_id = userData.role.id;
    if (userData.password !== undefined && userData.password !== "") payload.password = userData.password;

    try {
      if (creating) {
        await createUser(payload, token);
        setMessage({ type: "success", text: "User successfully created." });
      } else if (selectedUser && selectedUser.id) {
        await updateUser(selectedUser.id, payload, token);
        setMessage({ type: "success", text: "User details successfully updated." });
      }
      setEditing(false);
      setRightPanelOpen(false);
      setCreating(false);

      const users = await fetchUsers(token);
      setUsers(users);
    } catch (error) {
      setMessage({ type: "error", text: creating ? "Failed to create user." : "Failed to update user details." });
    }
  };

  const handleCreateUser = () => {
    setSelectedUser({
      firstName: "",
      lastName: "",
      email: "",
      department: { id: 0, name: "" },
      leaveBalance: 0,
      role: { id: 0, name: "" }
    });
    setEditing(true);
    setCreating(true);
    setRightPanelOpen(true);
  };

  return (
    <ProtectedRoute>
      {message && (
        <MessageDialog
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}
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
                {!isStaff ? (
                  <div className="flex justify-end w-full mb-1">
                    <button className="btn-primary px-15" onClick={handleCreateUser}>
                      Create New User
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-end w-full mb-1">
                    <button className="px-23" style={{ visibility: "hidden" }}>
                      Create New User
                    </button>
                  </div>
                )}
                <div className={styles.listHeader}>
                    <div className={`${styles.listColumn} ${styles.avatar}`}></div>
                    <div className={`${styles.listColumn} ${styles.name} pl-3`}>Name</div>
                    <div className={`${styles.listColumn} ${styles.email}`}>Email</div>
                    <div className={`${styles.listColumn} ${styles.button}`}></div>
                    <div className={`${styles.listColumn} ${styles.button}`}> </div>
                </div>
                  {users.map(user => (
                    <UserList
                      key={user.id}
                      user={user}
                      onDelete={() => {
                        setUserToDelete(user);
                        setDeleteDialogOpen(true);
                      }}
                      onDeleteResult={handleUserDeleted}
                      onViewDetails={() => {handleViewDetails(user);}}
                    />
                  ))}
            </div>
            <RightPanel
              open={rightPanelOpen}
              onClose={() => setRightPanelOpen(false)}
              title={creating ? "Create New User" : "User Details"}
              editing={editing}
              editAction={() => setEditing(true)}
              deleteAction={() => {
                if (selectedUser) {
                  setUserToDelete(selectedUser);
                  setDeleteDialogOpen(true);
                }
              }}
              saveAction={handleSave}
              onCancel={() => {
                setEditing(false);
                setCreating(false);
                setRightPanelOpen(false);
                setSelectedUser(null);
              }}
            >
              {editing && selectedUser ? (
                <UserForm
                  ref={userFormRef}
                  user={selectedUser}
                  roles={roles}
                  departments={departments}
                  onSubmit={handleFormSubmit}
                />
              ) : (
                selectedUser && <UserDetails user={selectedUser} />
              )}
            </RightPanel>
    
          {deleteDialogOpen && userToDelete && (
            <DeleteDialog
              title="Delete account"
              message={`Are you sure you want to permanently delete ${userToDelete.firstName} ${userToDelete.lastName}? This action cannot be undone.`}
              deleteAction={handleDeleteUser}
              open={deleteDialogOpen}
              onClose={() => setDeleteDialogOpen(false)}
              onDeleteResult={handleUserDeleted}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
