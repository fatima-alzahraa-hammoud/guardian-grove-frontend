import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    confirmText?: string;
    cancelText?: string;
    role: string;
}

const DialogComponent: React.FC<DialogProps> = ({ isOpen, onClose, onConfirm, title, confirmText = "Confirm", cancelText = "Cancel", role }) => {

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            
        </Dialog>
    );
};

export default DialogComponent;
