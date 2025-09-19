export const createReportingLine = async (
    token: string,
    userId: number,
    managerId: number,
    startDate?: string,
    endDate?: string
) => {
    const body: any = {
        user_id: userId,
        manager_id: managerId,
        startDate: startDate ?? new Date().toISOString().split('T')[0]
    };
    if (endDate) body.endDate = endDate;

    const res = await fetch(`http://localhost:8900/api/reporting-lines/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
    });
    if (!res.ok) {
        throw new Error("Failed to create reporting line");
    }
    return await res.json();
};

export const fetchReportingLines = async (token: string) => {
    const res = await fetch(`http://localhost:8900/api/reporting-lines/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
    if (!res.ok) {
        throw new Error("Failed to fetch reporting lines");
    }
    const { data: reportingLines } = await res.json(); // <-- fix: extract data property
    return reportingLines; // <-- return the array
};

export const deleteReportingLine = async (token: string, id: number) => {
    const res = await fetch(`http://localhost:8900/api/reporting-lines/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
    if (!res.ok) {
        throw new Error("Failed to delete reporting line");
    }
    return await res.json();
};

export const updateReportingLine = async (token: string, id: number, userId: number, managerId: number, startDate: string, endDate: string | null) => {
    const res = await fetch(`http://localhost:8900/api/reporting-lines/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            id,
            user_id: userId,
            manager_id: managerId,
            startDate,
            endDate
        })
    });
    if (!res.ok) {
        throw new Error("Failed to update reporting line");
    }
    return await res.json();
};
