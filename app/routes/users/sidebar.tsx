import { useState } from "react";
import { useNavigate } from "react-router";

export default function Sidebar() {
  const navigate = useNavigate();

  const Menus = [
    { title: "Leave", subMenu: ["My Leave", "Review Requests"], key: "inbox" },
    { title: "Users" },
    { title: "Departments" },
    { title: "Roles" },
    { title: "Logout" },
  ];

  const [subMenus, setSubMenus] = useState<Record<string, boolean>>({
    inbox: false,
  });

  const toggleSubMenu = (menu?: string) => {
    if (!menu) return;
    setSubMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <div className="w-full flex">
      {/* Sidebar */}
      <div className="w-72 p-5 bg-zinc-900 h-screen pt-8">
        <h1 className="text-zinc-50 font-semibold text-xl mb-6">Admin Dashboard</h1>

        <ul className="space-y-2">
          {Menus.map((Menu, index) => (
            <li
              key={index}
              className="flex flex-col rounded-md py-3 px-4 cursor-pointer hover:text-white text-zinc-50 hover:bg-zinc-800/50 transition-all"
            >
              <div
                className="flex items-center justify-between"
                onClick={() => toggleSubMenu(Menu.key)}
              >
                <span>{Menu.title}</span>
                {Menu.subMenu && (
                  <span className="text-xs">
                    {subMenus[Menu.key || ""] ? "▼" : "►"}
                  </span>
                )}
              </div>

              {Menu.subMenu && subMenus[Menu.key || ""] && (
                <ul className="pl-4 pt-2 text-zinc-300">
                  {Menu.subMenu.map((subMenu, subIndex) => (
                    <li
                      key={subIndex}
                      className="text-sm py-2 px-2 hover:bg-zinc-800 rounded-lg"
                      onClick={() =>
                        navigate(`/${subMenu.toLowerCase().replace(/\s+/g, "-")}`)
                      }
                    >
                      {subMenu}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Content area */}
      <div className="h-screen flex-1 bg-zinc-100 p-12">
        <h1 className="text-xl text-zinc-800 font-medium">This is the Dashboard page.</h1>
      </div>
    </div>
  );
}
