import React, { useEffect, useState } from 'react';
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
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useSelector } from 'react-redux';
import { selectAvatar, selectBirthday, selectEmail, selectGender, selectName, selectRole } from '../../redux/slices/userSlice';
import FormErrorMessage from './FormErrorMessage';

// Enhanced Calendar Component with Year/Month Dropdowns
const EnhancedCalendar = ({ 
    selected, 
    onSelect, 
    disabled 
}: { 
    selected?: Date; 
    onSelect: (date: Date | undefined) => void; 
    disabled?: (date: Date) => boolean;
}) => {
    const currentYear = new Date().getFullYear();
    const [displayMonth, setDisplayMonth] = useState(
        selected ? selected.getMonth() : new Date().getMonth()
    );
    const [displayYear, setDisplayYear] = useState(
        selected ? selected.getFullYear() : currentYear
    );

    // Generate years from 1900 to current year
    const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);
    
    // Month names (abbreviated for compact display)
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const handleYearChange = (year: string) => {
        const newYear = parseInt(year);
        setDisplayYear(newYear);
        
        // If there's a selected date, update it to the new year
        if (selected) {
            const newDate = new Date(selected);
            newDate.setFullYear(newYear);
            // Make sure the new date is valid and within bounds
            if (newDate <= new Date() && newDate >= new Date("1900-01-01")) {
                onSelect(newDate);
            }
        }
    };

    const handleMonthChange = (month: string) => {
        const newMonth = parseInt(month);
        setDisplayMonth(newMonth);
        
        // If there's a selected date, update it to the new month
        if (selected) {
            const newDate = new Date(selected);
            newDate.setMonth(newMonth);
            // Make sure the new date is valid and within bounds
            if (newDate <= new Date() && newDate >= new Date("1900-01-01")) {
                onSelect(newDate);
            }
        }
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        if (direction === 'prev') {
            if (displayMonth === 0) {
                setDisplayMonth(11);
                setDisplayYear(displayYear - 1);
            } else {
                setDisplayMonth(displayMonth - 1);
            }
        } else {
            if (displayMonth === 11) {
                setDisplayMonth(0);
                setDisplayYear(displayYear + 1);
            } else {
                setDisplayMonth(displayMonth + 1);
            }
        }
    };

    return (
        <div className="bg-white rounded-md border p-2 w-fit">
            {/* Compact Year and Month Selectors */}
            <div className="flex justify-between items-center mb-2 space-x-1">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                    disabled={displayYear <= 1900 && displayMonth <= 0}
                    className="h-6 w-6 p-0 text-xs"
                >
                    <ChevronLeft className="h-3 w-3" />
                </Button>
                
                <div className="flex space-x-1">
                    <Select value={displayMonth.toString()} onValueChange={handleMonthChange}>
                        <SelectTrigger className="h-6 text-xs w-[50px] px-1">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {months.map((month, index) => (
                                <SelectItem key={index} value={index.toString()} className="text-xs">
                                    {month}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    
                    <Select value={displayYear.toString()} onValueChange={handleYearChange}>
                        <SelectTrigger className="h-6 text-xs w-[55px] px-1">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-[150px]">
                            {years.map((year) => (
                                <SelectItem key={year} value={year.toString()} className="text-xs">
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('next')}
                    disabled={displayYear >= currentYear && displayMonth >= new Date().getMonth()}
                    className="h-6 w-6 p-0 text-xs"
                >
                    <ChevronRight className="h-3 w-3" />
                </Button>
            </div>
            
            {/* Compact Calendar */}
            <Calendar
                mode="single"
                selected={selected}
                onSelect={onSelect}
                disabled={disabled}
                month={new Date(displayYear, displayMonth)}
                onMonthChange={(date) => {
                    setDisplayMonth(date.getMonth());
                    setDisplayYear(date.getFullYear());
                }}
                className="rounded-md"
                classNames={{
                    months: "flex flex-col space-y-2",
                    month: "space-y-2",
                    caption: "hidden", // Hide default caption since we have custom header
                    nav: "hidden", // Hide default navigation
                    table: "w-full border-collapse",
                    head_row: "flex",
                    head_cell: "text-muted-foreground rounded-md w-6 h-6 font-normal text-[10px] flex items-center justify-center",
                    row: "flex w-full",
                    cell: "text-center text-xs p-0 relative",
                    day: "h-6 w-6 p-0 font-normal text-xs flex items-center justify-center rounded hover:bg-gray-100",
                    day_selected: "bg-[#3A8EBA] text-white hover:bg-[#326E9F] hover:text-white",
                    day_today: "bg-gray-100 font-medium",
                    day_outside: "text-muted-foreground opacity-30",
                    day_disabled: "text-muted-foreground opacity-30 cursor-not-allowed",
                }}
            />
        </div>
    );
};

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: { userFormData: FormData; familyFormData?: FormData }) => void;
    title: string;
    confirmText?: string;
    cancelText?: string;
    familyName: string;
    familyAvatar?: string;
}

const UpdateUserDialog: React.FC<DialogProps> = ({ isOpen, onClose, onConfirm, title, confirmText = "Confirm", cancelText = "Cancel", familyName, familyAvatar }) => {

    const name = useSelector(selectName);
    const email = useSelector(selectEmail);
    const gender = useSelector(selectGender);
    const birthday = useSelector(selectBirthday);
    const avatar = useSelector(selectAvatar);
    const role = useSelector(selectRole);

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
                familyAvatar: familyAvatar,
            };
            reset(initialValues);
            clearErrors();
        }
    }, [isOpen, name, email, gender, birthday, avatar, familyName, familyAvatar, reset, clearErrors]);

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
            familyAvatar: familyAvatar
        });
        clearErrors();
        onClose();
    };

    const handleConfirm = handleSubmit(async (data) => {
        const userFormData = new FormData();
        let familyFormData: FormData | undefined;
        let hasUserChanges = false;
        let hasFamilyChanges = false;

        // Handle user-related changes
        if (data.name !== name) {
            userFormData.append('name', data.name);
            hasUserChanges = true;
        }

        if (data.gender !== gender) {
            userFormData.append('gender', data.gender);
            hasUserChanges = true;
        }

        if (birthday && data.birthday && data.birthday.getTime() !== new Date(birthday).getTime()) {
            userFormData.append('birthday', data.birthday.toISOString());
            hasUserChanges = true;
        }

        // Handle user avatar
        if (data.avatar !== avatar) {
            if (typeof data.avatar === 'string' && data.avatar.startsWith('blob:')) {
                try {
                    const blobResponse = await fetch(data.avatar);
                    const avatarBlob = await blobResponse.blob();
                    userFormData.append('avatar', avatarBlob, 'avatar.png');
                    hasUserChanges = true;
                } catch (error) {
                    console.error('Error converting avatar blob to file:', error);
                }
            } else if (data.avatar && typeof data.avatar === 'object' && (data.avatar as object) instanceof File) {
                userFormData.append('avatar', data.avatar);
                hasUserChanges = true;
            } else if (typeof data.avatar === 'string') {
                // Handle predefined avatars - send as regular text field, not file field
                userFormData.append('avatarPath', data.avatar);
                hasUserChanges = true;
            }
        }

        // Handle family-related changes for parents
        if (role === "parent") {
            // Check for any family-related changes
            const emailChanged = data.email !== email;
            const familyNameChanged = data.familyName !== familyName;
            const familyAvatarChanged = data.familyAvatar !== familyAvatar;

            if (emailChanged || familyNameChanged || familyAvatarChanged) {
                familyFormData = new FormData();
                
                if (emailChanged) {
                    familyFormData.append('email', data.email);
                    hasFamilyChanges = true;
                }

                if (familyNameChanged) {
                    familyFormData.append('familyName', data.familyName);
                    hasFamilyChanges = true;
                }

                if (familyAvatarChanged) {
                    console.log('Family avatar changed:', { old: familyAvatar, new: data.familyAvatar });
                    if (typeof data.familyAvatar === 'string' && data.familyAvatar.startsWith('blob:')) {
                        try {
                            const blobResponse = await fetch(data.familyAvatar);
                            const familyAvatarBlob = await blobResponse.blob();
                            familyFormData.append('familyAvatar', familyAvatarBlob, 'family-avatar.png');
                            hasFamilyChanges = true;
                        } catch (error) {
                            console.error('Error converting family avatar blob to file:', error);
                        }
                    } else if (typeof data.familyAvatar === 'object' && (data.familyAvatar as unknown) instanceof File) {
                        familyFormData.append('familyAvatar', data.familyAvatar);
                        hasFamilyChanges = true;
                    } else if (typeof data.familyAvatar === 'string') {
                        // Handle predefined family avatars - send as regular text field
                        familyFormData.append('familyAvatarPath', data.familyAvatar);
                        hasFamilyChanges = true;
                    }
                }
            }
        }

        // Only proceed if there are changes
        if (hasUserChanges || hasFamilyChanges) {
            onConfirm({ 
                userFormData: hasUserChanges ? userFormData : new FormData(), 
                familyFormData: hasFamilyChanges ? familyFormData : undefined 
            });
        }
        
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
                                className="w-auto p-0 bg-white z-[60] shadow-lg rounded-md border"
                                align="center"
                                side="bottom"
                                sideOffset={4}
                                avoidCollisions={true}
                                collisionPadding={8}
                            >
                                <EnhancedCalendar
                                    selected={selectedDate}
                                    onSelect={onDateSelect}
                                    disabled={(date) =>
                                        date > new Date() || date < new Date("1900-01-01")
                                    }
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