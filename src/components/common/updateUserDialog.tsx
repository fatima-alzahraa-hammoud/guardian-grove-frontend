import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import AvatarSelector from '../AvatarSelector';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TUpdate, updateSchema } from '../../libs/types/updateTypes';

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
    const [editName, setName] = useState<string>('');
    const [editEmail, setEmail] = useState<string>('');
    const [editGender, setGender] = useState<string>('');
    const [editBirthday, setBirthday] = useState<Date | null>();

    const { 
        register, 
        handleSubmit,
        formState: { errors }
    } = useForm<TUpdate>({
        resolver: zodResolver(updateSchema)
    });

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
                            {...register("avatar")}
                            selectedAvatar={selectedAvatar} 
                            onAvatarClick={(src) => {
                                setSelectedAvatar(src)
                            }} 
                            role={role}
                        />
                    </div>
                </div>

                <form  className="space-y-3 w-full">
                    <div className="mx-3 relative">
                        <Label htmlFor="name" className="block text-xs font-medium text-gray-700 text-left mb-1">
                            Name
                        </Label>
                        <div className="relative">
                            <Input
                                {...register("name")}
                                id="name"   
                                type="text" 
                                placeholder={name} 
                                className="flex-1 h-9 bg-transparent px-3 py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-foreground disabled:cursor-not-allowed disabled:opacity-50 pl-8 mt-1 placeholder:text-[10px] placeholder:text-black rounded-md border-[#3A8EBA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3A8EBA] sm:text-xs md:text-xs lg:text-xs" 
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round text-gray-500">
                                    <circle cx="12" cy="8" r="5"/>
                                    <path d="M20 21a8 8 0 0 0-16 0"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </form>

            </DialogContent>
        </Dialog>
    );
};

export default DialogComponent;
