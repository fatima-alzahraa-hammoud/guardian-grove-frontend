import React from "react";
import logo from '/assets/logo/GuardianGrove_logo_Text.png';
import familyBonding from '/assets/images/family-bonding.png';
import { Button } from "../components/ui/button";
import "../styles/addMember.css";

const AddMembers :React.FC = () => {
    return(
        <div className="h-screen bg-[#F5F1FA] flex flex-col items-center justify-center p-4 relative overflow-hidden">
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
                            src={familyBonding}
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
                        className="bg-[#3A8EBA] hover:bg-[#347ea5] rounded-full px-10 py-1"
                    >
                        Yes
                    </Button>
                </div>
            </div>
        </div>
    )
};

export default AddMembers;