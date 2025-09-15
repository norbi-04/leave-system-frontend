import Sidebar from "~/components/Sidebar2";
import { MENU_LIST, PROFILE } from "~/config/sidebarMenuConfig";

interface LayoutProps {
  content: React.ReactNode;
  details?: React.ReactNode;
}

export default function MainLayout({ content, details }: LayoutProps) {
  return (
    <div
      className={
        details
          ? "grid grid-cols-[17%_1fr_24%] gap-8 w-full min-h-screen"
          : "grid grid-cols-[17%_80%] gap-8 w-full min-h-screen"
      }
    >
      {/* Sidebar */}
      <Sidebar menus={MENU_LIST} title="Leave Dashboard" profile={PROFILE} />

      {/* Main Content */}
      <main className="w-full p-6 px-5">
        {content}
      </main>

      {/* Details Section (optional) */}
      {details && (
        <div className="">
          <div className="bg-gray-100 rounded shadow h-full">
            {details}
          </div>
        </div>
      )}
    </div>
  );
}

