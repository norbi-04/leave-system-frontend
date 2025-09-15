import { useState } from "react";
import { useNavigate } from "react-router";
import styles from "../styles/Sidebar.module.css";
import { MENU_LIST } from "../config/sidebarMenuConfig";


interface SidebarProps {
    menus: typeof MENU_LIST;
    title?: string;
    profile?: Profile;
}

interface Profile {
    name: string;
    email: string;
}

export default function Sidebar({ menus, title = "Leave System", profile }: SidebarProps) {
  const navigate = useNavigate();
  const [subMenus, setSubMenus] = useState<Record<string, boolean>>({});

  const toggleSubMenu = (key?: string) => {
    if (!key) return;
    setSubMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="sticky top-0 h-screen">
      <div className={styles.sidebar}>
        <h1 className={styles.sidebarTitle}>{title}</h1>

        <ul className={styles.menuList}>
          {menus.map((menu, index) => (
            <li key={index} className={styles.menuItem}>
              <div
                className={styles.menuHeader}
                onClick={() => {
                  if (menu.subMenu) {
                    toggleSubMenu(menu.key);
                  } else if (menu.link) {
                    navigate(menu.link);
                  }
                }}
              >
                <span>{menu.title}</span>
                {menu.subMenu && (
                  <span className={styles.chevron}>
                    {subMenus[menu.key || ""] ? "▼" : "►"}
                  </span>
                )}
              </div>

              {/* Render submenus */}
              {menu.subMenu && subMenus[menu.key || ""] && (
                <ul className={styles.subMenuList}>
                  {menu.subMenu.map((sub, subIndex) => (
                    <li
                      key={subIndex}
                      className={styles.subMenuItem}
                      onClick={() => sub.link && navigate(sub.link)}
                    >
                      {sub.title}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* Bottom part: profile + logout */}
        {profile && (
            <div className={styles.profileContainer}>
            <div className={styles.profileSection}>
                <div className={styles.profileAvatar}>
                {profile.name.charAt(0).toUpperCase()}
                </div>
                <div className={styles.profileInfo}>
                <span className={styles.profileName}>{profile.name}</span>
                <span className={styles.profileEmail}>{profile.email}</span>
                </div>
            </div>
            <button className="btn-logout">Logout</button>
            </div>
        )}
        </div>
    </div>
  );
}