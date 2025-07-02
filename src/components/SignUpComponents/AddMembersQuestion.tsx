import React from "react";
import familyBondingImage from '/assets/images/family-bonding.png';
import leafImage from '/assets/images/leaf.png';
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const AddMembersQuestion :React.FC = () => {

    const navigate = useNavigate();

    return(
        
        <>
            {/* Question */}
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
                    onClick={() => navigate("/dashboard/")}
                    variant="secondary"
                    className="bg-[#FF4A90] hover:bg-[#f14687] text-white rounded-full px-10 py-1"
                >
                    No
                </Button>
                <Button
                    onClick={() => navigate("/addMembers")}
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
        </>
    )
};

export default AddMembersQuestion;