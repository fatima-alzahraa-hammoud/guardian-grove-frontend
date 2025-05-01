import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ChevronDown, ChevronUp, KeyRound } from "lucide-react";
import { toast } from 'react-toastify';
import { requestApi } from '../../libs/requestApi';
import { requestMethods } from '../../libs/enum/requestMethods';

const SettingsDialog = () => {
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        general: ''
    });
  
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordForm({
            ...passwordForm,
            [e.target.name]: e.target.value
        });
        // Clear error when user types
        setErrors({
            ...errors,
            [e.target.name]: '',
            general: ''
        });
    };

    const resetForm = () => {
        setPasswordForm({ 
            oldPassword: '', 
            newPassword: '', 
            confirmPassword: '' 
        });
        setErrors({
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            general: ''
        });
        setShowPasswordDialog(false);
    };

    const handlePasswordUpdate = async () => {
        try {
            // Reset errors
            setErrors({
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
                general: ''
            });

            // Validation
            let hasError = false;
            const newErrors = {
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
                general: ''
            };

            if (!passwordForm.oldPassword) {
                newErrors.oldPassword = "Current password is required";
                hasError = true;
            }

            if (!passwordForm.newPassword) {
                newErrors.newPassword = "New password is required";
                hasError = true;
            } else if (passwordForm.newPassword.length < 6) {
                newErrors.newPassword = "Password must be at least 6 characters";
                hasError = true;
            }

            if (!passwordForm.confirmPassword) {
                newErrors.confirmPassword = "Please confirm your password";
                hasError = true;
            } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                newErrors.confirmPassword = "Passwords don't match";
                hasError = true;
            }

            if (hasError) {
                setErrors(newErrors);
                return;
            }

            setIsLoading(true);

            const response = await requestApi({
                route: "/users/updatePassword",
                method: requestMethods.PUT,
                body: {
                    oldPassword: passwordForm.oldPassword,
                    newPassword: passwordForm.newPassword,
                    confirmPassword: passwordForm.confirmPassword
                }
            });

            if (response && response.password) {
                toast.success("Password updated successfully!");
                resetForm();
            } else {
                setErrors({
                    ...errors,
                    ...(response?.message && { general: response.message })
                });
            }
        } catch (error: any) {
            setErrors({
                ...errors,
                general: error.message || "An error occurred while updating password"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="text-black hover:text-[#3a8dba89] cursor-pointer transition-all duration-300 ease-in-out hover:scale-110">
                    <img src="/assets/images/dashboard/settings.svg" alt="settings" className="w-4 h-4" />
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <Button
                        variant="ghost"
                        className="w-full flex justify-between items-center"
                        onClick={() => setShowPasswordDialog(!showPasswordDialog)}
                    >
                        <div className="flex items-center gap-2">
                            <KeyRound className="h-4 w-4" />
                            <span>Update Password</span>
                        </div>
                        {showPasswordDialog ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>

                    {showPasswordDialog && (
                        <div className="space-y-4 p-4 border rounded-lg">
                            <div>
                                <Input
                                    type="password"
                                    placeholder="Current Password"
                                    name="oldPassword"
                                    value={passwordForm.oldPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full"
                                />
                                {errors.oldPassword && (
                                    <p className="text-xs text-red-500 mt-1">{errors.oldPassword}</p>
                                )}
                            </div>

                            <div>
                                <Input
                                    type="password"
                                    placeholder="New Password"
                                    name="newPassword"
                                    value={passwordForm.newPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full"
                                />
                                {errors.newPassword && (
                                    <p className="text-xs text-red-500 mt-1">{errors.newPassword}</p>
                                )}
                            </div>

                            <div>
                                <Input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    name="confirmPassword"
                                    value={passwordForm.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full"
                                />
                                {errors.confirmPassword && (
                                    <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
                                )}
                            </div>

                            {errors.general && (
                                <p className={`text-xs mt-1 ${
                                    errors.general.includes("success") 
                                        ? "text-green-500" 
                                        : "text-red-500"
                                }`}>
                                    {errors.general}
                                </p>
                            )}

                            <Button 
                                onClick={handlePasswordUpdate}
                                className="w-full bg-[#3a8dba] hover:bg-[#347ea5]"
                                disabled={isLoading}
                            >
                                {isLoading ? "Updating..." : "Update Password"}
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SettingsDialog;