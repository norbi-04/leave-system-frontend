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
                <h1 className="text-3xl font-bold">Users Index</h1> &nbsp; &nbsp;
                <div>
                    <button 
                        type="button" 
                        onClick={() => navigate('/users/new')}
                        className="px-4 py-2 bg-white text-blue-600 rounded shadow hover:bg-blue-700 hover:text-white border-1 border-blue-600 cursor-pointer font-medium"
                        >Create new user</button>
                </div> &nbsp; &nbsp;
                <p className="text-lg text-gray-700">
                    Welcome to the User Index page. Below is the list of users in your organisation.
                </p>
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

                            <a href={`/users/${user.id}`}
                            className="text-blue-600 hover:underline font-medium"
                            
                            >View Details</a> &nbsp; &nbsp;
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}