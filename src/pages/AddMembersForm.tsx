import React, { useCallback, useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import AvatarSelector from "../components/AvatarSelector";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addMemberSchema, TAddMember } from "../libs/types/addMemberTypes";
import { Input } from "../components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar } from "../components/ui/calendar";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import Selects, { components, DropdownIndicatorProps, GroupBase, SelectInstance } from 'react-select';
import { customStyles, interestOptions } from "../libs/constants";
import girlImage from "/assets/images/girl.png";
import boyImage from "/assets/images/boy.png";
import { requestApi } from "../libs/requestApi";
import { requestMethods } from "../libs/enum/requestMethods";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import FormErrorMessage from "../components/common/FormErrorMessage";
import { SelectOption } from "../libs/types/SelectOption";

const DropdownIndicator = (props: DropdownIndicatorProps<SelectOption, true, GroupBase<SelectOption>>) => {
    return (
        <components.DropdownIndicator {...props}>
            <svg
                width="15"
                height="15"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
            <path
                d="M5 7L10 12L15 7"
                stroke="#6b7280"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            </svg>
        </components.DropdownIndicator>
    );
};  

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
        
        // If there's a selected date, update it with the new year
        if (selected) {
            const newDate = new Date(selected);
            newDate.setFullYear(newYear);
            onSelect(newDate);
        } else {
            // If no date is selected, create a new date with the first day of the current display month
            const newDate = new Date(newYear, displayMonth, 1);
            onSelect(newDate);
        }
    };

    const handleMonthChange = (month: string) => {
        const newMonth = parseInt(month);
        setDisplayMonth(newMonth);
        
        // If there's a selected date, update it with the new month
        if (selected) {
            const newDate = new Date(selected);
            newDate.setMonth(newMonth);
            onSelect(newDate);
        } else {
            // If no date is selected, create a new date with the first day of the new month
            const newDate = new Date(displayYear, newMonth, 1);
            onSelect(newDate);
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


const AddMembersForm : React.FC = () => {

    const [tab, setTab] = useState<string>("Child");
    const selectRef = useRef<SelectInstance<SelectOption, true, GroupBase<SelectOption>>>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset
    } = useForm<TAddMember>({
        resolver: zodResolver(addMemberSchema),
        defaultValues:{
            gender: "female",
            role: "child"
        }
    });

    const resetData = useCallback(() => {
        reset({
            gender: "female", // Reset default values
            role: "child",
            name: "",
            birthday: undefined,
            interests: [],
            avatar: "",
        });
        selectRef.current?.clearValue();
    }, [reset]);

    const selectedDate = watch("birthday");
    const gender = watch("gender"); 
    const navigate = useNavigate();

    const onDateSelect = (date: Date | undefined) => {
        setValue("birthday", date || new Date("1900-01-01"), { shouldValidate: true });
    };

    const onSubmit = async (data: TAddMember) => {
        console.log(data);
        try {
            // Minimal data for submission
            const formData = new FormData();

            formData.append('gender', data.gender || 'female');
            formData.append('role', data.role || tab.toLowerCase());
            formData.append('name', data.name || '');
            formData.append('birthday', data.birthday ? data.birthday.toISOString() : '');
            formData.append('interests', JSON.stringify(data.interests || []));
            
            if (data.avatar && data.avatar.startsWith('blob:')) {
                try {
                    const blobResponse = await fetch(data.avatar);
                    const avatarBlob = await blobResponse.blob();
                    formData.append('avatar', avatarBlob, 'avatar.png');
                } catch (blobError) {
                    console.error('Error converting blob to file:', blobError);
                    toast.error('Error processing avatar image');
                    return false;
                }
            } else if (data.avatar && typeof data.avatar === 'object' && (data.avatar as object) instanceof File) {
                formData.append('avatar', data.avatar);
            } else if (typeof data.avatar === 'string') {
                formData.append('avatarPath', data.avatar);
            }

            // Log FormData contents for debugging
            console.log('FormData contents:');
            for (const [key, value] of formData.entries()) {
                console.log(key, value);
            }

            const result = await requestApi({
                route: "/users/",
                method: requestMethods.POST,
                body: formData,
            });
            if (result && result.user) {
                console.log(result.user);
                // Success Toast
                toast.success(`Create your ${tab} successful, check your email.`);
                return true;
            }
        } catch (error) {
            console.log("Something wrong happened", error);
            toast.error(`There was an error creating the ${tab}. Please try again.`);
            return false; 
        }
    };

    useEffect(() => {
        reset({
            gender: "female", // Reset default values
            name: "",
            birthday: undefined,
            interests: [],
            avatar: "",
        });
        selectRef.current?.clearValue();
        setValue("role", tab.toLowerCase(), { shouldValidate: true });
    }, [tab, setValue, reset]);
    
    return(
        <>
            <ToastContainer className="text-xs"/>
            {/* Header */}
            <h1 className="text-xl md:text-2xl font-bold font-comic">
                Add Your Loved Ones to Begin the Adventure!
            </h1>

            <Tabs defaultValue="Child" className="w-full" value={tab} 
                onValueChange={(value) => {
                    setTab(value);
                    setValue("role", value.toLowerCase(), { shouldValidate: true });
                }}
            >
                <div className="flex justify-start items-center pl-20">
                    <TabsList className="flex flex-nowrap space-x-2 bg-[#CDE7FE]">
                        <TabsTrigger value="Child" className="shrink-0">Child</TabsTrigger>
                        <TabsTrigger value="Parent" className="shrink-0">Parent</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value={tab} className="flex flex-col justify-center items-center space-y-5">
                    {/* Avatar Selection */}
                    <div className="mt-10">
                        <h4 className="mb-2 text-xs font-medium -mx-[30px] text-left">Choose your {tab}'s avatar</h4>
                        <div className="flex">
                            <AvatarSelector
                                selectedAvatar={watch("avatar")}
                                onAvatarClick={(src) => setValue("avatar", src, { shouldValidate: true })}
                                role={tab.toLocaleLowerCase()}
                            />
                        </div>
                        {errors.avatar && <FormErrorMessage message={errors.avatar.message as string}/>}
                    </div>

                    <div className="w-full max-w-md">
                        <label htmlFor="username" className="block text-xs font-medium text-gray-700 text-left mb-1">
                            {tab}'s Nickname
                        </label>
                        <div className="relative">
                            <Input
                                {...register("name", { required: true })}
                                id="name" 
                                type="text" 
                                placeholder="nickname" 
                                className="flex-1 h-9 bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sn pl-8 mt-1 placeholder:text-[10px] placeholder:text-gray-500 rounded-md border-[#3A8EBA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3A8EBA] max-w-md" 
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round text-gray-500">
                                    <circle cx="12" cy="8" r="5"/>
                                    <path d="M20 21a8 8 0 0 0-16 0"/>
                                </svg>
                            </div>
                        </div>
                        {errors.name && <FormErrorMessage message={errors.name.message as string}/>}
                    </div>

                    {/* Birthday Picker */}
                    <div className="w-full max-w-md">
                        <div className="block text-xs font-medium text-gray-700 text-left mb-1">
                            {tab}'s Birthday
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
                                className="w-auto p-0"
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
                        {errors.birthday && <FormErrorMessage message={errors.birthday.message as string}/>}
                    </div>

                    {/* Select gender */}
                    <div className="flex rounded-full overflow-hidden w-full max-w-md">
                        <Button
                            type="button"
                            variant={gender === 'female' ? 'default' : 'outline'}
                            className={cn(
                            "flex-1 rounded-none gap-6",
                            gender === 'female' ? "bg-[#FF4A90] hover:bg-[#f14687]" : ""
                            )}
                            onClick={() => setValue("gender", "female", { shouldValidate: true })} 
                        >
                            <img src={girlImage} alt="female" className="w-6 h-6"/>
                            <span>Female</span>
                        </Button>
                        <Button
                            type="button"
                            variant={gender === 'male' ? 'default' : 'outline'}
                            className={cn(
                            "flex-1 rounded-none gap-6",
                            gender === 'male' ? "bg-[#3A8EBA] hover:bg-[#347ea5]" : ""
                            )}
                            onClick={() => setValue("gender", "male", { shouldValidate: true })} 
                        >
                            <img src={boyImage} alt="boy" className="w-6 h-6"/>
                            <span>Male</span>
                        </Button>
                    </div>
                    {errors.gender && <FormErrorMessage message={errors.gender.message as string}/>}

                    <div className="w-full max-w-md">
                        <label className="block text-xs font-medium text-gray-700 text-left mb-2">{tab}'s Interests</label>
                        <div>
                            <Selects
                                ref={selectRef}
                                name="interests"
                                isMulti
                                options={interestOptions}
                                placeholder="Select interests..."
                                className="custom-select text-[20px]"
                                classNamePrefix="react-select text-[20px]"
                                onChange={(selectedOptions) => {
                                    const selectedValues = Array.isArray(selectedOptions)
                                        ? selectedOptions.map((option) => (option as SelectOption).value)
                                        : [];
                                    setValue("interests", selectedValues);
                                }}
                                styles={{
                                    ...customStyles,
                                    option: (base, state) => ({
                                        ...base,
                                        fontSize: '12px',
                                        backgroundColor: state.isFocused ? '#3A8EBA' : base.backgroundColor,
                                        color: state.isFocused ? 'white' : base.color,
                                    }),
                                }}
                                components={{ DropdownIndicator }}
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                menuShouldScrollIntoView={false}
                            />
                        </div>
                        {errors.interests && <FormErrorMessage message={errors.interests.message as string}/>}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-evenly pt-4">
                        <Button variant="outline" className="flex-1 rounded-full mr-20" 
                            onClick={handleSubmit(
                                async (data) => {
                                    console.log('Valid submission:', data);
                                    const success = await onSubmit(data);
                                    if (success) resetData();
                                },
                                (errors) => {
                                    console.log('Validation errors:', errors);
                                }
                            )}
                            type="button"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round-plus">
                                <path d="M2 21a8 8 0 0 1 13.292-6"/><circle cx="10" cy="8" r="5"/>
                                <path d="M19 16v6"/>
                                <path d="M22 19h-6"/>
                            </svg>
                            <span>Add Another {tab}</span>
                        </Button>
                        <Button className="flex-1 bg-[#3A8EBA] hover:bg-[#347ea5] rounded-full" 
                                onClick={() => navigate("/dashboard")}
                                type="button"
                        >
                            Save and Continue
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </>
    );
};

export default AddMembersForm;