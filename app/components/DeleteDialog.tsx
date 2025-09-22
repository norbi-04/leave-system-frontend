import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import styles from '~/styles/DeleteDialog.module.css'

interface DeleteDialogProps {
    title: string;
    message: string;
    deleteAction: () => boolean | Promise<boolean>;
    open: boolean;
    onClose: () => void;
    onDeleteResult?: (success: boolean) => void;
}

export default function DeleteDialog({ title, message, deleteAction, open, onClose, onDeleteResult }: DeleteDialogProps){
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
            <DialogBackdrop className={styles.backdrop} />
            <DialogPanel className={styles.dialogPanel}>
                <div className={styles.header}>
                    <div className={styles.icon}>!</div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <DialogTitle as="h2" className={styles.title}>
                            {title}
                        </DialogTitle>
                        <div className={styles.message}>
                            {message}
                        </div>
                    </div>
                </div>
                <div className={styles.actions}>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className={styles.deleteBtn}
                    >
                        Delete
                    </button>
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