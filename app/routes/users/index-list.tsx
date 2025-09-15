import { useLoaderData, useNavigate } from "react-router";
import type { User } from "../types/User";
import { AUTH_TOKEN } from "./auth";
import UserList from "../../components/UserList";
import DetailsPanel from "~/components/DetailsPanel";
import MainLayout from "../../layouts/MainLayout";
import { useState } from "react";

// GET ALL USERS (summary)
export async function loader(): Promise<User[]> {
  const response = await fetch("http://localhost:8900/api/users/", {
    headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
  });
  if (!response.ok) throw new Error("Failed to fetch users");
  const { data: users } = await response.json();
  return users;
}

export default function UserIndex() {
  const data = useLoaderData() as User[];
  const navigate = useNavigate();

  // state to store currently selected user details
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // fetch full permitted user details by ID
  const fetchUserDetails = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8900/api/users/${id}`, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      });
      if (!response.ok) throw new Error("Failed to fetch user details");

      const { data } = await response.json(); // API returns only permitted fields
      setSelectedUser(data); // <-- sets state and triggers DetailsPanel
    } catch (error) {
      console.error(error);
    }
  };

  const content = (
    <div className="w-full">
      <h1 className="h1">Users Index</h1>
      <hr className="border-gray-300 my-1" />
      <p className="text-gray-700 mb-10 mt-3">
        Welcome to the User index page. Below is the list of users in your organisation.
      </p>

      <div className="grid gap-3">
        {/* Table Header */}
        <div className="tableHeader">
          <span></span>
          <span>Name</span>
          <span>Email</span>
          <button
            type="button"
            onClick={() => navigate("/users/new")}
            className="btn-new"
          >
            Create new user
          </button>
        </div>

        {data.map((user) => (
          <UserList
            key={user.id}
            user={user}
            // pass only the ID, and call the async function that sets state
            onViewDetails={(id) => fetchUserDetails(id)}
          />
        ))}
      </div>
    </div>
  );

  // Details panel only shows when a user is selected
  const details = selectedUser ? (
    <DetailsPanel>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">User Details</h2>
        <button onClick={() => setSelectedUser(null)} className="btn-cancel">
          X
        </button>
      </div>
      <p>
        Name: {selectedUser.firstName} {selectedUser.lastName}
      </p>
      <p>Email: {selectedUser.email}</p>
      {selectedUser.department && <p>Department: {selectedUser.department.name}</p>}
      {selectedUser.leaveBalance !== undefined && <p>Leave Balance: {selectedUser.leaveBalance}</p>}
      {selectedUser.role && <p>Role: {selectedUser.role.name}</p>}
    </DetailsPanel>
  ) : undefined;

  return <MainLayout content={content} details={details} />;
}
