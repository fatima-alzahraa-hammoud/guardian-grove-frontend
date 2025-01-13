import React from "react";

interface FamilyTreeProps {
    collapsed: boolean;
}
  
const FamilyTree : React.FC<FamilyTreeProps> = ({collapsed}) => {
    return(
        <div className={`pt-24 min-h-screen flex justify-center`}>
            <div className={`w-full flex-grow font-poppins ${ collapsed ? "mx-auto max-w-5xl" : "max-w-5xl" }`} >
                
                {/* Header */}
                <div className="text-left">
                    <h2 className="text-xl font-bold font-comic">Family Tree</h2>
                    <p className="text-gray-600 mt-2 text-base">
                        Click on the family member to view their progress
                    </p>
                </div>

            </div>
        </div>
    );
};

export default FamilyTree;