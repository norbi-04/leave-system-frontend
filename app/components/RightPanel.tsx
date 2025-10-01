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
    editTitle?: string;
    deleteTitle?: string;
    saveTitle?: string;
    cancelTitle?: string;
    disableEdit?: boolean;
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
    // const userFormRef = useRef<HTMLFormElement>(null);

    return (
        <>
            {open && (
                <div className="right-panel-backdrop" onClick={onClose} />
            )}
            <div className={`${styles.panel} ${open ? styles.open : ''}`}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    <button className="btn-close" onClick={onClose}>✕</button>
                </div>
                <div className={styles.body}>
                    {children}
                </div>
                <div className={styles.footer}>
                    {!disableEdit && !editing && (
                        <button className="min-h-11.5 btn-secondary" onClick={editAction}>{editTitle}</button>
                    )}
                    {!editing && (
                        <button className="min-h-11.5 btn-delete" onClick={deleteAction}>{deleteTitle}</button>
                    )}
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