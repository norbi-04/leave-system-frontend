// GET ALL USERS (NAME AND EMAIL)

import { useLoaderData, useNavigate } from "react-router";
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
    const navigate = useNavigate();
    return (
        <>
            <div>
                <h1>Users Index</h1>
                <div>
                    <button type="button" onClick={() => navigate('/users/new')}>Create new user</button>
                </div>
                <p>Welcome to the Lists Index page!</p>
                <ul>
                    {data.map((user) => (
                        <li key={user.id} style={{ marginBottom: "20px" }}>
                            <b>Name: </b> 
                            {user.firstName} &nbsp; 
                            {user.lastName} &nbsp;
                            <br />

                            <b>Email: </b>
                            {user.email} &nbsp;
                            <br />

                            <a href={`/users/${user.id}`}>View Details</a> &nbsp; &nbsp;
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}