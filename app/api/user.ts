

export const fetchUsers = async (token: string) => {
    const res = await fetch("http://localhost:8900/api/users/", {
    headers: { Authorization: `Bearer ${token}` },
  });
    if (!res.ok) {
        throw new Error("Failed to fetch users");
    }
    const { data: users } = await res.json();
    return users;
}