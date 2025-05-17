'use client';

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { requestApi } from "../../libs/requestApi";
import { requestMethods } from "../../libs/enum/requestMethods";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Loader2 } from "lucide-react";
import FormErrorMessage from "./FormErrorMessage";

const forgotPasswordSchema = z.object({
    name: z.string().min(3, "Name is required"),
    email: z.string().regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, { message: "Invalid email format" }),
});

type TForgotPassword = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ForgotPasswordDialog: React.FC<ForgotPasswordDialogProps> = ({ open, onOpenChange }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { 
        register, 
        handleSubmit, 
        formState: { errors },
        reset,
    } = useForm<TForgotPassword>({
        resolver: zodResolver(forgotPasswordSchema)
    });

    const onSubmit = async (data: TForgotPassword) => {
        setIsLoading(true);
        try {
            const response = await requestApi({
                route: "/auth/forget-password",
                method: requestMethods.POST,
                body: {
                    name: data.name,
                    email: data.email
                }
            });

            if (response && response.message) {
                toast.success(response.message);
                onOpenChange(false);
                reset();
            } else {
                toast.error(response?.message || 'Failed to send temporary password');
            }
        } catch (error) {
            toast.error('An error occurred while processing your request');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-comic">Reset Password</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">
                            Name
                        </label>
                        <Input
                            {...register("name")}
                            id="name"
                            type="text"
                            placeholder="Your Username"
                        />
                        {errors.name && <FormErrorMessage message={errors.name.message as string} />}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                            Email
                        </label>
                        <Input
                            {...register("email")}
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                        />
                        {errors.email && <FormErrorMessage message={errors.email.message as string} />}

                    </div>

                    <p className="text-sm text-gray-600">
                        We'll verify your details and send a temporary password to your email.
                    </p>

                    <DialogFooter>
                        <Button 
                            type="button"
                            variant="outline"
                            onClick={() => {
                                reset();
                                onOpenChange(false);
                            }}
                            className="text-xs"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit"
                            disabled={isLoading}
                            className="bg-[#3A8EBA] hover:bg-[#326E9F] text-xs"
                        >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                            </>
                        ) : 'Send Temporary Password'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ForgotPasswordDialog;