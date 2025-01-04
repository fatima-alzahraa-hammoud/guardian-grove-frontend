'use client';

import React, { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "../lib/utils";
import { Calendar } from "./ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "./ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import "../styles/global.css";
import { gsap } from "gsap";
import 'react-day-picker/dist/style.css';
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import Selects, {components} from 'react-select';
import AvatarSelector from "./AvatarSelector";

const FormSchema = z.object({
    avatar: z.number(),
    date: z.date({
        required_error: "A date of birth is required.",
    }),
    gender: z.string().nonempty({ message: "Gender is required." }),
    familyMember: z.string().nonempty({ message: "Family member type is required." }),
    interests: z.array(z.string()).nonempty({ message: "At least one interest is required." }),
    agreeToTerms: z.boolean().refine(val => val === true, {
        message: "You must agree to the Terms and Conditions and Privacy Policy",
    }),
});

type FormSchemaType = z.infer<typeof FormSchema>;

const interestOptions = [
    { label: 'Sports', value: 'Sports' },
    { label: 'Music', value: 'Music' },
    { label: 'Reading', value: 'Reading' },
    { label: 'Travel', value: 'Travel' },
    { label: 'Technology', value: 'Technology' },
    { label: 'Cooking', value: 'Cooking' },
    { label: 'Photography', value: 'Photography' },
];

const customStyles = {
    control: (provided: any) => ({
        ...provided,
        borderColor: '#3A8EBA',
        borderRadius: '0.375rem',
        fontSize: '0.75rem',
        minHeight: '36px',
        
    }),
    placeholder: (provided: any) => ({
        ...provided,
        fontSize: '10px',
        color: '#6b7280',
        textAlign: 'left',
        paddingLeft: '0.25rem',
    }),
    menu: (provided: any) => ({
        ...provided,
        zIndex: 9999,
        width: '200px',
    }),

    multiValue: (provided: any) => ({

        ...provided,
        backgroundColor: '#d6e4f8',
        borderRadius: '0.375rem',
    }),
    multiValueLabel: (provided: any) => ({
        ...provided,
        color: '#4A5568',
    }),
    multiValueRemove: (provided: any) => ({
        ...provided,
        color: '#4A5568',
        '&:hover': {
            backgroundColor: '#3A8EBA',
            color: 'white',
        },
    }),
    dropdownIndicator: (provided: any) => ({
        ...provided,
        color: '#6b7280',
        fontWeight: '50',
        fontFamily: 'Poppins',
        paddingRight: '0.75rem',
    }),
    menuList: (provided: any) => ({
        ...provided,
        maxHeight: '150px',
    }),
};

const DropdownIndicator = (props: any) => {
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

const SecondSignUpForm: React.FC = () => {
    const buttonsRef = useRef<HTMLButtonElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);

    const form = useForm<FormSchemaType>({
        resolver: zodResolver(FormSchema),
    });

    const onSubmit = (data: FormSchemaType) => {
        console.log(data);
    };

    return (
        <div ref={titleRef} className="w-full max-w-md space-y-6 -mt-20 font-poppins">
            {/*title*/}
            <div className="form-element text-center flex-col space-y-4">
                <h1 className="text-2xl font-bold text-center text-gray-800 font-comic">Welcome to Guardian Grove!</h1>
                <p className="text-xs text-muted-foreground font-poppins">
                Your AI companion for growth, connection, and care.
                </p>
            </div>

            <Form {...form}>
                <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[350px] overflow-y-auto">

                    <FormField
                        name="avatar"
                        render={({ field }) => (
                            <FormItem className="mx-[74px] relative">
                                <FormLabel className="block text-xs font-medium text-gray-700 text-left mb-1 -mx-[30px]">Select Avatar</FormLabel>
                                <FormControl>
                                    <AvatarSelector selectedAvatar={field.value} onAvatarClick={(id) => {
                                        field.onChange(id);
                                    }} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="date"
                        render={({ field }) => (
                        <FormItem className="mx-11 relative">
                            <FormLabel className="block text-xs font-medium text-gray-700 text-left mb-1">Date of Birth</FormLabel>
                            <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                        "w-full pl-3 pr-3 mt-1 placeholder:text-[10px] placeholder:text-gray-500 rounded-md border border-[#3A8EBA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3A8EBA] md:text-xs flex justify-between items-center font-normal font-poppins",
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
                        name="gender"
                        render={({ field }) => (
                        <FormItem className="mx-11 relative">
                            <FormLabel className="block text-xs font-medium text-gray-700 text-left mb-1">Select gender</FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger className="w-full pl-3 pr-3 mt-1 placeholder:text-[10px] placeholder:text-gray-500 rounded-md border border-[#3A8EBA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3A8EBA] md:text-xs">
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
                        name="familyMember"
                        render={({ field }) => (
                        <FormItem className="mx-11 relative">
                            <FormLabel className="block text-xs font-medium text-gray-700 text-left mb-1">Select Family Member</FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger className="w-full pl-3 pr-3 mt-1 placeholder:text-[10px] placeholder:text-gray-500 rounded-md border border-[#3A8EBA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3A8EBA] md:text-xs">
                                        <span className={!field.value ? "text-gray-500 text-[10px]" : ""}>{field.value || "Select family member"}</span>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="child" className="text-xs">Child</SelectItem>
                                        <SelectItem value="parent" className="text-xs">Parent</SelectItem>
                                        <SelectItem value="grandParent" className="text-xs">GrandParent</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                        </FormItem>
                        )}
                    />

                        <FormField
                            name="interests"
                            render={() => (
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
                                            styles={{
                                                ...customStyles,
                                                option: (provided: any, state: any) => ({
                                                    ...provided,
                                                    fontSize: '12px',
                                                    backgroundColor: state.isFocused ? '#3A8EBA' : provided.backgroundColor,
                                                    color: state.isFocused ? 'white' : provided.color,
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
                            name="agreeToTerms"
                            render={({ field }) => (
                                <FormItem className="mx-11 relative">
                                    <FormControl>
                                        <label className="flex items-center space-x-2">
                                            <input
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
                </form>
                <Button ref={buttonsRef} type="submit" className="w-1/5 bg-[#3A8EBA] hover:bg-[#326E9F] focus:ring-2 focus:ring-offset-2 focus:ring-[#326E9F] text-white p-2 rounded-full px-3 text-xs">SignUp</Button>
            </Form>
        </div>
    );
};

export default SecondSignUpForm;