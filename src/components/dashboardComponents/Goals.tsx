import React, { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";


interface FamilyTreeProps {
    collapsed: boolean;
}

const Goals : React.FC<FamilyTreeProps> = ({collapsed}) => {

    const filters = ["Goals", "Adventures"];
    const [activeFilter, setActiveFilter] = useState<string>("Goals");

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

                {/* Filters Section */}
                <div className="flex flex-wrap gap-3 mt-10">
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
            </div>
        </div>
    );
};

export default Goals;