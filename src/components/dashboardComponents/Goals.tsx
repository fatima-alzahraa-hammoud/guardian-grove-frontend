import React, { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import sortImage from "/assets/images/sort.png";
import magicImage from "/assets/images/magic-wand.png";

interface FamilyTreeProps {
    collapsed: boolean;
}

const Goals : React.FC<FamilyTreeProps> = ({collapsed}) => {

    const filters = ["Goals", "Adventures"];
    const [activeFilter, setActiveFilter] = useState<string>("Goals");

    const [status, setStatus] = useState<'In Progress | Completed'>();

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

                {/* Filters and Buttons */}
                <div className="flex items-center justify-between mt-10">
                    {/* Filters Section */}
                    <div className="flex flex-wrap gap-3">
                        {filters.map((filter) => (
                            <Button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                variant="secondary"
                                className={cn(
                                    "bg-[#E3F2FD] hover:bg-[#d7edfd] w-44 text-black",
                                    activeFilter === filter && "bg-[#3A8EBA] text-white hover:bg-[#347ea5]"
                                )}
                            >
                                {filter}
                            </Button>
                        ))}
                    </div>

                    {/* Sort Button */}
                    <div className="flex items-center space-x-3">
                        <Button className="flex items-center bg-[#F09C14] px-3 py-2 rounded-full hover:bg-[#EB9915] transition">
                            <img src={sortImage} alt="Sort" className="w-4 h-4 mr-1" />
                            <span className="text-sm font-semibold text-white">Sort</span>
                        </Button>
                        <Button className="flex items-center bg-[#179447] px-3 py-2 rounded-full hover:bg-[#158C43] transition">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus text-white">
                                <path d="M5 12h14"/><path d="M12 5v14"/>
                            </svg>                            
                            <span className="text-sm font-semibold text-white">Add Goal</span>
                        </Button>
                        <Button className="flex items-center bg-[#3A8EBA] px-3 py-2 rounded-full hover:bg-[#326E9F] transition">
                            <img src={magicImage} alt="Sort" className="w-4 h-4 mr-1" />
                            <span className="text-sm font-semibold text-white">Generate Goal</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Goals;