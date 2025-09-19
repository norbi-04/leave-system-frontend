import { useAuth } from "../context/AuthContext";
import { Sidebar } from "../components/Sidebar";
import ProtectedRoute from "~/components/ProtectedPage";

export default function Home() {
  const { user } = useAuth();

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
            <div className="page-wrapper">
            <label className="page-title">Home Page</label>
            <hr className="border-gray-300 my-1" />
            <p className="text-gray-700 mb-10 mt-3">
                Welcome to the Home page.
            </p>
            </div>
        </div>
  </div>
  </ProtectedRoute>
  );
}
