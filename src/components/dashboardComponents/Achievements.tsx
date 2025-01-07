import React, { useEffect, useState } from "react";
import sortImage from "/assets/images/sort.png";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import AchievementCard from "../cards/AchievementCard";
import notesImage from '/assets/images/dashboard/notes.png';
import { requestApi } from "../../libs/requestApi";
import { requestMethods } from "../../libs/enum/requestMethods";
import { toast } from "react-toastify";

interface Achievement {
    _id: string;
    title: string;
    description: string;
    photo: string;
    starsReward: number;
    coinsReward: number;
    criteria: string;
    isLocked: boolean;
    unlockedAt?: Date;
    type: "personal" | "family";
}


const Achievements : React.FC = () => {

    const [activeFilter, setActiveFilter] = useState<string>("My Achievements");
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [filteredAchievements, setFilteredAchievements] = useState<Achievement[]>([]);
    const filters = ["My Achievements", "Family Achievements", "Locked Achievements"];

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const [lockedAchievements, unlockedAchievements] = await Promise.all([
                    await requestApi({
                        route:"/achievements/locked",
                        method: requestMethods.GET
                    }),
                    await requestApi({
                        route:"/achievements/unlocked",
                        method: requestMethods.GET
                    }),
                ]);
    
                const locked = lockedAchievements?.achievements?.map((ach: Achievement) => ({
                    ...ach,
                    isLocked: true,
                })) || [];
    
                const unlocked = unlockedAchievements?.achievements?.map((ach: Achievement) => ({
                    ...ach,
                    isLocked: false,
                })) || [];    

                console.log(locked);
                setAchievements([...locked, ...unlocked]);
                handleFilterChange(activeFilter);
            } catch (error) {
                console.error("Error fetching achievements:", error);
                toast.error("Failed to load achievements. Please try again later.");
            }
        }

        fetchAchievements();
    }, []);

    const handleFilterChange = (filter: string) => {

        setActiveFilter(filter);
        if (filter === "My Achievements") {
            setFilteredAchievements(achievements.filter((ach) => ach.type === "personal" && !ach.isLocked));
        } else if (filter === "Family Achievements") {
            setFilteredAchievements(achievements.filter((ach) => ach.type === "family" && !ach.isLocked));
        } else {
            setFilteredAchievements(achievements.filter((ach) => ach.isLocked));
        }
    };


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
                            onClick={() => handleFilterChange(filter)}
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-5">
                    {filteredAchievements.length > 0 ? (
                        filteredAchievements.map((achievement) => (
                            <AchievementCard
                                key={achievement._id}
                                title={achievement.title}
                                photo={achievement.photo || notesImage}
                                description={achievement.description}
                                starsReward={achievement.starsReward}
                                coinsReward={achievement.coinsReward}
                                criteria={achievement.criteria}
                                isLocked={achievement.isLocked}
                                unlockedAt={achievement.unlockedAt}
                            />
                        ))
                    ) : (
                        <p className="text-center text-sm">No achievements found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Achievements;