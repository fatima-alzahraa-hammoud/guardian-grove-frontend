import React from "react";

import logo from '/assets/logo/GuardianGrove_logo_Text.png';

const AddMembersQuestion :React.FC = () => {
    return(
        <div className="min-h-screen bg-[#F5F1FA] flex flex-col items-center justify-center p-4 relative overflow-hidden">
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
                </div>
            </div>
        </div>
    )
};

export default AddMembersQuestion;