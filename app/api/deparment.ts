


export const fetchDepartments = async (token: string) => {
    const res = await fetch("http://localhost:8900/api/departments/", {
    headers: { Authorization: `Bearer ${token}` },
  });
    if (!res.ok) {
        throw new Error("Failed to fetch departments");
    }
    const { data: departments } = await res.json();
    return departments;
}

