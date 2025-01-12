import React from "react";

import logo from '/assets/logo/GuardianGrove_logo_Text.png';

const AddMembers :React.FC = () => {
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
        </div>
    )
};

export default AddMembers;