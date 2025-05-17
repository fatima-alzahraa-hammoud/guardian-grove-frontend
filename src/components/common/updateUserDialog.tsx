import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import AvatarSelector from '../AvatarSelector';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TUpdate, updateSchema } from '../../libs/types/updateTypes';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { Calendar } from '../ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';
import { useSelector } from 'react-redux';
import { selectAvatar, selectBirthday, selectEmail, selectGender, selectName, selectRole } from '../../redux/slices/userSlice';
import { toast, ToastContainer } from 'react-toastify';
import FormErrorMessage from './FormErrorMessage';

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: TUpdate) => void; 
    title: string;
    confirmText?: string;
    cancelText?: string;
    familyName: string;
}

const UpdateUserDialog: React.FC<DialogProps> = ({ isOpen, onClose, onConfirm, title, confirmText = "Confirm", cancelText = "Cancel", familyName }) => {

    const name = useSelector(selectName);
    const email = useSelector(selectEmail);
    const gender = useSelector(selectGender);
    const birthday = useSelector(selectBirthday);
    const avatar = useSelector(selectAvatar);
    const role = useSelector(selectRole);
    const familyAvatar = "/assets/images/stars.png";

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
        clearErrors,
    } = useForm<TUpdate>({
        resolver: zodResolver(updateSchema),
    });

    const selectedDate = watch("birthday");

    // Set initial values when the dialog opens
    useEffect(() => {
        if (isOpen) {
            const initialValues = {
                name: name || "",
                email: email || "",
                gender: gender || "",
                avatar: avatar || "",
                birthday: birthday ? new Date(birthday) : undefined,
                familyName: familyName,
                familyAvatar: "/assets/images/stars.png",
            };
            reset(initialValues);
            clearErrors();
        }
    }, [isOpen, name, email, gender, birthday, avatar, familyName, reset]);


    const onDateSelect = (date: Date | undefined) => {
        setValue("birthday", date || new Date("1900-01-01"), { shouldValidate: true });
    };

    const handleCancel = () => {
        reset({
            name: name || "",
            email: email || "",
            gender: gender || "",
            avatar: avatar || "",
            birthday: birthday ? new Date(birthday) : undefined,
            familyName: familyName,
            familyAvatar: "/assets/images/stars.png"
        });
        clearErrors();
        onClose();
    };

    const handleConfirm = handleSubmit((data) => {
        const formData = {} as TUpdate;

        if (data.name !== name) formData.name = data.name;
        if (data.email !== email && role === "parent") formData.email = data.email;
        if (data.avatar !== avatar) formData.avatar = data.avatar;
        if (data.birthday !== new Date(birthday)) formData.birthday = data.birthday;
        if (data.gender !== gender) formData.gender = data.gender;
        if (data.familyName !== familyName  && role === "parent") formData.familyName = data.familyName;
        if (data.familyAvatar !== familyAvatar  && role === "parent") formData.familyAvatar = data.familyAvatar;
        
        // Call onConfirm with valid data
        onConfirm(formData);
        onClose();

    });

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className='flex flex-col items-center justify-center font-poppins h-[80vh] overflow-y-scroll'>
                <DialogHeader>
                    <DialogTitle className='mt-36'>{title}</DialogTitle>
                </DialogHeader>

                {/* Avatar Selection */}
                <div className="mt-10">
                    <h4 className="mb-2 text-xs font-medium -mx-[30px]">Change your avatar</h4>
                    <div className="flex">
                        <AvatarSelector
                            selectedAvatar={watch("avatar")}
                            onAvatarClick={(src) => setValue("avatar", src, { shouldValidate: true })}
                            role={role || ''}
                        />
                    </div>
                    {errors.avatar && <FormErrorMessage message={errors.avatar.message as string} />}
                </div>

                {/* Name */}
                <form  className="space-y-3 w-full flex- flex-col items-center justify-center">
                    <div className="mx-3 relative">
                        <Label htmlFor="name" className="block text-xs font-medium text-gray-700 text-left mb-1">
                            Name
                        </Label>
                        <div className="relative">
                            <Input
                                id="name"   
                                type="text" 
                                {...register("name")}
                                placeholder={name || ''} 
                                className="flex-1 h-9 bg-transparent px-3 py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-foreground disabled:cursor-not-allowed disabled:opacity-50 pl-8 mt-1 placeholder:text-xs placeholder:text-black rounded-md border-[#3A8EBA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3A8EBA] sm:text-xs md:text-xs lg:text-xs" 
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round text-gray-500">
                                    <circle cx="12" cy="8" r="5"/>
                                    <path d="M20 21a8 8 0 0 0-16 0"/>
                                </svg>
                            </div>
                        </div>
                        {errors.name && <FormErrorMessage message={errors.name.message as string} />}
                    </div>    

                    {/* Birthday Picker */}
                    <div className="mx-3 relative">
                        <div className="block text-xs font-medium text-gray-700 text-left mb-1">
                            Date of Birth
                        </div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <div>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full pl-3 pr-3 mt-1 placeholder:text-xs placeholder:text-gray-500 rounded-md border border-[#3A8EBA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3A8EBA] text-xs flex justify-between items-center font-normal font-poppins",
                                            !selectedDate && "text-gray-500"
                                        )}
                                        style={{ backgroundColor: "transparent" }}
                                        type="button"
                                    >
                                        {selectedDate ? (
                                            format(selectedDate, "PPP")
                                        ) : (
                                            <span className="text-gray-500 font-normal text-xs">
                                                Pick a date
                                            </span>
                                        )}
                                        <CalendarIcon className="ml-auto w-2 h-2 opacity-60 text-gray-500" />
                                    </Button>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0 justify-center bg-white z-50 shadow-md rounded-md"
                                style={{ pointerEvents: "auto" }} // Ensure it captures interaction
                            >
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={onDateSelect}
                                    disabled={(date) =>
                                        date > new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                    className="rounded-md justify-center items-center bg-white"
                                />
                            </PopoverContent>
                        </Popover>
                        {errors.birthday && <FormErrorMessage message={errors.birthday.message as string} />}
                    </div>

                    {/* Gender */}

                    <div className="mx-3 relative">
                        <label className="block text-xs font-medium text-gray-700 text-left mb-1">
                            Gender
                        </label>
                        <Select
                            value={watch("gender")}
                            onValueChange={(value) => setValue("gender", value)}
                            aria-label="Gender Selection"
                        >
                            <SelectTrigger className="w-full pl-3 pr-3 mt-1 placeholder:text-xs placeholder:text-gray-500 rounded-md border border-[#3A8EBA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3A8EBA] text-xs">
                                <span className={!watch("gender") ? "text-gray-500 text-xs" : ""}>
                                    {watch("gender") || "Select gender"}
                                </span>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male" className="text-xs">
                                    Male
                                </SelectItem>
                                <SelectItem value="female" className="text-xs">
                                    Female
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.gender && <FormErrorMessage message={errors.gender.message as string} />}
                    </div>

                    {/* email */}
                    {role === 'parent' && (
                        <div className='space-y-5'>
                            <div className="mx-3 relative">
                                <Label htmlFor="email" className="block text-xs font-medium text-gray-700 text-left mb-1">
                                    Email
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="email"   
                                        type="text" 
                                        {...register("email")}
                                        disabled={role !== 'parent'} 
                                        placeholder={email || ''} 
                                        className="flex-1 h-9 bg-transparent px-3 py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-foreground disabled:cursor-not-allowed disabled:opacity-50 pl-8 mt-1 placeholder:text-xs placeholder:text-black rounded-md border-[#3A8EBA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3A8EBA] sm:text-xs md:text-xs lg:text-xs" 
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail text-gray-500">
                                            <rect width="20" height="16" x="2" y="4" rx="2"/>
                                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                                        </svg>
                                    </div>
                                </div>
                                {errors.email && <FormErrorMessage message={errors.email.message as string} />}
                            </div>

                            <div className="mx-3 relative">
                                <Label htmlFor="familyName" className="block text-xs font-medium text-gray-700 text-left mb-1">
                                    Family Name
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="familyName"   
                                        type="text" 
                                        {...register("familyName")}
                                        disabled={role !== 'parent'} 
                                        placeholder={familyName} 
                                        className="flex-1 h-9 bg-transparent px-3 py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-foreground disabled:cursor-not-allowed disabled:opacity-50 pl-8 mt-1 placeholder:text-xs placeholder:text-black rounded-md border-[#3A8EBA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3A8EBA] sm:text-xs md:text-xs lg:text-xs" 
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round text-gray-500">
                                            <circle cx="12" cy="8" r="5"/>
                                            <path d="M20 21a8 8 0 0 0-16 0"/>
                                        </svg>
                                    </div>
                                </div>
                                {errors.familyName && <FormErrorMessage message={errors.familyName.message as string} />}
                            </div>

                            <div className="mx-3 relative flex justify-center items-center">
                                 {/* Avatar Selection */}
                                <div className="mb-4">
                                    <h4 className="mb-2 text-xs font-medium -mx-[30px]">Change your family avatar</h4>
                                    <div className="flex justify-center items-center">
                                        <AvatarSelector
                                            selectedAvatar={watch("familyAvatar")}
                                            onAvatarClick={(src) => setValue("familyAvatar", src, { shouldValidate: true })}
                                            role='family'
                                        />
                                    </div>
                                    {errors.familyAvatar && <FormErrorMessage message={errors.familyAvatar.message as string} />}
                                </div>    
                            </div>
                        </div>    
                    )}
                </form>

                <DialogFooter>
                    <Button onClick={handleCancel} variant="outline" className='rounded-full border-[1px] bg-[#ffffff] text-black w-20 mr-3 '>
                        {cancelText}
                    </Button>
                    <Button onClick={handleConfirm} className='bg-[#3A8EBA] rounded-full hover:bg-[#347ea5] w-20'>
                        {confirmText}
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
};

export default UpdateUserDialog;
