


export const fetchRoles = async (token: string) => {
    const res = await fetch("http://localhost:8900/api/roles/", {
    headers: { Authorization: `Bearer ${token}` },
  });
    if (!res.ok) {
        throw new Error("Failed to fetch roles");
    }
    const { data: roles } = await res.json();
    return roles;
}