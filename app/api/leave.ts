export const createLeaveRequest = async (startDate: Date, endDate: Date, token: string, userId?: string, managerId?: number) => {
    const body: any = {
        startDate: startDate,
        endDate: endDate,
        user_id: userId,
        manager_id: managerId
    };
    const res = await fetch(`http://localhost:8900/api/leave-requests/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
    });
    if (!res.ok) {
        throw new Error("Failed to create leave request");
    }
    return await res.json();
};


export const fetchLeaveRequests = async (token: string) => {
    const res = await fetch(`http://localhost:8900/api/leave-requests/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
    if (!res.ok) {
        throw new Error("Failed to fetch leave balance");
    }
    const json = await res.json();
    return json.data; // <-- Return only the data property!
};


export const approveLeaveRequest = async (id: number, token: string) => {
    const res = await fetch(`http://localhost:8900/api/leave-requests/approve/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    if (!res.ok) {
        throw new Error("Failed to update leave request status");
    }
    return await res.json();
};


export const rejectLeaveRequest = async (id: number, token: string, reason: string) => {
    const body = { reason };
    const res = await fetch(`http://localhost:8900/api/leave-requests/reject/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
    });
    if (!res.ok) {
        throw new Error("Failed to update leave request status");
    }
    return await res.json();
};
