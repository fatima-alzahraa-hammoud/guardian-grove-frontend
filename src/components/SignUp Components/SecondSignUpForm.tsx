'use client';

import React, { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
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
import "../../styles/global.css";
import { gsap } from "gsap";
import 'react-day-picker/dist/style.css';
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
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
                                <PopoverContent className="w-auto p-0 justify-center">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                        className="rounded-md justify-center items-center bg-white"
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