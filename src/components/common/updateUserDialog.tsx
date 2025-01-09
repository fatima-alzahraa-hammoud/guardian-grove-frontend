import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import AvatarSelector from '../AvatarSelector';

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    confirmText?: string;
    cancelText?: string;
    role: string;
    name: string;
    gender: string;
    birthday: Date;
    email: string;
}

const DialogComponent: React.FC<DialogProps> = ({ isOpen, onClose, onConfirm, title, confirmText = "Confirm", cancelText = "Cancel", role, name, gender, birthday, email }) => {

    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
    const [editName, setName] = useState<string>(name);
    const [editEmail, setEmail] = useState<string>(email);
    const [editGender, setGender] = useState<string>(gender);
    const [editBirthday, setBirthday] = useState<Date>(birthday);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className='flex flex-col items-center font-poppins'>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                {/* Avatar Selection */}
                <div className="mb-4 mt-10">
                    <h4 className="mb-2 text-sm -mx-[30px]">Choose an Avatar</h4>
                    <div className="flex">
                        <AvatarSelector
                            selectedAvatar={selectedAvatar} 
                            onAvatarClick={(src) => {
                                setSelectedAvatar(src)
                            }} 
                            role={role}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DialogComponent;
