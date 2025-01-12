import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import Task from "/assets/images/task.png";
import Star from "/assets/images/stars.png";
import ProgressBar from "../../components/common/ProgressBar";

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

                {/* Main Content */}
                <div className="mt-8 flex gap-8">
                    {/* Leaderboard List */}
                    <div className="flex-grow">
                        {leaderboardData.map((entry, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-around bg-[#301DAD21] rounded-lg mb-4 p-4"
                            >
                                <div className="w-8 h-8 flex items-center justify-center mr-10">
                                    {index < 3 ? (
                                        <span className="text-2xl">
                                        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                                        </span>
                                    ) : (
                                        <span className="font-bold text-lg">{entry.rank}</span>
                                    )}
                                </div>
                                {/* Avatar and name */}
                                <div className="flex items-center mr-14">
                                    <div className="w-10 h-10 bg-white rounded-full mr-4"></div>
                                    <span className="text-lg flex-grow">{entry.familyName}</span>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="flex items-center gap-2">
                                        <img src={Star} className="w-5 h-5" />
                                        <span className="font-semibold">{entry.stars}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <img src={Task} className="w-5 h-5" />
                                        <span className="font-semibold">{entry.tasks}</span>
                                    </div>
                                    <Button className="bg-[#179447] hover:bg-[#158640] text-white px-6 ml-10 rounded-2xl">
                                        View
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Side Progress */}
                    <div className="w-[350px] ml-[32px] font-poppins">
                        {/* Motivation section */}
                        <div className="bg-[#E3F2FD] rounded-lg p-6 mb-6 flex flex-col justify-between items-center h-[280px]">
                            <h3 className="text-xl font-bold mb-2 font-comic">Hooray!</h3>
                            <div className="mb-4 text-sm"><span className="font-bold font-poppins">Your Rank:</span> 8</div>
                            <p className="mb-2 text-sm">
                                You need just 5 more stars to reach Rank 7!
                            </p>
                            <p className="text-sm">
                                You can do it—keep completing your tasks and reach the next level! 🌟
                            </p>
                        </div>

                        {/* Family Progress section*/}
                        <div className="bg-[#E3F2FD] rounded-lg p-6 h-[280px] flex flex-col items-center">
                            <h3 className="text-xl font-bold mb-4 font-comic">Your Family Progress</h3>
                            <div className="space-y-2 w-[70%]">
                                <ProgressBar label="Goals" completed={10} total={15}/>
                                <ProgressBar label="Tasks" completed={53} total={60}/>
                                <ProgressBar label="Achievements" completed={50} total={150}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;