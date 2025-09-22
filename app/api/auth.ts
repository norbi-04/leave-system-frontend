export interface LoginResponse {
    accessToken: string;
}

export async function loginApi(email: string, password: string): Promise<{ accessToken: string }> {
    const res = await fetch("http://localhost:8900/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        const text = await res.text();
        console.error("Login failed:", res.status, text);
        throw new Error("Login failed");
    }

    const token = await res.text();
    return { accessToken: token };
}