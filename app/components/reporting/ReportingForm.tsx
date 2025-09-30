import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import styles from '~/styles/PanelForm.module.css';
import type { UserSummary } from "~/types/UserType";

interface ReportingFormProps {
    users: UserSummary[]; // List of users to select from
    managers: UserSummary[]; // List of managers to select from
    onSubmit: (data: { user_id: number; manager_id: number; startDate: string; endDate?: string }) => void; // Callback when form is submitted
    initial?: { user_id?: number; manager_id?: number; startDate?: string; endDate?: string }; // Optional initial values
}

// Expose imperative methods for parent components
export interface ReportingFormHandle {
    resetForm: () => void;
    submitForm: () => void;
}

const ReportingForm = forwardRef<ReportingFormHandle, ReportingFormProps>(
    ({ users, managers, onSubmit, initial }, ref) => {
        // State to hold form data
        const [formData, setFormData] = useState({
            user_id: initial?.user_id ?? "",
            manager_id: initial?.manager_id ?? "",
            startDate: initial?.startDate ?? new Date().toISOString().split('T')[0],
            endDate: initial?.endDate ?? ""
        });

        // Update form data if initial values change
        useEffect(() => {
            setFormData({
                user_id: initial?.user_id ?? "",
                manager_id: initial?.manager_id ?? "",
                startDate: initial?.startDate ?? new Date().toISOString().split('T')[0],
                endDate: initial?.endDate ?? ""
            });
        }, [initial]);

        // Expose reset and submit methods to parent via ref
        useImperativeHandle(ref, () => ({
            resetForm() {
                setFormData({
                    user_id: initial?.user_id ?? "",
                    manager_id: initial?.manager_id ?? "",
                    startDate: initial?.startDate ?? new Date().toISOString().split('T')[0],
                    endDate: initial?.endDate ?? ""
                });
            },
            submitForm() {
                if (formData.user_id && formData.manager_id && formData.startDate) {
                    onSubmit({
                        user_id: Number(formData.user_id),
                        manager_id: Number(formData.manager_id),
                        startDate: formData.startDate,
                        endDate: formData.endDate || undefined
                    });
                }
            }
        }));

        return (
            <form className={styles.form}
                onSubmit={e => {
                    e.preventDefault();
                    // Only submit if required fields are filled
                    if (formData.user_id && formData.manager_id && formData.startDate) {
                        onSubmit({
                            user_id: Number(formData.user_id),
                            manager_id: Number(formData.manager_id),
                            startDate: formData.startDate,
                            endDate: formData.endDate || undefined
                        });
                    }
                }}
            >
                {/* User selection */}
                <label className={styles.label}>User</label>
                <select
                    required
                    className="mb-5 select"
                    value={formData.user_id}
                    onChange={e => setFormData(f => ({ ...f, user_id: e.target.value }))}
                >
                    <option value="">Select user</option>
                    {users.map(u => (
                        <option key={u.id} value={u.id}>
                            {u.firstName} {u.lastName} ({u.email})
                        </option>
                    ))}
                </select>

                {/* Manager selection */}
                <label className={styles.label}>Manager</label>
                <select
                    required
                    className="mb-5 select"
                    value={formData.manager_id}
                    onChange={e => setFormData(f => ({ ...f, manager_id: e.target.value }))}
                >
                    <option value="">Select manager</option>
                    {managers.map(m => (
                        <option key={m.id} value={m.id}>
                            {m.firstName} {m.lastName} ({m.email})
                        </option>
                    ))}
                </select>

                {/* Start date input */}
                <label className={styles.label}>Start Date</label>
                <input
                    required
                    className="mb-5 input"
                    type="date"
                    value={formData.startDate}
                    onChange={e => setFormData(f => ({ ...f, startDate: e.target.value }))}
                />

                {/* End date input (optional) */}
                <label className={styles.label}>End Date (optional)</label>
                <input
                    className="mb-5 input"
                    type="date"
                    value={formData.endDate}
                    onChange={e => setFormData(f => ({ ...f, endDate: e.target.value }))}
                />
            </form>
        );
    }
);

export default ReportingForm;