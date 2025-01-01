'use client';

import React from "react";
import logo from '../assets/logo/GuardianGrove_logo_Text.png';
import { Button } from '../../components/ui/button';

const Login : React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16">
                <div className="w-full max-w-md space-y-8">
                    {/*logo*/}
                    <div >
                        <img src={logo} alt="Guardian Grove Logo" width={100} height={100} />
                    </div>
                    {/*title*/}
                    <div className="form-element text-center flex-col space-y-4">
                        <h1 className="text-3xl font-bold text-center text-gray-800">Sign in to Guardian Grove</h1>
                        <div className="form-element flex justify-center space-x-4">
                            <Button variant="outline" size="icon" className="rounded-full w-12 h-12 flex items-center justify-center bg-[#3A8EBA]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook w-5 h-5 text-[#ffffff] fill-[#ffffff]">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                                </svg>                            
                            </Button>
                            <Button variant="outline" size="icon" className="rounded-full w-12 h-12 flex items-center justify-center bg-[#3A8EBA]">
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="26" height="26" viewBox="0,0,256,256">
                                    <g fill="#ffffff" fill-rule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" className="w-5 h-5 text-[#ffffff] fill-[#ffffff]">
                                        <g transform="scale(5.12,5.12)">
                                            <path d="M25.004,22.006l16.025,0.022c1.398,6.628 -1.159,19.972 -16.025,19.972c-9.391,0 -17.004,-7.611 -17.004,-17c0,-9.389 7.613,-17 17.004,-17c4.411,0 8.428,1.679 11.45,4.432l-4.785,4.783c-1.794,-1.536 -4.118,-2.47 -6.665,-2.47c-5.664,0 -10.256,4.591 -10.256,10.254c0,5.663 4.592,10.254 10.256,10.254c4.757,0 8.046,-2.816 9.256,-6.752h-9.256z">
                                            </path>
                                        </g>
                                    </g>
                                </svg>
                            </Button>
                            <Button variant="outline" size="icon" className="rounded-full w-12 h-12 flex items-center justify-center bg-[#3A8EBA]">
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
                                <span className="px-2 bg-white text-gray-500">
                                    or use your email account
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div>
                
            </div>
        </div>
    );
};

export default Login;