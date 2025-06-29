'use client';

import React, { useEffect, useRef } from "react";
import "../styles/global.css";
import logo from '/assets/logo/GuardianGrove_logo_Text.png';
import img from '/assets/images/family-signup1.png';
import { gsap } from "gsap";
import FirstSignUpForm from "../components/SignUpComponents/FirstSignUpForm";
import { toast, ToastContainer } from "react-toastify";
import SecondSignUpForm from "../components/SignUpComponents/SecondSignUpForm";
import { TFirstStep, TSecondStep } from "../libs/types/signupTypes";
import { requestApi } from "../libs/requestApi";
import { requestMethods } from "../libs/enum/requestMethods";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/slices/authSlice";
import { setUser } from "../redux/slices/userSlice";
import { setFamily } from "../redux/slices/familySlice";
import { ApiError } from "../libs/types/ApiError";

const Signup : React.FC = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [step, setStep] = React.useState(1);
    const [firstStepData, setFirstStepData] = React.useState<TFirstStep | null>(null);

    function handleNext(data: TFirstStep): void {
        setFirstStepData(data);
        setStep(2);
    }

    const handleSubmit = async (secondStepData: TSecondStep) => {
        const combinedData = { ...firstStepData, ...secondStepData };
        console.log(combinedData)
        try {
            // Create FormData object
            const formData = new FormData();
            
            // Add all basic fields
            formData.append('name', combinedData.name || '');
            formData.append('email', combinedData.email || '');
            formData.append('password', combinedData.password || '');
            formData.append('confirmPassword', combinedData.confirmPassword || '');
            formData.append('gender', combinedData.gender || '');
            formData.append('role', combinedData.role || '');
            formData.append('familyName', combinedData.familyName || '');
            formData.append('birthday', combinedData.birthday ? combinedData.birthday.toISOString() : '');
            formData.append('interests', JSON.stringify(combinedData.interests || []));
            formData.append('agreeToTerms', String(combinedData.agreeToTerms || false));

            // Handle avatar - same pattern as AddMembersForm
            if (combinedData.avatar) {
                if (combinedData.avatar.startsWith('blob:')) {
                    try {
                        const blobResponse = await fetch(combinedData.avatar);
                        const avatarBlob = await blobResponse.blob();
                        formData.append('avatar', avatarBlob, 'avatar.png');
                    } catch (blobError) {
                        console.error('Error converting blob to file:', blobError);
                        toast.error('Error processing avatar image');
                        return;
                    }
                } else if (typeof combinedData.avatar === 'object' && (combinedData.avatar as object) instanceof File) {
                    formData.append('avatar', combinedData.avatar);
                } else if (typeof combinedData.avatar === 'string') {
                    formData.append('avatarPath', combinedData.avatar);
                }
            }

            // Handle family avatar - same pattern as AddMembersForm
            if (combinedData.familyAvatar) {
                if (combinedData.familyAvatar.startsWith('blob:')) {
                    try {
                        const blobResponse = await fetch(combinedData.familyAvatar);
                        const familyAvatarBlob = await blobResponse.blob();
                        formData.append('familyAvatar', familyAvatarBlob, 'family-avatar.png');
                    } catch (blobError) {
                        console.error('Error converting blob to file:', blobError);
                        toast.error('Error processing family avatar image');
                        return;
                    }
                } else if (typeof combinedData.familyAvatar === 'object' && (combinedData.familyAvatar as object) instanceof File) {
                    formData.append('familyAvatar', combinedData.familyAvatar);
                } else if (typeof combinedData.familyAvatar === 'string') {
                    formData.append('familyAvatarPath', combinedData.familyAvatar);
                }
            }

            // Debug: Log FormData contents
            console.log('FormData contents:');
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            const response = await requestApi({
                route: "/auth/register",
                method: requestMethods.POST,
                body: formData
            });

            if (response && response.token) {
                toast.success('SignUp successful!');
                dispatch(setToken(response.token));
                dispatch(setUser(response.user));
                dispatch(setFamily(response.family));
                navigate("/addMembersQuestion");
            } else {
                toast.error(response.error || 'SignUp failed!');
            }
        } catch (error: unknown) {
            const apiError = error as ApiError;
            toast.error(apiError.response?.data?.error || 'An unexpected error occurred');
        }
    }

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
                <div className="absolute left-0 top-0 text-xs text-left">
                    <ToastContainer position="top-left" />
                </div>
                {step === 1 && <FirstSignUpForm onNext={handleNext} />}
                {step === 2 && <SecondSignUpForm onSubmit={handleSubmit}/>}
            </div>
        </div>
    );
};

export default Signup;
