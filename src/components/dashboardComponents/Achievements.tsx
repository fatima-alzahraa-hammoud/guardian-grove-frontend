import React, { useState } from "react";
import sortImage from "../../assets/images/sort.png";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import AchievementCard from "../cards/achievementCard";
import notesImage from '../../assets/images/dashboard/notes.png';

const Achievements : React.FC = () => {

    const [activeFilter, setActiveFilter] = useState<string>("My Achievements");
    const filters = ["My Achievements", "Family Achievements", "Locked Achievements"];

    return(
        <div className="pt-20 h-screen flex flex-col">
            <div className="max-w-5xl px-6 flex-grow font-poppins">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="text-left">
                        <h2 className="text-xl font-bold font-comic">Achievements</h2>
                    </div>

                    <button className="flex items-center justify-between bg-[#3A8EBA] px-3 py-2 rounded-full hover:bg-[#347ea5] transition">
                        <img src={sortImage} alt="Sort" className="w-4 h-4 mr-1"/>
                        <span className="font-semibold text-sm ml-2 text-white">Sort</span>
                    </button>
                </div>

                {/* Filters Section */}
                <div className="flex flex-wrap gap-3 mt-10">
                    {filters.map((filter) => (
                        <Button
                            key={filter}
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

                {/* Item Cards Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
                        <AchievementCard
                            title="hello"
                            photo={notesImage}
                            description="mmmm"
                            starsReward={0}
                            coinsReward={0}
                            criteria="kdkjs"
                            isLocked= {true}
                        />
                </div>
            </div>
        </div>
    );
};

export default Achievements;