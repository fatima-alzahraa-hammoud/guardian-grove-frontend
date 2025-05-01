'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { requestApi } from '../../libs/requestApi';
import { requestMethods } from '../../libs/enum/requestMethods';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '/assets/logo/GuardianGrove_logo_Text.png';
import { gsap } from 'gsap';
import img from '/assets/images/family-login.png';
import { useDispatch } from 'react-redux';
import { setIsTempPassword } from '../../redux/slices/userSlice';
import { changePasswordSchema, TChangePassword } from '../../libs/types/changePasswordTypes';


const ChangePasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();

    const { 
        register, 
        handleSubmit, 
        formState: { errors },
    } = useForm<TChangePassword>({
        resolver: zodResolver(changePasswordSchema)
    });

    useEffect(() => {
        // GSAP animations to match your login page style
        if (formRef.current) {
            gsap.fromTo(formRef.current, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 1, ease: "power2.out" });
        }
        if (logoRef.current) {
            gsap.fromTo(logoRef.current, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 1, delay: 0.2, ease: "power2.out" });
        }
    }, []);

    const onSubmit = async (data: TChangePassword) => {
        setIsLoading(true);
        try {
            if (!data.currentPassword || !data.newPassword || !data.confirmPassword) {
                toast.error("Please fill in all password fields");
                return;
            }
    
            if (data.newPassword !== data.confirmPassword) {
                toast.error("New passwords don't match!");
                return;
            }
    
            if (data.newPassword.length < 6) {
                toast.error("New password must be at least 6 characters long");
                return;
            }

            const response = await requestApi({
                route: '/users/updatePassword',
                method: requestMethods.PUT,
                body: {
                    oldPassword: data.currentPassword,
                    newPassword: data.newPassword,
                    confirmPassword: data.confirmPassword
                }
            });

            if (response && response.password) {
                toast.success(response.message);
                dispatch(setIsTempPassword(false)); 
                navigate('/dashboard'); 
            } else {
                toast.error(response.message || "Failed to update password");
            }
        } catch (error) {
            toast.error( 'Error changing password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen flex flex-col lg:flex-row p-0 m-0 font-poppins">
            <div ref={logoRef} className="absolute top-4 left-4">
                <img src={logo} alt="Guardian Grove Logo" width={100} height={100} />
            </div>
            
            <div className="lg:w-1/2 flex-1 flex flex-col items-center justify-center p-8 lg:p-16 w-1/2">
                <div className="w-full max-w-md space-y-4">
                    <div className="form-element text-center flex-col space-y-4">
                        <h1 className="text-3xl font-bold text-center text-gray-800 font-comic">
                            Change Your Password
                        </h1>
                        <p className="text-sm text-gray-600 pb-4">
                            Please enter your temporary password and set a new one
                        </p>
                    </div>

                    <form 
                        ref={formRef} 
                        onSubmit={handleSubmit(onSubmit)} 
                        className="space-y-6 w-full"
                    >
                        <div className="mx-10 relative">
                            <label htmlFor="currentPassword" className="block text-xs font-medium text-gray-700 text-left mb-2">
                                Temporary Password
                            </label>
                            <div className="relative">
                                <Input
                                    {...register('currentPassword')}
                                    id="currentPassword"
                                    type="password"
                                    placeholder="Enter temporary password"
                                    className="pl-8 mt-1 placeholder:text-[10px] placeholder:text-gray-500 rounded-md border border-[#3A8EBA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3A8EBA] md:text-xs"
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock-keyhole text-gray-500">
                                        <circle cx="12" cy="16" r="1"/>
                                        <rect x="3" y="10" width="18" height="12" rx="2"/>
                                        <path d="M7 10V7a5 5 0 0 1 10 0v3"/>
                                    </svg>
                                </div>
                            </div>
                            {errors.currentPassword && (
                                <p className="text-xs text-red-500 mt-1">{errors.currentPassword.message}</p>
                            )}
                        </div>

                        <div className="mx-10 relative">
                            <label htmlFor="newPassword" className="block text-xs font-medium text-gray-700 text-left mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <Input
                                    {...register('newPassword')}
                                    id="newPassword"
                                    type="password"
                                    placeholder="Enter new password"
                                    className="pl-8 mt-1 placeholder:text-[10px] placeholder:text-gray-500 rounded-md border border-[#3A8EBA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3A8EBA] md:text-xs"
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock text-gray-500">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                    </svg>
                                </div>
                            </div>
                            {errors.newPassword && (
                                <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>
                            )}
                        </div>

                        <div className="mx-10 relative">
                            <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700 text-left mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Input
                                    {...register('confirmPassword')}
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm new password"
                                    className="pl-8 mt-1 placeholder:text-[10px] placeholder:text-gray-500 rounded-md border border-[#3A8EBA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3A8EBA] md:text-xs"
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check text-gray-500">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
                                        <path d="m9 12 2 2 4-4"/>
                                    </svg>
                                </div>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-1/3  bg-[#3A8EBA] hover:bg-[#326E9F] focus:ring-2 focus:ring-offset-2 focus:ring-[#326E9F] text-white pt-2 pb-2 rounded-full px-3 text-xs"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Changing...
                                </>
                            ) : 'Change Password'}
                        </Button>
                    </form>
                </div>
            </div>
            
            <div className="lg:w-1/2 flex-1 relative overflow-hidden bg-gradient-to-b from-purple-50 to-blue-50">
                <img src={img} alt="" className="object-cover w-full h-full" />
            </div>
        </div>
    );
};

export default ChangePasswordPage;