// CREATE NEW USER

// UPDATE USER DETAILS

import { useActionData, useLoaderData, useNavigate, Form } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";

import type { User } from "../types/User";
import type { Role } from "../types/Role";
import type { Department } from "../types/Department";

import { AUTH_TOKEN } from "./auth";


export async function loader() {

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

    return {roles, departments };
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const passwordRequiredChars = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{12,}$/;

    // Validate required fields
    if (!formData.get("email")) {
        return { error: "Email is required." };
    }
    if (!formData.get("firstName")) {
        return { error: "First name is required." };
    }
    if (!formData.get("lastName")) {
        return { error: "Last name is required." };
    }
    if (!formData.get("roleId")) {
        return { error: "Role is required." };
    }
    if (!formData.get("departmentId")) {
        return { error: "Department is required." };
    }
    if (!formData.get("password")) {
        return { error: "Password is required." };
    }
    if (!passwordRequiredChars.test(formData.get("password") as string)) {
        return { error: "Password must be at least 12 characters, include one uppercase letter, and one special character." };
    }

    const newUser = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        leave_balance: Number(formData.get("leaveBalance")) || 25,
        role_id: Number(formData.get("roleId")),
        department_id: Number(formData.get("departmentId")),
        password: formData.get("password"),
    };

    const response = await fetch("http://localhost:8900/api/users/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify(newUser),
    });

    if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || "Failed to create user" };
    }

    return redirect(`/users`);
}

export default function NewUser() {
    const { roles, departments } = useLoaderData() as {
        roles: Role[];
        departments: Department[];
    };
    const navigate = useNavigate();
    const actionData = useActionData<{ error?: string }>();

    return (
        <div>
            <h1>Create New User</h1>
            <Form method="post">
                <label>
                    First Name:
                    <input type="text" name="firstName" required />
                </label>
                <br />
                <label>
                    Last Name:
                    <input type="text" name="lastName" required />
                </label>
                <br />
                <label>
                    Email:
                    <input type="email" name="email" required />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" name="password" required minLength={12} />
                </label>
                <br />
                <label>
                    Leave Balance:
                    <input type="number" name="leaveBalance" defaultValue={25} />
                </label>
                <br />
                <label>
                    Role:
                </label>
                <select name="roleId" required>
                    <option value="">Select role</option>
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
                <select name="departmentId" required>
                    <option value="">Select department</option>
                    {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>
                            {dept.name}
                        </option>
                    ))}
                </select>
                <br />
                <button type="submit">Create User</button>
                <button type="button" onClick={() => navigate(`/users`)}>Cancel</button>
                {actionData?.error && <p style={{ color: 'red' }}>{actionData.error}</p>}
            </Form>
        </div>
    );
}