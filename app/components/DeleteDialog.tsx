import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import styles from '~/styles/DeleteDialog.module.css'

interface DeleteDialogProps {
    title: string; // Dialog title
    message: string; // Dialog message
    deleteAction: () => boolean | Promise<boolean>; // Function to call when deleting
    open: boolean; // Whether the dialog is open
    onClose: () => void; // Function to call when closing the dialog
    onDeleteResult?: (success: boolean) => void; // Optional callback for delete result
}

export default function DeleteDialog({ title, message, deleteAction, open, onClose, onDeleteResult }: DeleteDialogProps){
    // Handle delete button click
    const handleDelete = async () => {
        const success = await deleteAction();
        onClose();
        if (success){
            onDeleteResult?.(true);
        } else {
            onDeleteResult?.(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} className="fixed inset-0 z-[1000] flex items-center justify-center">
            {/* Dialog backdrop */}
            <DialogBackdrop className={styles.backdrop} />
            <DialogPanel className={styles.dialogPanel}>
                <div className={styles.header}>
                    {/* Delete icon */}
                    <div className={styles.icon}>!</div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        {/* Dialog title */}
                        <DialogTitle as="h2" className={styles.title}>
                            {title}
                        </DialogTitle>
                        {/* Dialog message */}
                        <div className={styles.message}>
                            {message}
                        </div>
                    </div>
                </div>
                <div className={styles.actions}>
                    {/* Delete button */}
                    <button
                        type="button"
                        onClick={handleDelete}
                        className={styles.deleteBtn}
                    >
                        Delete
                    </button>
                    {/* Cancel button */}
                    <button
                        type="button"
                        data-autofocus
                        onClick={onClose}
                        className={styles.cancelBtn}
                    >
                        Cancel
                    </button>
                </div>
            </DialogPanel>
        </Dialog>
    )
}