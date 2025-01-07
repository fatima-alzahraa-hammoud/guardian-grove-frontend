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
                const [lockedRes, unlockedRes] = await Promise.all([
                    requestApi({
                        route:"/achievements/locked",
                        method: requestMethods.GET
                    }),
                    requestApi({
                        route:"/achievements/unlocked",
                        method: requestMethods.GET
                    }),
                ]);
    
                const locked = lockedRes.data.achievements.map((ach: Achievement) => ({
                    ...ach,
                    isLocked: true,
                }));
                const unlocked = unlockedRes.data.achievements.map((ach: Achievement) => ({
                    ...ach,
                    isLocked: false,
                }));
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
                        <AchievementCard
                            title="hello"
                            photo={notesImage}
                            description="You’ve earned 500 stars! Keep shining and reaching for more milestones."
                            starsReward={3}
                            coinsReward={22}
                            criteria="Reach 500 stars!"
                            isLocked= {false}
                            unlockedAt= {new Date('1991-09-08')}
                        />

                        <AchievementCard
                            title="hello"
                            photo={notesImage}
                            description="You’ve earned 500 stars! Keep shining and reaching for more milestones."
                            starsReward={3}
                            coinsReward={22}
                            criteria="Reach 500 stars!"
                            isLocked= {true}
                            unlockedAt= {new Date('1991-09-08')}
                        />
                </div>
            </div>
        </div>
    );
};

export default Achievements;