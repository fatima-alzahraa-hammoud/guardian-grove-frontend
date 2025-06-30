'use client';

import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { cn } from "../../lib/utils";
import { Calendar } from "../ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import "../../styles/global.css";
import { gsap } from "gsap";
import 'react-day-picker/dist/style.css';
import Selects, {components, DropdownIndicatorProps} from 'react-select';
import AvatarSelector from "../AvatarSelector";
import { secondStepSchems, TSecondStep } from "../../libs/types/signupTypes";
import { customStyles, interestOptions } from "../../libs/constants";
import { Input } from "@mui/material";
import { toast } from "react-toastify";
import { SelectOption } from "../../libs/types/SelectOption";

interface FormErrors {
    [key: string]: {
        message?: string;
    };
}

const DropdownIndicator = (props: DropdownIndicatorProps) => {
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
        setDisplayYear(parseInt(year));
    };

    const handleMonthChange = (month: string) => {
        setDisplayMonth(parseInt(month));
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

interface SecondSignUpFormProps {
    onSubmit: (data: TSecondStep) => void;
}

const SecondSignUpForm: React.FC<SecondSignUpFormProps> = ({onSubmit}) => {

    const containerRef = useRef<HTMLDivElement>(null);

    const form = useForm<TSecondStep>({
        resolver: zodResolver(secondStepSchems),
        defaultValues: {
            avatar: "",
            birthday: undefined,
            gender: "",
            role: "",
            interests: [],
            familyAvatar: "",
            familyName: "",
            agreeToTerms: false
        }
    });

    const handleSubmit = (data: TSecondStep) => {
        onSubmit(data);
    };

    const onError = (errors: FormErrors) => {
        console.log("Form errors:", errors);
        if (errors) {
            Object.keys(errors).forEach((key) => {
                toast.error(errors[key]?.message || "Invalid input");
            });
        }
    };

    useEffect(() => {   
        if (containerRef.current) {
            gsap.fromTo(
                containerRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 1, ease: "power2.out" }
            );
        }
    }, []);

    return (
        <div ref={containerRef} className="w-full max-w-md space-y-6 font-poppins">
            {/*title*/}
            <div className="form-element text-center flex-col space-y-4">
                <h1 className="text-2xl font-bold text-center text-gray-800 font-comic">Welcome to Guardian Grove!</h1>
                <p className="text-xs text-muted-foreground font-poppins">
                Your AI companion for growth, connection, and care.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit, onError)} className="space-y-4">
                    <div className="space-y-4 max-h-[23rem] overflow-y-auto">
                        <FormField
                            control={form.control}
                            name="avatar"
                            render={({ field }) => (
                                <FormItem className="mx-[74px] relative">
                                    <FormLabel className="block text-xs font-medium text-gray-700 text-left mb-1 -mx-[32px]">Select Avatar</FormLabel>
                                    <FormControl>
                                        <AvatarSelector 
                                            selectedAvatar={field.value} 
                                            onAvatarClick={(src) => {
                                                field.onChange(src);
                                            }} 
                                            role="parent"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="birthday"
                            render={({ field }) => (
                            <FormItem className="mx-11 relative">
                                <FormLabel className="block text-xs font-medium text-gray-700 text-left mb-1">Date of Birth</FormLabel>
                                <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                            "w-full pl-3 pr-3 mt-1 placeholder:text-[10px] placeholder:text-gray-500 rounded-md border border-[#3A8EBA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3A8EBA] text-xs flex justify-between items-center font-normal font-poppins",
                                            !field.value && "text-gray-500"
                                            )}
                                            style={{ backgroundColor: "transparent" }} // Prevent background color change on hover
                                        >
                                            {field.value ? (
                                            format(field.value, "PPP")
                                            ) : (
                                            <span className="text-gray-500 font-normal text-[10px]">Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto w-2 h-2 opacity-60 text-gray-500" />
                                        </Button>
                                    </FormControl>
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
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                    />
                                </PopoverContent>
                                </Popover>
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                            <FormItem className="mx-11 relative">
                                <FormLabel className="block text-xs font-medium text-gray-700 text-left mb-1">Select gender</FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger className="w-full pl-3 pr-3 mt-1 placeholder:text-[10px] placeholder:text-gray-500 rounded-md border border-[#3A8EBA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3A8EBA] text-xs">
                                            <span className={!field.value ? "text-gray-500 text-[10px]" : ""}>{field.value || "Select gender"}</span>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male" className="text-xs">Male</SelectItem>
                                            <SelectItem value="female" className="text-xs">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                            <FormItem className="mx-11 relative">
                                <FormLabel className="block text-xs font-medium text-gray-700 text-left mb-1">Select Family Member</FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger className="w-full pl-3 pr-3 mt-1 placeholder:text-[10px] placeholder:text-gray-500 rounded-md border border-[#3A8EBA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3A8EBA] text-xs">
                                            <span className={!field.value ? "text-gray-500 text-[10px]" : ""}>{field.value || "Select family member"}</span>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="child" className="text-xs">Child</SelectItem>
                                            <SelectItem value="parent" className="text-xs">Parent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="familyAvatar"
                            render={({ field }) => (
                                <FormItem className="mx-[74px] relative">
                                    <FormLabel className="block text-xs font-medium text-gray-700 text-left mb-1 -mx-[32px]">Select Family Avatar</FormLabel>
                                    <FormControl>
                                        <AvatarSelector 
                                            selectedAvatar={field.value} 
                                            onAvatarClick={(src) => {
                                                field.onChange(src);
                                            }} 
                                            role="family"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="familyName"
                            render={({ field }) => (
                            <FormItem className="mx-11 relative">
                                <FormLabel className="block text-xs font-medium text-gray-700 text-left mb-1">Enter Family Name</FormLabel>
                                <FormControl>
                                    <input
                                        className="h-9 w-full pl-3 pr-3 mt-1 placeholder:text-[10px] placeholder:text-gray-500 rounded-md border border-[#3A8EBA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3A8EBA] text-xs"
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="enter your family name"
                                    />
                                </FormControl>
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="interests"
                            render={({field}) => (
                                <FormItem className="mx-11 relative">
                                    <FormLabel className="block text-xs font-medium text-gray-700 text-left mb-1">Select Interests</FormLabel>
                                    <FormControl>
                                        <Selects
                                            name="interests"
                                            isMulti
                                            options={interestOptions}
                                            placeholder="Select interests..."
                                            className="custom-select text-[10px]"
                                            classNamePrefix="react-select"
                                            onChange={(selectedOptions) => {
                                                const selectedValues = Array.isArray(selectedOptions)
                                                    ? selectedOptions.map((option) => (option as SelectOption).value)
                                                    : [];
                                                field.onChange(selectedValues);
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
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="agreeToTerms"
                            render={({ field }) => (
                                <FormItem className="mx-11 relative">
                                    <FormControl>
                                        <label className="flex items-center space-x-2">
                                            <Input
                                                id= "agreeToTerms"
                                                type="checkbox"
                                                {...field}
                                                className="form-checkbox h-3 w-3 bg-[#3A8EBA]"
                                            />
                                            <label htmlFor="agreeToTerms" className="text-[9px] text-left text-gray-700">
                                                I have read and agree to the{" "}
                                                <a href="/terms" className="text-[#3A8EBA] underline">
                                                    Terms and Conditions
                                                </a>{" "}
                                                and{" "}
                                                <a href="/privacy" className="text-[#3A8EBA] underline">
                                                    Privacy Policy
                                                </a>
                                            </label>
                                        </label>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit" className="w-1/5 bg-[#3A8EBA] hover:bg-[#326E9F] focus:ring-2 focus:ring-offset-2 focus:ring-[#326E9F] text-white p-2 rounded-full px-3 text-xs">SignUp</Button>
                </form>
            </Form>
        </div>
    );
};

export default SecondSignUpForm;