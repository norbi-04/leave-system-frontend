import { useLoaderData, useNavigate } from "react-router";
import { useState } from "react";
import type { User } from "../types/User";
import { AUTH_TOKEN } from "./auth";
import type { Role } from "../types/Role";
import type { Department } from "../types/Department";
import UserList from "../../components/UserList";
import DetailsPanel from "~/components/DetailsPanel";
import MainLayout from "../../layouts/MainLayout";
import UserEditForm from "~/components/UserEditForm";
import UserViewDetails from "~/components/UserViewDetails";

const fetchUsers = async () => {
  const response = await fetch("http://localhost:8900/api/users/", {
    headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
  });
  if (!response.ok) throw new Error("Failed to fetch users");
  const { data: users } = await response.json();
  return users;
};

export default function UserIndex() {
  const data = useLoaderData() as User[];
  const navigate = useNavigate();

  // Use local state for users
  const [users, setUsers] = useState<User[]>(data);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const fetchUserDetails = async (id: number, edit = false) => {
    try {
      const response = await fetch(`http://localhost:8900/api/users/${id}`, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      });
      if (!response.ok) throw new Error("Failed to fetch user details");

      const { data } = await response.json();
      setSelectedUser(data);
      setIsEditing(edit);

      if (edit) {
        // Fetch roles and departments only when entering edit mode
        const [rolesRes, departmentsRes] = await Promise.all([
          fetch("http://localhost:8900/api/roles", {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
          }),
          fetch("http://localhost:8900/api/departments", {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
          }),
        ]);
        if (rolesRes.ok) {
          const { data: rolesData } = await rolesRes.json();
          setRoles(rolesData);
        }
        if (departmentsRes.ok) {
          const { data: departmentsData } = await departmentsRes.json();
          setDepartments(departmentsData);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`http://localhost:8900/api/users/${selectedUser.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
        });
        if (!response.ok) throw new Error("Failed to delete user");
        // Optionally, you can refetch the users or remove the deleted user from the state
      } catch (error) {
        console.error(error);
      }
    }
  };

  const closePanel = () => {
    setSelectedUser(null);
    setIsEditing(false);
  };

  const handleEditSuccess = async (userId: number) => {
    const updatedUsers = await fetchUsers();
    setUsers(updatedUsers);

    if (userId) {
      const response = await fetch(`http://localhost:8900/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      });
      if (response.ok) {
        const { data } = await response.json();
        setSelectedUser(data);
      }
    }
    setIsEditing(false);
  };

  const content = (
    <div>
      <div className="w-full">
        <h1 className="h1">Users Index</h1>
        <hr className="border-gray-300 my-1" />
        <p className="text-gray-700 mb-10 mt-3">
          Welcome to the User index page. Below is the list of users in your organisation.
        </p>

        <div className="flex justify-end mb-1">
          <button
            type="button"
            onClick={() => navigate("/users/new")}
            className="btn-new"
          >
            Create new user
          </button>
        </div>
      </div>

      <div className="grid gap-3">
        <div className="tableHeader">
          <span></span>
          <span className="py-2">Name</span>
          <span>Email</span>
        </div>

        {users.map((user) => (
          <UserList
            key={user.id}
            user={user}
            onViewDetails={(id) => fetchUserDetails(id, false)}
            onEditUser={(id) => fetchUserDetails(id, true)}
          />
        ))}
      </div>
    </div>
  );

  const details = selectedUser ? (
    <DetailsPanel title={isEditing ? "Edit User" : "User Details"}>
      {/* Close button always at the top right */}
      <div className="relative mb-4">
        <button
          onClick={closePanel}
          className="absolute top-0 right-0 text-xl cursor-pointer py-1 px-5 rounded-full"
        >
          X
        </button>
      </div>

      {/* Edit mode: show the form */}
      {isEditing ? (
        <UserEditForm
          user={selectedUser}
          departments={departments}
          roles={roles}
          onCancel={() => setIsEditing(false)}
          onSuccess={handleEditSuccess} // <-- now expects userId
        />
      ) : (
        <>
          {/* View mode: show details and action buttons */}
          <UserViewDetails user={selectedUser} />
          <div className="flex flex-col gap-2 w-full h-1/8 mt-6">
            <button
              className="btn-logout h-full w-full"
              onClick={() => fetchUserDetails(selectedUser.id, true)}
            >
              Edit User
            </button>
            <button
              className="text-base btn-delete h-full w-full"
              onClick={handleDelete}
            >
              Delete User
            </button>
          </div>
        </>
      )}
    </DetailsPanel>
  ) : undefined;

  return <MainLayout content={content} details={details} />;
}
