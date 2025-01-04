'use client';

import React, { useEffect, useRef } from "react";
import { Button } from "../components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "../lib/utils";
import { Calendar } from "../components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import "../styles/global.css";
import { gsap } from "gsap";
import 'react-day-picker/dist/style.css';
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";

const FormSchema = z.object({
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
  gender: z.string().nonempty({ message: "Gender is required." }),
});

const SecondSignUpForm: React.FC = () => {
  const buttonsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(formRef.current, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 1, ease: "power2.out" });
    }
    if (buttonsRef.current) {
      gsap.fromTo(buttonsRef.current, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 1, delay: 0.6, ease: "power2.out" });
    }
    if (titleRef.current) {
      gsap.fromTo(titleRef.current, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 1, delay: 0.4, ease: "power2.out" });
    }
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

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
                <form className="space-y-4">
                    <FormField
                        name="username"
                        render={({ field }) => (
                            <FormItem className="mx-12 relative">
                                <FormLabel className="block text-xs text-gray-700 text-left mb-1">Date of Birth</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 pr-3 mt-1 placeholder:text-[10px] placeholder:text-gray-500 rounded-md border border-[#3A8EBA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3A8EBA] md:text-xs flex justify-between items-center",
                                                    !field.value && "text-gray-500"
                                                )}
                                                style={{backgroundColor: "transparent"}}
                                                >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span className="text-gray-500 font-normal text-[10px]">Pick a date</span>
                                                )}
                                                <CalendarIcon className="w-auto p-0 opacity-60 text-gray-500" />
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
                        <FormItem className="mx-12 relative">
                            <FormLabel className="block text-xs text-gray-700 text-left mb-1">Select gender</FormLabel>
                            <FormControl>
                                <Select {...field}>
                                    <SelectTrigger className="w-full pl-3 pr-3 mt-1 placeholder:text-[10px] placeholder:text-gray-500 rounded-md border border-[#3A8EBA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3A8EBA] md:text-xs">
                                        <span className={!field.value ? "text-gray-500 text-[10px]" : ""}>{field.value || "select option"}</span>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                        </FormItem>
                        )}
                    />

                    <FormField
                        name="familyMember"
                        render={({ field }) => (
                        <FormItem className="mx-12 relative">
                            <FormLabel className="block text-xs text-gray-700 text-left mb-1">Select Family Member</FormLabel>
                            <FormControl>
                                <Select {...field}>
                                    <SelectTrigger className="w-full pl-3 pr-3 mt-1 placeholder:text-[10px] placeholder:text-gray-500 rounded-md border border-[#3A8EBA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3A8EBA] md:text-xs">
                                        <span className={!field.value ? "text-gray-500 text-[10px]" : ""}>{field.value || "select option"}</span>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="child">Child</SelectItem>
                                        <SelectItem value="parent">Parent</SelectItem>
                                        <SelectItem value="grandParent">GrandParnet</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                        </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-1/5 bg-[#3A8EBA] hover:bg-[#326E9F] focus:ring-2 focus:ring-offset-2 focus:ring-[#326E9F] text-white p-2 rounded-full px-3 text-xs">SignUp</Button>
                </form>
            </Form>
        </div>
    );
};

export default SecondSignUpForm;