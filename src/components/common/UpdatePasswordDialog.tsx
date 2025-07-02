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
import { Switch } from "../ui/switch";
import { ChevronDown, ChevronUp, KeyRound, Hand, Volume2, VolumeX } from "lucide-react";
import { toast } from 'react-toastify';
import { requestApi } from '../../libs/requestApi';
import { requestMethods } from '../../libs/enum/requestMethods';
import FormErrorMessage from './FormErrorMessage';

interface SettingsDialogProps {
  handGestureEnabled?: boolean;
  onHandGestureToggle?: (enabled: boolean) => void;
  voiceEnabled?: boolean;
  onVoiceToggle?: (enabled: boolean) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({
  handGestureEnabled = false,
  onHandGestureToggle,
  voiceEnabled = true,
  onVoiceToggle
}) => {
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [showAccessibilityDialog, setShowAccessibilityDialog] = useState(false);
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
        } catch (error: unknown) {
            setErrors({
                ...errors,
                general: error instanceof Error 
                    ? error.message 
                    : "An error occurred while updating password"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleHandGestureToggle = (checked: boolean) => {
        if (onHandGestureToggle) {
            onHandGestureToggle(checked);
        }
        
        if (checked) {
            toast.success("Hand gesture control enabled!");
            // Request camera permission
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(() => {
                    console.log('Camera permission granted');
                })
                .catch((error) => {
                    console.error('Camera permission denied:', error);
                    toast.error("Camera permission required for hand gestures");
                    if (onHandGestureToggle) {
                        onHandGestureToggle(false);
                    }
                });
        } else {
            toast.info("Hand gesture control disabled");
        }
    };

    const handleVoiceToggle = (checked: boolean) => {
        if (onVoiceToggle) {
            onVoiceToggle(checked);
        }
        toast.info(checked ? "Voice guidance enabled" : "Voice guidance disabled");
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="text-black hover:text-[#3a8dba89] cursor-pointer transition-all duration-300 ease-in-out hover:scale-110">
                    <img src="/assets/images/dashboard/settings.svg" alt="settings" className="w-4 h-4" />
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    
                    {/* Accessibility Settings */}
                    <Button
                        variant="ghost"
                        className="w-full flex justify-between items-center"
                        onClick={() => setShowAccessibilityDialog(!showAccessibilityDialog)}
                    >
                        <div className="flex items-center gap-2">
                            <Hand className="h-4 w-4" />
                            <span>Accessibility Controls</span>
                        </div>
                        {showAccessibilityDialog ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>

                    {showAccessibilityDialog && (
                        <div className="space-y-4 p-4 border rounded-lg">
                            <div className="space-y-4">
                                {/* Hand Gesture Control */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Hand className="h-4 w-4" />
                                        <div>
                                            <p className="text-sm font-medium">Hand Gesture Control</p>
                                            <p className="text-xs text-gray-500">Control the interface with hand gestures</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={handGestureEnabled}
                                        onCheckedChange={handleHandGestureToggle}
                                    />
                                </div>

                                {/* Voice Guidance */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                                        <div>
                                            <p className="text-sm font-medium">Voice Guidance</p>
                                            <p className="text-xs text-gray-500">AI voice instructions for navigation</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={voiceEnabled}
                                        onCheckedChange={handleVoiceToggle}
                                    />
                                </div>

                                {/* Gesture Instructions */}
                                {handGestureEnabled && (
                                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                        <h4 className="text-sm font-semibold mb-2">Gesture Guide:</h4>
                                        <div className="text-xs space-y-1">
                                            <div>👆 Point (Index) - Navigate/Hover</div>
                                            <div>✌️ Peace (Index+Middle) - Click</div>
                                            <div>🤏 Pinch (Thumb+Index) - Right Click</div>
                                            <div>🤚 Open Palm - Back/Close Modal</div>
                                            <div>✊ Fist - Refresh Page</div>
                                            <div>🤞 Index+Pinky - Scroll Up</div>
                                            <div>🤘 Middle+Ring - Scroll Down</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Password Update */}
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
                                {errors.oldPassword && <FormErrorMessage message={errors.oldPassword as string} />}
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
                                {errors.newPassword && <FormErrorMessage message={errors.newPassword as string} />}
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
                                {errors.confirmPassword && <FormErrorMessage message={errors.confirmPassword as string} />}
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