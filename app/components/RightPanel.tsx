import { useRef } from "react";
import type { ReactNode } from "react";
import styles from "~/styles/RightPanel.module.css";

// Props for the right-side panel component
interface RightPanelProps {
    open: boolean; // Whether the panel is open
    onClose: () => void; // Function to close the panel
    title: string; // Panel title
    children: ReactNode; // Panel content
    editing?: boolean; // Whether the panel is in editing mode
    editAction?: () => void; // Callback for edit button
    deleteAction?: () => void; // Callback for delete button
    saveAction?: () => void; // Callback for save button
    onCancel?: () => void; // Callback for cancel button
    editTitle?: string; // Text for edit button
    deleteTitle?: string; // Text for delete button
    saveTitle?: string; // Text for save button
    cancelTitle?: string; // Text for cancel button
    disableEdit?: boolean; // Disable edit button if true
}

export default function RightPanel({
    open,
    onClose,
    title,
    children,
    editing,
    editAction,
    deleteAction,
    saveAction,
    onCancel,
    editTitle,
    deleteTitle,
    saveTitle,
    cancelTitle,
    disableEdit
}: RightPanelProps) {
    const userFormRef = useRef<HTMLFormElement>(null);

    // Call submitForm on the form if present (not used in this code)
    const handleSave = () => {
        if (userFormRef.current) {
            userFormRef.current.submitForm();
        }
    };

    return (
        <>
            {/* Backdrop overlay */}
            {open && (
                <div className="right-panel-backdrop" onClick={onClose} />
            )}
            <div className={`${styles.panel} ${open ? styles.open : ''}`}>
                {/* Header with title and close button */}
                <div className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    <button className="btn-close" onClick={onClose}>✕</button>
                </div>

                {/* Panel body content */}
                <div className={styles.body}>
                    {children}
                </div>

                {/* Footer with action buttons */}
                <div className={styles.footer}>
                    {/* Show edit button if not editing and edit is enabled */}
                    {!disableEdit && !editing && (
                        <button className="min-h-11.5 btn-secondary" onClick={editAction}>{editTitle}</button>
                    )}
                    {/* Show delete button if not editing */}
                    {!editing && (
                        <button className="min-h-11.5 btn-delete" onClick={deleteAction}>{deleteTitle}</button>
                    )}
                    {/* Show save and cancel buttons if editing */}
                    {editing && (
                        <button className="min-h-11.5 btn-secondary" onClick={saveAction}>{saveTitle}</button>
                    )}
                    {editing && (
                        <button className="min-h-11.5 btn-cancel" onClick={onCancel}>{cancelTitle}</button>
                    )}
                </div>
            </div>
        </>
    )
}