import type { User } from "~/routes/types/User";

interface UserViewDetailsProps {
  user: User;
}

export default function UserViewDetails({ user }: UserViewDetailsProps) {
  return (
    <div className="divide-y divide-gray-300 rounded-md">
      <div className="p-4">
        <label className="block text-sm font-medium text-gray-500">Name</label>
        <div className="mt-1 text-lg font-semibold text-gray-800">
          {user.firstName} {user.lastName}
        </div>
      </div>
      <div className="p-4">
        <label className="block text-sm font-medium text-gray-500">Email</label>
        <div className="mt-1 text-lg font-semibold text-gray-800">
          {user.email}
        </div>
      </div>
      {user.department && (
        <div className="p-4">
          <label className="block text-sm font-medium text-gray-500">Department</label>
          <div className="mt-1 text-lg font-semibold text-gray-800">
            {user.department.name}
          </div>
        </div>
      )}
      {user.role && (
        <div className="p-4">
          <label className="block text-sm font-medium text-gray-500">Role</label>
          <div className="mt-1 text-lg font-semibold text-gray-800">
            {user.role.name}
          </div>
        </div>
      )}
      {user.leaveBalance !== undefined && (
        <div className="p-4">
          <label className="block text-sm font-medium text-gray-500">Leave Balance</label>
          <div className="mt-1 text-lg font-semibold text-gray-800">
            {user.leaveBalance}
          </div>
        </div>
      )}
    </div>
  );
}