import { useRef } from "react";
import type { ReactNode } from "react";
import styles from "~/styles/RightPanel.module.css";

interface RightPanelProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    editing?: boolean;
    editAction?: () => void;
    deleteAction?: () => void;
    saveAction?: () => void;
    onCancel?: () => void;
}


export default function RightPanel({ open, onClose, title, children, editing, editAction, deleteAction, saveAction, onCancel }: RightPanelProps) {
    const userFormRef = useRef<HTMLFormElement>(null);

    const handleSave = () => {
        if (userFormRef.current) {
            userFormRef.current.submitForm();
        }
    };

    return (
        <>
            {open && (
                <div className="right-panel-backdrop" onClick={onClose} />
            )}
            <div className={`${styles.panel} ${open ? styles.open : ''}`}>

                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    <button className="btn-close" onClick={onClose}>✕</button>
                </div>

                {/* Body */}
                <div className={styles.body}>
                    {children}
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    {!editing && <button className="min-h-11.5 btn-secondary" onClick={editAction}>Edit</button>}
                    {!editing && <button className="min-h-11.5 btn-delete"  onClick={deleteAction}>Delete</button>}
                    {editing && <button className="min-h-11.5 btn-secondary" onClick={saveAction}>Save</button>}
                    {editing && <button className="min-h-11.5 btn-cancel" onClick={onCancel}>Cancel</button>}
                </div>
            </div>
        </>
    )
}