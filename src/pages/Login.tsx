'use client';

import React, { useEffect, useRef } from "react";
import "../styles/global.css";
import logo from '../assets/logo/GuardianGrove_logo_Text.png';
import img from '../assets/images/family-login.png';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { gsap } from "gsap";
import {useNavigate} from "react-router-dom";
import {FieldValues, useForm} from "react-hook-form";

const Login : React.FC = () => {
    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm();

    const onSubmit = (data: FieldValues) => {
        console.log(data);
    }

    const navigate = useNavigate();

    const formRef = useRef<HTMLFormElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (formRef.current) {
            gsap.fromTo(formRef.current, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 1, ease: "power2.out" });
        }
        if (logoRef.current) {
            gsap.fromTo(logoRef.current, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 1, delay: 0.2, ease: "power2.out" });
        }
        if (titleRef.current) {
            gsap.fromTo(titleRef.current, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 1, delay: 0.4, ease: "power2.out" });
        }
        if (buttonsRef.current) {
            gsap.fromTo(buttonsRef.current, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 1, delay: 0.6, ease: "power2.out" });
        }
        if (imgRef.current) {
            gsap.fromTo(imgRef.current, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 1, delay: 0.8, ease: "power2.out" });
        }
    }, []);

    return (
        <div className="h-screen flex flex-col lg:flex-row p-0 m-0 font-poppins">
            <div ref={logoRef} className="absolute top-4 left-4">
                <img src={logo} alt="Guardian Grove Logo" width={100} height={100} />
            </div>
            <div className="lg:w-1/2 flex-1 flex flex-col items-center justify-start p-8 lg:p-16 w-1/2">
                <div ref={titleRef} className="w-full max-w-md space-y-6 mt-16">
                    {/*title*/}
                    <div className="form-element text-center flex-col space-y-4">
                        <h1 className="text-3xl font-bold text-center text-gray-800 font-comic">Sign in to Guardian Grove</h1>
                        <div ref={buttonsRef} className="form-element flex justify-center space-x-4">
                            <Button size="icon" className="rounded-full w-10 h-10 flex items-center justify-center bg-[#3A8EBA] hover:bg-[#326E9F] focus:ring-2 focus:ring-offset-2 focus:ring-[#326E9F] text-white p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook w-5 h-5 text-[#ffffff] fill-[#ffffff]">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                                </svg>                            
                            </Button>
                            <Button size="icon" className="rounded-full w-10 h-10 flex items-center justify-center bg-[#3A8EBA] hover:bg-[#326E9F] focus:ring-2 focus:ring-offset-2 focus:ring-[#326E9F]">
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="26" height="26" viewBox="0,0,256,256">
                                    <g fill="#ffffff" fill-rule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" className="w-5 h-5 text-[#ffffff] fill-[#ffffff]">
                                        <g transform="scale(5.12,5.12)">
                                            <path d="M25.004,22.006l16.025,0.022c1.398,6.628 -1.159,19.972 -16.025,19.972c-9.391,0 -17.004,-7.611 -17.004,-17c0,-9.389 7.613,-17 17.004,-17c4.411,0 8.428,1.679 11.45,4.432l-4.785,4.783c-1.794,-1.536 -4.118,-2.47 -6.665,-2.47c-5.664,0 -10.256,4.591 -10.256,10.254c0,5.663 4.592,10.254 10.256,10.254c4.757,0 8.046,-2.816 9.256,-6.752h-9.256z">
                                            </path>
                                        </g>
                                    </g>
                                </svg>
                            </Button>
                            <Button size="icon" className="rounded-full w-10 h-10 flex items-center justify-center bg-[#3A8EBA] hover:bg-[#326E9F] focus:ring-2 focus:ring-offset-2 focus:ring-[#326E9F]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook w-5 h-5 text-[#ffffff] fill-[#ffffff]">
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                                    <rect width="4" height="12" x="2" y="9"/>
                                    <circle cx="4" cy="4" r="2"/>
                                </svg>
                            </Button>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 text-xs bg-white text-gray-500">
                                    or use your email account
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Login Form */}
                    <form ref={formRef} className="space-y-5 w-full">
                        <div className="mx-10 relative">
                            <label htmlFor="username" className="block text-xs font-medium text-gray-700 text-left mb-1">
                                Name
                            </label>
                            <div className="relative">
                                <Input 
                                    {...register("name", { required: true })}
                                    id="name" 
                                    type="text" 
                                    placeholder="name" 
                                    className=" flex-1 h-9 bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-xs pl-8 mt-1 placeholder:text-xs placeholder:text-gray-500 rounded-md border-[#3A8EBA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3A8EBA]" 
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round text-gray-500">
                                        <circle cx="12" cy="8" r="5"/>
                                        <path d="M20 21a8 8 0 0 0-16 0"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="mx-10 relative">
                            <label htmlFor="email" className="block text-xs font-medium text-gray-700 text-left mb-1">
                                Email
                            </label>
                            <div className="relative">
                                <Input 
                                    {...register("email", { required: true })}
                                    id="email" 
                                    type="email" 
                                    placeholder="email" 
                                    className="pl-8 mt-1 placeholder:text-xs placeholder:text-gray-500 rounded-md border border-[#3A8EBA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3A8EBA] md:text-xs" 
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail text-gray-500">
                                        <rect width="20" height="16" x="2" y="4" rx="2"/>
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="mx-10 relative">
                            <label htmlFor="password" className="block text-xs font-medium text-gray-700 text-left mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <Input 
                                    {...register("password", { required: true })}
                                    id="password" 
                                    type="password" 
                                    placeholder="password"
                                    className="pl-8 mt-1 placeholder:text-xs placeholder:text-gray-500 rounded-md border border-[#3A8EBA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3A8EBA] md:text-xs" 
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock-keyhole text-gray-500">
                                        <circle cx="12" cy="16" r="1"/>
                                        <rect x="3" y="10" width="18" height="12" rx="2"/>
                                        <path d="M7 10V7a5 5 0 0 1 10 0v3"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="text-right mr-10">
                            <a onClick={() => navigate('/forgot-password')} className="underline text-xs text-[#000000] hover:text-[#326E9F] cursor-pointer" >
                                Forgot your password?
                            </a>
                        </div>
                        <Button
                            onClick={handleSubmit(onSubmit)}
                            className="w-1/5 bg-[#3A8EBA] hover:bg-[#326E9F] focus:ring-2 focus:ring-offset-2 focus:ring-[#326E9F] text-white p-2 rounded-full px-3 text-sm"
                        > 
                            Login
                        </Button>

                        <p className="text-center text-xs text-gray-600">
                            Don't have an account?{' '}
                            <a  onClick={() => {navigate("/signup");}} className="text-[#3A8EBA] hover:text-[#326E9F] underline cursor-pointer">
                            Sign Up
                            </a>
                        </p>
                    </form>
                </div>
            </div>
            
            <div ref={imgRef} className="lg:w-1/2 flex-1 relative overflow-hidden bg-gradient-to-b from-purple-50 to-blue-50" >
                <img src={img} alt="" className="object-cover w-full h-full" />
            </div>
        </div>
    );
};

export default Login;