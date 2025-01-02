'use client';

import React from "react";
import "../styles/global.css";
import logo from '../assets/logo/GuardianGrove_logo_Text.png';
import img from '../assets/images/family-signup1.png';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

const Signup : React.FC = () => {

    return (
        <div>
            <div>
                <img src={img} alt="Family picnic" />
            </div>
            <div>
                <div>
                    <img src={logo} alt="Guardian Grove Logo" width={100} height={100} />
                </div>
                <div>
                    {/*title*/}
                    <div>
                        <h1>Create Account</h1>
                        <div>
                            <Button size="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook w-5 h-5 text-[#ffffff] fill-[#ffffff]">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                                </svg>                            
                            </Button>
                            <Button size="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="26" height="26" viewBox="0,0,256,256">
                                    <g fill="#ffffff" fill-rule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" className="w-5 h-5 text-[#ffffff] fill-[#ffffff]">
                                        <g transform="scale(5.12,5.12)">
                                            <path d="M25.004,22.006l16.025,0.022c1.398,6.628 -1.159,19.972 -16.025,19.972c-9.391,0 -17.004,-7.611 -17.004,-17c0,-9.389 7.613,-17 17.004,-17c4.411,0 8.428,1.679 11.45,4.432l-4.785,4.783c-1.794,-1.536 -4.118,-2.47 -6.665,-2.47c-5.664,0 -10.256,4.591 -10.256,10.254c0,5.663 4.592,10.254 10.256,10.254c4.757,0 8.046,-2.816 9.256,-6.752h-9.256z">
                                            </path>
                                        </g>
                                    </g>
                                </svg>
                            </Button>
                            <Button size="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook w-5 h-5 text-[#ffffff] fill-[#ffffff]">
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                                    <rect width="4" height="12" x="2" y="9"/>
                                    <circle cx="4" cy="4" r="2"/>
                                </svg>
                            </Button>
                        </div>
                        <div>
                            <div>
                                <span/>
                            </div>
                            <div>
                                <span>
                                    or use your email account
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Login Form */}
                    <form>
                        <div >
                            <label htmlFor="username">
                                Username
                            </label>
                            <div>
                                <Input id="username" type="text" placeholder="username" />
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round text-gray-500">
                                        <circle cx="12" cy="8" r="5"/>
                                        <path d="M20 21a8 8 0 0 0-16 0"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email">
                                Email
                            </label>
                            <div>
                                <Input id="email" type="email" placeholder="email"/>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail text-gray-500">
                                        <rect width="20" height="16" x="2" y="4" rx="2"/>
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password">
                                Password
                            </label>
                            <div>
                                <Input id="password" type="password" placeholder="password"/>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock-keyhole text-gray-500">
                                        <circle cx="12" cy="16" r="1"/>
                                        <rect x="3" y="10" width="18" height="12" rx="2"/>
                                        <path d="M7 10V7a5 5 0 0 1 10 0v3"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword">
                                Password
                            </label>
                            <div>
                                <Input id="confirmPassword" type="password" placeholder="confirm password" />
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock-keyhole text-gray-500">
                                        <circle cx="12" cy="16" r="1"/>
                                        <rect x="3" y="10" width="18" height="12" rx="2"/>
                                        <path d="M7 10V7a5 5 0 0 1 10 0v3"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <a href="/forgot-password">
                                Forgot your password?
                            </a>
                        </div>
                        <Button >Next</Button>
                        
                        <p>
                            Already have an account?{' '}
                            <a>
                            Login
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;