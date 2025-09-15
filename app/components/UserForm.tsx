import { Form, useNavigate } from "react-router";
import styles from "../styles/Form.module.css";

interface UserFormProps {
    user?: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        leaveBalance: number;
        role?: { id: number; name: string };
        department?: { id: number; name: string };
    },
    roles: { id: number; name: string }[],
    departments: { id: number; name: string }[],
    actionData?: { error?: string },
    actionText: string,
};
    
    
export default function UserForm(
    { user, roles, departments, actionData, actionText

    }: UserFormProps ) {
    const navigate = useNavigate();
    
    return (
         <div className={styles.formContainer}>
            <h1>Edit User</h1>
            <Form method="post">
                <label>
                    First Name:
                    <input type="text" name="firstName" defaultValue={user?.firstName} className={styles.field}
                           />
                </label>
                <br />
                <label>
                    Last Name:
                    <input type="text" name="lastName" defaultValue={user?.lastName} className={styles.field}/>
                </label>
                <br />
                <label>
                    Email:
                    <input type="email" name="email" defaultValue={user?.email} className={styles.field}/>
    
                </label>
                <br />
                <label>
                    Leave Balance:
                    <input type="number" name="leaveBalance" defaultValue={user?.leaveBalance} className={styles.field}/>
                </label>
                <br />
                <label>
                    Role:
                </label>
                <select name="roleId" defaultValue={user?.role?.id} className={styles.field}>
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
                <select name="departmentId" defaultValue={user?.department?.id} className={styles.field}>
                    {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>
                            {dept.name}
                        </option>
                    ))}
                </select>
                <br />
                <button type="submit" className="btn-primary">{actionText}</button>
                <button type="button" className="btn-cancel" onClick={() => navigate(`/users`)}>Cancel</button>
                
                { actionData?.error && <p style={{ color: 'red' }}>{actionData.error}</p> }

            </Form>
        </div>
    );
}