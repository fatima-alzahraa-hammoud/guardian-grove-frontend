import React from "react";
import { useSelector } from "react-redux";
import { selectFamilyMembers } from "../../redux/slices/familySlice";
import FamilyMemberCard from "../cards/FamilyMemberCard";

interface FamilyTreeProps {
    collapsed: boolean;
}

const parentColorPalette = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-teal-500",
    "bg-rose-500",
];

const childColorPalette = [
    "bg-green-400",
    "bg-yellow-400",
    "bg-red-400",
    "bg-pink-400",
    "bg-indigo-400",
    "bg-orange-400",
    "bg-cyan-400",
];

  
const FamilyTree : React.FC<FamilyTreeProps> = ({collapsed}) => {

    const familyMembers = useSelector(selectFamilyMembers);

    const parents = familyMembers.filter(member => member.role === "parent");
    const children = familyMembers.filter(member => member.role === "child");


    return(
        <div className={`pt-24 min-h-screen flex flex-col items-center`}>
            <div className={`w-full flex-grow font-poppins ${ collapsed ? "mx-auto max-w-6xl" : "max-w-5xl" }`} >
                
                {/* Header */}
                <div className="text-left">
                    <h2 className="text-xl font-bold font-comic">Family Tree</h2>
                    <p className="text-gray-600 mt-2 text-base">
                        Click on the family member to view their progress
                    </p>
                </div>

                {/* Parents Row */}
                <div className="mt-10 mb-14">
                    <div className="flex justify-center space-x-20 mb-12">
                        {parents.map((parent, index) => (
                            <FamilyMemberCard
                                key={parent.name}
                                member={parent}
                                colorClass={parentColorPalette[index % parentColorPalette.length]}
                            />
                        ))}
                    </div>
                </div>

                {/* Children Row */}
                <div>
                    <div className="flex flex-wrap justify-center gap-x-10 gap-y-10">
                        {children.map((child, index) => (
                            <FamilyMemberCard
                                key={child.name}
                                member={child}
                                colorClass={childColorPalette[index % childColorPalette.length]}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FamilyTree;