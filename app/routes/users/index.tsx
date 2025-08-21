import { useLoaderData } from "react-router";
import type { User } from "../types/User";

const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6eyJlbWFpbCI6ImFkbWluQGVtYWlsLmNvbSIsInJvbGUiOnsiaWQiOjEsIm5hbWUiOiJhZG1pbiJ9LCJpZCI6MX0sImlhdCI6MTc1NTc5NTM1NiwiZXhwIjoxNzU1Nzk4OTU2fQ.MDeJlCKEUQDPvvhiy7CAzAhfUiPWJuA_YyHWl4i5e8Y"; 

export async function loader(): Promise<User[]> {
    const response = await fetch("http://localhost:8900/api/users/", {
        headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
        },
    });
    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }
    const data = await response.json();
    // console.log("API response:", data);
    return data.data; 
}

export default function UserIndex() {
    const data = useLoaderData() as User[];
    return (
        <div>
            <h1>Users Index</h1>
            <p>Welcome to the Lists Index page!</p>
            <ul>
                {data.map((user) => (
                    <li key={user.id}>
                        {user.firstName} &nbsp;
                        {user.lastName} &nbsp;
                        {user.department.name} &nbsp;
                        {user.email} &nbsp;
                        {user.leaveBalance} &nbsp;
                        {user.role.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}