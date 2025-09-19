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

export const fetchUserById = async (id: number, token: string) => {
    const res = await fetch(`http://localhost:8900/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch user");
    }
    const { data: user } = await res.json();
    return user;
}

export const updateUser = async (id: number, userData: any, token: string) => {
    const res = await fetch("http://localhost:8900/api/users/", {
        method: "PATCH",
        headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"},
        body: JSON.stringify({ id, ...userData }), 
    });

    if (!res.ok) {
        throw new Error("Failed to update user");
    }
    const { data: user } = await res.json();
    return user;
}

export const createUser = async (userData: any, token: string) => {
  const res = await fetch("http://localhost:8900/api/users/", {
    method: "POST",
    headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"},
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    throw new Error("Failed to create user");
  }
  const { data: user } = await res.json();
  return user;
};

export const deleteUser = async (id: number, token: string) => {
    const res = await fetch(`http://localhost:8900/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
        throw new Error("Failed to delete user");
    }
    return true;
}