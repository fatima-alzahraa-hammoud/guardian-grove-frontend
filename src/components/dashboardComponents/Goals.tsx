import React from "react";


interface FamilyTreeProps {
    collapsed: boolean;
}

const Goals : React.FC<FamilyTreeProps> = ({collapsed}) => {
    return(
        <div className={`pt-24 min-h-screen flex flex-col items-center`}>
            <div className={`w-full flex-grow font-poppins ${ collapsed ? "mx-auto max-w-6xl" : "max-w-5xl" }`} >
                
                {/* Header */}
                <div className="text-left">
                    <h2 className="text-xl font-bold font-comic">Conquer Goals, Embark on Adventures</h2>
                    <p className="text-gray-600 mt-2 text-base">
                        Experience exciting adventures, accomplish meaningful goals, and rise to thrilling challenges together!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Goals;