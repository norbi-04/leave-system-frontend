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
  const isAdmin = user?.token.role.name === "admin";

  // State for all users
  const [users, setUsers] = useState<UserSummary[]>([]);
  // State for all roles
  const [roles, setRoles] = useState<Role[]>([]);
  // State for all departments
  const [departments, setDepartments] = useState<Department[]>([]);

  // State for showing success/error messages
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  // State for the currently selected user (for details/edit)
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  // State for right panel (details/edit/create)
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  // State for editing mode
  const [editing, setEditing] = useState(false);
  // State for delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  // State for user to delete
  const [userToDelete, setUserToDelete] = useState<UserSummary | null>(null);
  // State for create mode
  const [creating, setCreating] = useState(false);

  // Ref for UserForm to trigger submit from parent
  const userFormRef = useRef<any>(null);

  // Fetch roles, departments, and users on mount or when token changes
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

  // Handle viewing user details
  const handleViewDetails = async (user: UserSummary) => {
    if (token && user.id !== undefined) {
      const userDetails = await fetchUserById(user.id, String(token));
      setSelectedUser(userDetails);
      setEditing(false);
      setRightPanelOpen(true);
    }
  };

  // Handle deleting a user
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

  // Handle result of delete dialog
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

  // Handle save button in right panel (calls form submit)
  const handleSave = () => {
    userFormRef.current?.submitForm();
  };

  // Handle form submit for create or update
  const handleFormSubmit = async (userData: Partial<User> & { password?: string }) => {
    if (!token) return;

    // Prepare payload for API
    const payload: any = {};

    if (userData.firstName !== undefined) payload.firstName = userData.firstName;
    if (userData.lastName !== undefined) payload.lastName = userData.lastName;
    if (userData.email !== undefined) payload.email = userData.email;
    if (userData.leaveBalance !== undefined) payload.leave_balance = userData.leaveBalance;
    if (userData.department?.id !== undefined) payload.department_id = userData.department.id;
    if (userData.role?.id !== undefined) payload.role_id = userData.role.id;
    if (userData.password !== undefined && userData.password !== "") payload.password = userData.password;

    try {
      if (creating) {
        // Create new user
        await createUser(payload, token);
        setMessage({ type: "success", text: "User successfully created." });
      } else if (selectedUser && selectedUser.id) {
        // Update existing user
        await updateUser(selectedUser.id, payload, token);
        setMessage({ type: "success", text: "User details successfully updated." });
      }
      setEditing(false);
      setRightPanelOpen(false);
      setCreating(false);

      // Refresh users list
      const users = await fetchUsers(token);
      setUsers(users);
    } catch (error) {
      setMessage({ type: "error", text: creating ? "Failed to create user." : "Failed to update user details." });
    }
  };

  // Open right panel for creating a new user
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
      {/* Show message dialog if needed */}
      {message && (
        <MessageDialog
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}
      <div className="flex w-full min-h-screen">
        <div className="sticky top-0 h-screen">
          {/* Sidebar with user profile info */}
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
        </div>
        <div className="flex-1 p-6">
          <div className={styles.listWrapper}>
                <div className="mb-0">
                    {/* Page title and description */}
                    <label className="page-title">User index</label>
                    <hr className="border-gray-300 my-1" />
                    <p className="text-gray-700 mb-10 mt-3">
                        Welcome to the User index page. Below is the list of users in your organisation.
                    </p>
                </div>
                {/* Show create button for admins, hidden for others */}
                {isAdmin ? (
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
                {/* List header */}
                <div className={styles.listHeader}>
                    <div className={`${styles.listColumn} ${styles.avatar}`}></div>
                    <div className={`${styles.listColumn} ${styles.name} pl-3`}>Name</div>
                    <div className={`${styles.listColumn} ${styles.email}`}>Email</div>
                    <div className={`${styles.listColumn} ${styles.button}`}></div>
                    <div className={`${styles.listColumn} ${styles.button}`}> </div>
                </div>
                  {/* List of users */}
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
            {/* Right panel for create/edit/view user */}
            <RightPanel
              open={rightPanelOpen}
              onClose={() => setRightPanelOpen(false)}
              title={creating ? "Create New User" : "User Details"}
              editing={editing}
              editTitle="Edit User"
              deleteTitle="Delete User"
              saveTitle="Save User"
              cancelTitle="Cancel Changes"
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
              {/* Show form if editing, otherwise show details */}
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
    
          {/* Delete dialog for user */}
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
