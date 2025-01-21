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
  
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordForm({
            ...passwordForm,
            [e.target.name]: e.target.value
        });
    };

    const resetForm = () => {
        setPasswordForm({ 
            oldPassword: '', 
            newPassword: '', 
            confirmPassword: '' 
        });
        setShowPasswordDialog(false);
    };

    const handlePasswordUpdate = async () => {
        try {
        // Basic validation
            if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
                toast.error("Please fill in all password fields");
                return;
            }

            if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                toast.error("New passwords don't match!");
                return;
            }

            if (passwordForm.newPassword.length < 6) {
                toast.error("New password must be at least 6 characters long");
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
                console.log(response)
                toast.success("Password updated successfully!");
                resetForm();
            } else {
                toast.error(response.message || "Failed to update password");
            }
        } catch (error: any) {
            toast.error(error.message || "An error occurred while updating password");
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
                        <Input
                            type="password"
                            placeholder="Current Password"
                            name="oldPassword"
                            value={passwordForm.oldPassword}
                            onChange={handlePasswordChange}
                            className="w-full"
                        />
                        <Input
                            type="password"
                            placeholder="New Password"
                            name="newPassword"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full"
                        />
                        <Input
                            type="password"
                            placeholder="Confirm New Password"
                            name="confirmPassword"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full"
                        />
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