'use client';

import React, { useEffect, useRef } from "react";
import { Button } from "../components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "../lib/utils";
import { toast } from "react-toastify";
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
                <form className="space-y-6">
                    <FormField
                        name="username"
                        render={({ field }) => (
                            <FormItem className="mx-12 relative">
                                <FormLabel className="block text-xs font-medium text-gray-700 text-left mb-1">Date of Birth</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 pr-3 mt-1 placeholder:text-[10px] placeholder:text-gray-500 rounded-md border border-[#3A8EBA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3A8EBA] md:text-xs flex justify-between items-center opacity-60",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                                >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-60" />
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
                                            
                                            className="rounded-md justify-center items-center bg-white font-normal"
                                        />
                                    </PopoverContent>
                                </Popover>
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