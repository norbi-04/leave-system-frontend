import { useAuth } from "../context/AuthContext";
import { Sidebar } from "../components/Sidebar";
import ProtectedRoute from "~/components/ProtectedPage";

export default function Home() {
  const { user } = useAuth();
    const isStaff = user?.token.role.name === "staff";

  return (
    <ProtectedRoute>
      <div className="flex h-screen w-full">
        <Sidebar
          profile={
            user
              ? {
                  firstName: user.token.firstName ?? "",
                  lastName: user.token.lastName ?? "",
                  email: user.token.email,
                  role: { id: user.token.role.id }
                }
              : undefined
          }
        />
        <div className="flex-1 p-6">
          <div className="page-wrapper">
            <label className="page-title">Home Page</label>
            <hr className="border-gray-300 my-1" />
            <p className="text-gray-700 mb-10 mt-3">
              Welcome to the Leave System! Use the sidebar to navigate between the main features:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-3">
              <li>
                <strong>My Leave:</strong> View your leave balance, request new leave, and see the status of your leave requests.
              </li>
            {!isStaff && (
              <li>
                <strong>Manage Staff Leave Requests:</strong> (Managers/Admins) Review, approve, or reject leave requests submitted by staff.
              </li>
            )}
              <li>
                <strong>Users:</strong> (Admins) View, create, edit, or delete user accounts in your organisation. (Others) View the list of users.

              </li>
              <li>
                <strong>Reporting Lines:</strong> (Admins) Set up and manage reporting relationships between staff and their managers. (Others) View the list of reporting lines.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
