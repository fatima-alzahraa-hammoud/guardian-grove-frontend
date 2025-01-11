import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
interface LeaderboardEntry {
    rank: number;
    familyName: string;
    stars: number;
    tasks: number;
}

const Leaderboard: React.FC = () => {
    const filters = ["Daily Stars", "Weekly Champions", "Monthly Achievers", "Yearly Legends"];
    const [activeFilter, setActiveFilter] = useState<string>("Daily Stars");

    const leaderboardData: LeaderboardEntry[] = [
        { rank: 1, familyName: "Family Name", stars: 200, tasks: 20 },
        { rank: 2, familyName: "Family Name", stars: 190, tasks: 20 },
        { rank: 3, familyName: "Family Name", stars: 190, tasks: 19 },
        { rank: 4, familyName: "Family Name", stars: 190, tasks: 17 },
        { rank: 5, familyName: "Family Name", stars: 170, tasks: 17 },
        { rank: 6, familyName: "Family Name", stars: 160, tasks: 17 },
        { rank: 6, familyName: "Family Name", stars: 160, tasks: 17 },
    ];

    return (
        <div className="pt-28 min-h-screen flex justify-center">
            <div className="max-w-6xl w-full flex-grow font-poppins">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="text-left">
                        <h2 className="text-2xl font-bold font-comic">Family Leaderboard</h2>
                        <p className="text-gray-600 mt-2 text-base">
                            Shine together! See how your family ranks among others.
                        </p>
                    </div>
                    <Button className="flex items-center bg-[#3A8EBA] px-3 py-2 rounded-full hover:bg-[#347ea5] transition">
                        <p className="text-sm font-semibold text-white">
                            View Your Achievements
                        </p>
                    </Button>
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

export default Leaderboard;