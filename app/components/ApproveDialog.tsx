import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import styles from '~/styles/DeleteDialog.module.css' 

interface ApproveDialogProps {
    title: string;
    message: string;
    approveAction: () => boolean | Promise<boolean>;
    open: boolean;
    onClose: () => void;
    onApproveResult?: (success: boolean) => void;
}

export default function ApproveDialog({ title, message, approveAction, open, onClose, onApproveResult }: ApproveDialogProps){
    // handle approve button click
    const handleApprove = async () => {
        const success = await approveAction();
        onClose();
        if (success){
            onApproveResult?.(true);
        } else {
            onApproveResult?.(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} className="fixed inset-0 z-[1000] flex items-center justify-center">
            {/* dialog backdrop */}
            <DialogBackdrop className={styles.backdrop} />
            <DialogPanel className={styles.dialogPanel}>
                <div className={styles.header}>
                    <div className={styles.icon} style={{ backgroundColor: "#22c55e", color: "white" }}>✓</div>
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
                        onClick={handleApprove}
                        className="btn-primary"
                    >
                        Approve
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-cancel"
                    >
                        Cancel
                    </button>
                </div>
            </DialogPanel>
        </Dialog>
    )
}