// GET USERS BY ID (NAME, EMAIL, DEPARTMENT, LEAVE BALANCE, ROLE)

import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import type { User } from "../types/User";
import { AUTH_TOKEN } from "./auth";

export async function loader({ params }: LoaderFunctionArgs): Promise<User> {
    const { id } = params;
    if (!id) {
        throw new Response("User ID is required", { status: 400 });
    }
    const response = await fetch(`http://localhost:8900/api/users/${id}`, {
        headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
        },
    });
    if (!response.ok) {
        throw new Response("Failed to fetch user", { status: response.status });
    }
    const { data: users } = await response.json();
    // console.log("API response:", data);
    return users; 
}

export default function UserShow() {
    const user = useLoaderData() as User;
    return (
        <div>
            <h1>User Detail</h1>
            <p>
                <b>Name:</b> {user.firstName} {user.lastName}
            </p>
            <p>
                <b>Department:</b> {user.department?.name ?? "No department"}
            </p>
            <p>
                <b>Email:</b> {user.email}
            </p>
            <p>
                <b>Leave Balance:</b> {user.leaveBalance}
            </p>
            <p>
                <b>Role:</b> {user.role?.name ?? "No role"}
            </p>
        </div>
    );
}