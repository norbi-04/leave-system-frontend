import { useState } from "react";
import { AUTH_TOKEN } from "~/routes/users/auth";
import type { User } from "~/routes/types/User";
import type { Department } from "~/routes/types/Department";
import type { Role } from "~/routes/types/Role";

interface UserEditFormProps {
  user: User;
  departments: Department[];
  roles: Role[];
  onCancel: () => void;
  error?: string;
  onSuccess?: (userId: number) => void; // <-- expects userId
}

export default function UserEditForm({
  user,
  departments,
  roles,
  onCancel,
  onSuccess,
}: UserEditFormProps) {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const body: any = {
      id: user.id,
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      leave_balance: Number(formData.get("leaveBalance")),
      department_id: Number(formData.get("departmentId")),
      role_id: Number(formData.get("roleId")),
    };

    try {
      const response = await fetch("http://localhost:8900/api/users/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const data = await response.json();
        let errorMsg = "Failed to update user.";
        if (typeof data.error === "string") {
          errorMsg = data.error;
        } else if (data.error && typeof data.error.message === "string") {
          errorMsg = data.error.message;
        } else if (data.message) {
          errorMsg = data.message;
        }
        setError(errorMsg);
      } else {
        if (onSuccess) {
          onSuccess(user.id); // <-- pass user.id
        } else {
          window.location.reload();
        }
      }
    } catch (err) {
      setError("Network error.");
    }
  }

  return (
    <form onSubmit={handleSubmit} id="edit-user-form">
      <label className="block text-sm font-medium text-gray-500 mt-4">
        First Name
        <input
          type="text"
          name="firstName"
          defaultValue={user.firstName}
          className="editFormField"
        />
      </label>
      <label className="block text-sm font-medium text-gray-500 mt-4">
        Last Name
        <input
          type="text"
          name="lastName"
          defaultValue={user.lastName}
          className="editFormField"
        />
      </label>
      <label className="block text-sm font-medium text-gray-500 mt-4">
        Email
        <input
          type="email"
          name="email"
          defaultValue={user.email}
          className="editFormField"
        />
      </label>
      <label className="block text-sm font-medium text-gray-500 mt-4">
        Department
        <select
          name="departmentId"
          defaultValue={user.department?.id ?? ""}
          className="editFormField"
        >
          <option value="">Select department</option>
          {departments.map(dept => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-medium text-gray-500 mt-4">
        Role
        <select
          name="roleId"
          defaultValue={user.role?.id ?? ""}
          className="editFormField"
        >
          <option value="">Select role</option>
          {roles.map(role => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-medium text-gray-500 mt-4">
        Leave Balance:
        <input
          type="number"
          name="leaveBalance"
          defaultValue={user.leaveBalance}
          className="editFormField"
        />
      </label>
      <div className="flex flex-col gap-1 w-full h-1/8 mt-6">
        <button type="submit" className="btn-logout h-full w-full">
          Save Changes
        </button>
        <button
          type="button"
          className="text-base btn-cancel h-full w-full"
          onClick={onCancel}
        >
          Cancel
        </button>
        {error && <p className="text-red-600 text-center mt-2">{error}</p>}
      </div>
    </form>
  );
}