import React from "react";
import logo from '/assets/logo/GuardianGrove_logo_Text.png';
import familyBondingImage from '/assets/images/family-bonding.png';
import leafImage from '/assets/images/leaf.png';
import { Button } from "../components/ui/button";
import "../styles/addMember.css";

const AddMembers :React.FC = () => {
    return(
        <div className="h-screen bg-[#F5F1FA] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Logo */}
            <div className="absolute top-10 left-10">
                <img
                    src={logo}
                    alt="Guardian Grove Logo"
                    width={120}
                    height={120}
                />
            </div>

            {/* Question */}
            <div className="max-w-2xl w-full backdrop-blur-sm p-6 space-y-6 rounded-2xl">
                <div className="space-y-4 text-center">
                    <h1 className="text-xl md:text-2xl font-bold font-comic">
                        Would you like to create your family now?
                    </h1>
                    <p className="text-gray-600 font-poppins">
                        Adding your family will unlock tailored experiences and features just for them.
                    </p>

                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden my-6">
                        <img
                            src={familyBondingImage}
                            alt="Happy family illustration"
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-around items-center">
                    <Button 
                        variant="secondary"
                        className="bg-[#FF4A90] hover:bg-[#f14687] text-white rounded-full px-10 py-1"
                    >
                        No
                    </Button>
                    <Button
                        variant="secondary"
                        className="bg-[#3A8EBA] hover:bg-[#347ea5] text-white rounded-full px-10 py-1"
                    >
                        Yes
                    </Button>
                </div>

                {/* Note section*/}
                <div className="pt-4 flex gap-3 items-center justify-center">
                    <p className="font-poppins text-sm">You can always add your children later from your profile settings.</p>
                    <img src={leafImage} alt="" className="w-4 h-4"/>
                </div>
            </div>
        </div>
    )
};

export default AddMembers;