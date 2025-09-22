import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import type { User } from "~/types/UserType";
import type { Role } from "~/types/RoleType";
import type { Department } from "~/types/DepartmentType";
import styles from '~/styles/PanelForm.module.css';

interface UserFormProps {
    user: User;
    roles: Role[];
    departments: Department[];
    onSubmit: (data: Partial<User> & { password?: string }) => void;
}

export interface UserFormHandle {
    resetForm: () => void;
    submitForm: () => void;
}

type UserFormData = Partial<User> & { password?: string };

const UserForm = forwardRef<UserFormHandle, UserFormProps>(
    ({ user, roles, departments, onSubmit }, ref) => {
        const [formData, setFormData] = useState<UserFormData>(user);

        useEffect(() => {
            setFormData(user);
        }, [user]);

        useImperativeHandle(ref, () => ({
            resetForm() {
                setFormData(user);
            },
            submitForm() {
                onSubmit(formData);
            }
        }));

        return (
            <form className={styles.form}
                onSubmit={e => {
                    e.preventDefault();
                    onSubmit(formData);
                }}
            >
                <label className={styles.label}>First Name</label>
                <input
                    className="mb-5 input"
                    type="text"
                    value={formData.firstName || ""}
                    onChange={e =>
                        setFormData(prevFormData => ({
                            ...prevFormData,
                            firstName: e.target.value
                        }))
                    }
                />

                <label className={styles.label}>Last Name</label>
                <input
                    className="mb-5 input"
                    type="text"
                    value={formData.lastName || ""}
                    onChange={e =>
                        setFormData(prevFormData => ({
                            ...prevFormData,
                            lastName: e.target.value
                        }))
                    }
                />

                <label className={styles.label}>Email</label>
                <input
                    required
                    className="mb-5 input"
                    type="email"
                    value={formData.email || ""}
                    onChange={e =>
                        setFormData(prevFormData => ({
                            ...prevFormData,
                            email: e.target.value
                        }))
                    }
                />

                <label className={styles.label}>Department</label>
                <select
                    required
                    className="mb-5 select"
                    value={formData.department?.id || ""}
                    onChange={e => {
                        const selectedDepartment = departments.find(
                            department => department.id === Number(e.target.value)
                        );
                        setFormData(prevFormData => ({
                            ...prevFormData,
                            department: selectedDepartment
                                ? { id: selectedDepartment.id, name: selectedDepartment.name }
                                : undefined
                        }));
                    }}
                >
                    <option value="">Select department</option>
                    {departments.map(department => (
                        <option key={department.id} value={department.id}>
                            {department.name}
                        </option>
                    ))}
                </select>

                <label className={styles.label}>Role</label>
                <select
                    required
                    className="mb-5 select"
                    value={formData.role?.id || ""}
                    onChange={e => {
                        const selectedRole = roles.find(
                            role => role.id === Number(e.target.value)
                        );
                        setFormData(prevFormData => ({
                            ...prevFormData,
                            role: selectedRole
                                ? { id: selectedRole.id, name: selectedRole.name }
                                : undefined
                        }));
                    }}
                >
                    <option value="">Select role</option>
                    {roles.map(role => (
                        <option key={role.id} value={role.id}>
                            {role.name}
                        </option>
                    ))}
                </select>

                <label className={styles.label}>Leave Balance</label>
                <input
                    required
                    min={0}
                    className="mb-5 input"
                    type="number"
                    value={formData.leaveBalance ?? ""}
                    onChange={e =>
                        setFormData(prevFormData => ({
                            ...prevFormData,
                            leaveBalance: Number(e.target.value) 
                        }))
                    }
                />

                <label className={styles.label}>New Password</label>
                <input
                    className="mb-5 input-password"
                    type="password"
                    placeholder="Enter new password"
                    value={formData.password || ""}
                    onChange={e =>
                        setFormData(prevFormData => ({
                            ...prevFormData,
                            password: e.target.value
                        }))
                    }
                />
            </form>
        );
    }
);

export default UserForm;