import React from 'react';
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

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    confirmText?: string;
    cancelText?: string;
    role: string;
    name: string;
    avatar: string;
    gender: string;
    birthday: Date;
    email: string;
}

const DialogComponent: React.FC<DialogProps> = ({ isOpen, onClose, onConfirm, title, confirmText = "Confirm", cancelText = "Cancel", role, name, gender, birthday, email, avatar }) => {

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<TUpdate>({
        resolver: zodResolver(updateSchema),
        defaultValues: {
            name: name,
            email: email,
            gender: gender,
            avatar: avatar,
            birthday: birthday || null,
        },
    });

    const selectedDate = watch("birthday");

    const onDateSelect = (date: Date | undefined) => {
        setValue("birthday", date || new Date("1900-01-01"), { shouldValidate: true });
    };

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
                            selectedAvatar={watch("avatar")}
                            onAvatarClick={(src) => setValue("avatar", src, { shouldValidate: true })}
                            role={role}
                        />
                    </div>
                </div>

                {/* Name */}
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
                                            "w-full pl-3 pr-3 mt-1 placeholder:text-[10px] placeholder:text-gray-500 rounded-md border border-[#3A8EBA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3A8EBA] text-xs flex justify-between items-center font-normal font-poppins",
                                            !selectedDate && "text-gray-500"
                                        )}
                                        style={{ backgroundColor: "transparent" }}
                                        type="button" // Set type="button" to prevent form submission
                                    >
                                        {selectedDate ? (
                                            format(selectedDate, "PPP")
                                        ) : (
                                            <span className="text-gray-500 font-normal text-[10px]">
                                                Pick a date
                                            </span>
                                        )}
                                        <CalendarIcon className="ml-auto w-2 h-2 opacity-60 text-gray-500" />
                                    </Button>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 justify-center">
                                <Calendar
                                    {...register("birthday")}
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
                    </div>

                    {/* Gender */}

                    <div className="mx-3 relative">
                        <label className="block text-xs font-medium text-gray-700 text-left mb-1">
                            Select Gender
                        </label>
                        <Select
                            value={watch("gender")}
                            onValueChange={(value) => setValue("gender", value)}
                            aria-label="Gender Selection"
                        >
                            <SelectTrigger className="w-full pl-3 pr-3 mt-1 placeholder:text-[10px] placeholder:text-gray-500 rounded-md border border-[#3A8EBA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3A8EBA] text-xs">
                                <span className={!watch("gender") ? "text-gray-500 text-[10px]" : ""}>
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
                    </div>

                    {/* email */}

                    {/* Family name */ }

                    {/* Family avatar */}

                    {/* submit */}
                </form>

            </DialogContent>
        </Dialog>
    );
};

export default DialogComponent;
