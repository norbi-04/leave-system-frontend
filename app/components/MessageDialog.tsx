import { useEffect } from "react";

type MessageDialogProps = {
    type: string; // Type of message: 'success' or 'error'
    message: string; // The message text to display
    onClose: () => void; // Function to call when dialog closes
};

export default function MessageDialog({ type, message, onClose }: MessageDialogProps) {

    // Automatically close the dialog after 3 seconds
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed top-4 left-1/2 p-4 rounded-md shadow-lg text-white
                        ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            {message}
        </div>
    );
}

