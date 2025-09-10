interface SubMenuItem {
    title: string;
    link?: string;
}

interface MenuItem {
    title: string;
    key?: string;
    link?: string;
    subMenu?: SubMenuItem[];
}

export const MENU_LIST: MenuItem[] = [
    {
      title: "Leave",
      key: "leave",
      subMenu: [
        { title: "My Leave" },
        { title: "Review Requests"},
      ],
    },
    { title: "Users", link: "/users" },
    { title: "Departments"},
    { title: "Roles" },
  ];

  const profile = {
    name: "John Doe",
    email: "john@example.com",
  };