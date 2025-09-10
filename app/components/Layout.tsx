import Sidebar from "./Sidebar";
import { MENU_LIST } from "~/config/sidebarMenuConfig";

export default function Layout({ children }: { children: React.ReactNode }) {
    const profile = {
        name: "John Doe",
        email: "john@example.com"
    };

    return (
    <div className="flex min-h-screen">
      <aside className="w-72 h-screen ">
        <Sidebar menus={MENU_LIST} title="Leave System Dashboard" profile={profile} />
      </aside>

      <main className="flex-1 flex flex-col p-6 h-full ">
        <div className="flex-1 w-full">
            {children}
        </div>
      </main>
    </div>
  );
}