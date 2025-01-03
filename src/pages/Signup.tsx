'use client';

import React, { useEffect, useRef } from "react";
import "../styles/global.css";
import logo from '../assets/logo/GuardianGrove_logo_Text.png';
import img from '../assets/images/family-signup1.png';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";

const Signup : React.FC = () => {

    const { 
        register, 
        handleSubmit, 
        formState: { errors },
        reset
    } = useForm();

    const onSubmit = async (data: FieldValues) =>{
        console.log("Data submitted!");

        reset();
    }

    const navigate = useNavigate();

    const logoRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logoRef.current) {
            gsap.fromTo(logoRef.current, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 1, delay: 0.2, ease: "power2.out" });
        }
        if (imgRef.current) {
            gsap.fromTo(imgRef.current, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 1, delay: 0.8, ease: "power2.out" });
        }
    }, []);

    return (
        <div className="h-screen flex flex-col lg:flex-row p-0 m-0 font-poppins">
            <div ref={imgRef} className="lg:w-1/2 flex-1 relative overflow-hidden bg-gradient-to-b from-purple-50 to-blue-50">
                <img src={img} alt="" className="object-cover w-full h-full" />
            </div>
            <div className="lg:w-1/2 flex flex-col items-center justify-start p-8 lg:p-16">
                <div ref={logoRef} className="relative w-full flex justify-start right-12 bottom-12">
                    <img src={logo} alt="Guardian Grove Logo" width={100} height={100} />
                </div>
                
            </div>
        </div>
    );
};

export default Signup;