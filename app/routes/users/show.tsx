import { useLoaderData, Form, redirect, useActionData } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
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
    return users; 
}

export async function action({ request, params }: ActionFunctionArgs) {
    const { id } = params;
    const formData = await request.formData();
    const intent = formData.get("intent");

    if (intent === "delete") {
        if (!id) {
            throw new Response("User ID is required", { status: 400 });
        }
        const response = await fetch(`http://localhost:8900/api/users/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${AUTH_TOKEN}`,
            },
        });
        if (!response.ok) {
            return { error: "Failed to delete user" };
        }
        return redirect("/users"); 
    }
}

export default function UserShow() {
    const user = useLoaderData() as User;
    const actionData= useActionData<typeof action>();
    return (
        <>
            <div>
                <ul>
                    <li>
                        <a href="/users">Back to Users</a>
                    </li>
                    <li>
                        <a href={`/users/${user.id}/edit`}>Edit User Details</a>
                    </li>
                </ul>

                <Form method="post">
                    <input
                            type="hidden"
                            name ="intent"
                            value = "delete"
                        />

                    {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
                    <p>
                        <input
                            type="submit"
                            value = "Delete User"
                            onClick={(e => {
                                if (!confirm("Are you sure you want to delete this user?")) 
                                    e.preventDefault();
                            })}
                        />
                    </p>
                </Form>
            </div>
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
        </>
    );
}