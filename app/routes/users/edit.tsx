// UPDATE USER DETAILS

import { useLoaderData } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";

import type { User } from "../types/User";
import type { Role } from "../types/Role";
import type { Department } from "../types/Department";

import { AUTH_TOKEN } from "./auth";


export async function loader({ params }: LoaderFunctionArgs) {
    const { id } = params;
    if (!id) {
        throw new Response("User ID is required", { status: 400 });
    }
    
    // Get user details
    const userRes = await fetch(`http://localhost:8900/api/users/${id}`, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
    });
    if (!userRes.ok) {
        throw new Response("Failed to fetch user", { status: userRes.status });
    }
    const { data: user } = await userRes.json();

    // Get roles
    const rolesRes = await fetch("http://localhost:8900/api/roles", {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
    });
    if (!rolesRes.ok) {
        throw new Response("Failed to fetch roles", { status: rolesRes.status });
    }
    const { data: roles } = await rolesRes.json();

    // Get departments
    const departmentsRes = await fetch("http://localhost:8900/api/departments", {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
    });
    if (!departmentsRes.ok) {
        throw new Response("Failed to fetch departments", { status: departmentsRes.status });
    }
    const { data: departments } = await departmentsRes.json();

    return { user, roles, departments };
}

export async function action ({ request, params }: ActionFunctionArgs) {
    const { id } = params;
    const formData = await request.formData();
    

    const updatedUser = {
        id: Number(id),
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        leaveBalance: Number(formData.get("leaveBalance")),
        role_id: Number(formData.get("roleId")),
        department_id: Number(formData.get("departmentId")),
    };

    console.log("Updating with department_id:", updatedUser.department_id);

    const response = await fetch(`http://localhost:8900/api/users/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify(updatedUser),
    });

    if (!response.ok) {
        throw new Error("Failed to update user");
    }

    return redirect(`/users/${id}`);
}

export default function EditUser() {
    const { user, roles, departments } = useLoaderData() as {
        user: User;
        roles: Role[];
        departments: Department[];
    };

    return (
        <div>
            <h1>Edit User</h1>
            <form method="post">
                <label>
                    First Name:
                    <input type="text" name="firstName" defaultValue={user.firstName} />
                </label>
                <br />
                <label>
                    Last Name:
                    <input type="text" name="lastName" defaultValue={user.lastName} />
                </label>
                <br />
                <label>
                    Email:
                    <input type="email" name="email" defaultValue={user.email} />
                </label>
                <br />
                <label>
                    Leave Balance:
                    <input type="number" name="leaveBalance" defaultValue={user.leaveBalance} />
                </label>
                <br />
                <label>
                    Role:
                </label>
                <select name="roleId" defaultValue={user.role?.id}>
                    {roles.map(role => (
                        <option key={role.id} value={role.id}>
                            {role.name}
                        </option>
                    ))}
                </select>
                <br />
                <label>
                    Department:
                </label>
                <select name="departmentId" defaultValue={user.department?.id}>
                    {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>
                            {dept.name}
                        </option>
                    ))}
                </select>
                <br />
                <button type="submit">Update User</button>
            </form>
        </div>
    );
}
