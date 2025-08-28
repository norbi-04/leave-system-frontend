import { useLoaderData } from "react-router";
import type { User } from "../types/User";
import { AUTH_TOKEN } from "./auth";



export async function loader(): Promise<User[]> {
    const response = await fetch("http://localhost:8900/api/users/", {
        headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
        },
    });
    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }
    const { data: users } = await response.json();
    // console.log("API response:", data);
    return users; 
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
                        {/* {user.department.name} &nbsp; */}
                        {user.email} &nbsp;
                        {/* {user.leaveBalance} &nbsp;
                        {user.role.name} */}
                        <a href={`/users/${user.id}`}>View Details</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}