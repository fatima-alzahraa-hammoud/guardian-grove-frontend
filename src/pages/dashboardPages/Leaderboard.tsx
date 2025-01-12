import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import Task from "/assets/images/task.png";
import Star from "/assets/images/stars.png";
import ProgressBar from "../../components/common/ProgressBar";
import { useSelector } from "react-redux";
import { selectFamilyId } from "../../redux/slices/userSlice";
import { requestApi } from "../../libs/requestApi";
import { requestMethods } from "../../libs/enum/requestMethods";

interface LeaderboardEntry {
    rank: number;
    familyName: string;
    stars: number;
    tasks: number;
    familyId: string;
    familyAvatar: string;
}

interface FamilyRank {
    familyName: string;
    familyAvatar: string;
    stars: number;
    tasks: number;
    rank: number;
    familyId: string;
}

const Leaderboard: React.FC = () => {
    const familyId = useSelector(selectFamilyId);
    const filters = ["Daily Stars", "Weekly Champions", "Monthly Achievers", "Yearly Legends"];
    const [activeFilter, setActiveFilter] = useState<string>("Daily Stars");
    const [dailyRanks, setDailyRanks] = useState<LeaderboardEntry[]>([]);
    const [weeklyRanks, setWeeklyRanks] = useState<LeaderboardEntry[]>([]);
    const [monthlyRanks, setMonthlyRanks] = useState<LeaderboardEntry[]>([]);
    const [yearlyRanks, setYearlyRanks] = useState<LeaderboardEntry[]>([]);
    const [familyRanks, setFamilyRanks] = useState<{
        daily: FamilyRank | null;
        weekly: FamilyRank | null;
        monthly: FamilyRank | null;
        yearly: FamilyRank | null;
    }>({
        daily: null,
        weekly: null,
        monthly: null,
        yearly: null
    });


    //change data depending on filter by default it is on daily
    //save and display family data

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await requestApi({
                    route: "/family/leaderboard",
                    method: requestMethods.GET,
                    body: familyId
                })
                if (response){
                    if(response.dailyTop10) setDailyRanks(response.dailyTop10);
                    if (response.weeklyTop10) setWeeklyRanks(response.weeklyTop10);
                    if(response.monthlyTop10) setMonthlyRanks(response.monthlyTop10);
                    if(response.yearlyTop10) setYearlyRanks(response.yearlyTop10);

                    setFamilyRanks({
                        daily: response.dailyFamilyRank || null,
                        weekly: response.weeklyFamilyRank || null,
                        monthly: response.monthlyFamilyRank || null,
                        yearly: response.yearlyFamilyRank || null
                    });
                }
                else{
                    console.log("failed to fetch leaderboard");
                }
            } catch (error) {
                console.log("Something wrong happened", error);
            }
        };
        fetchLeaderboard();
    }, [familyId]);

    const getFilteredRanks = () => {
        switch (activeFilter) {
            case "Daily Stars":
                return dailyRanks;
            case "Weekly Champions":
                return weeklyRanks;
            case "Monthly Achievers":
                return monthlyRanks;
            case "Yearly Legends":
                return yearlyRanks;
            default:
                return dailyRanks;
        }
    };

    const leaderboardData = getFilteredRanks();

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
                            className="flex items-center justify-between bg-[#301DAD21] rounded-lg mb-4 p-4 h-20"
                        >
                            {/* Rank Section */}
                            <div className="w-12 flex items-center justify-center">
                                {index < 3 ? (
                                    <span className="text-2xl">
                                        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                                    </span>
                                ) : (
                                    <span className="font-bold text-lg">{entry.rank}</span>
                                )}
                            </div>

                            {/* Avatar and Name Section */}
                            <div className="flex items-center min-w-[200px]">
                                <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
                                    <img
                                        src={
                                            entry.familyAvatar ||
                                            "/assets/images/avatars/family/avatar1.png"
                                        }
                                        alt={`${entry.familyName} Avatar`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="truncate text-base font-medium max-w-[150px]">
                                    {entry.familyName}
                                </span>
                            </div>

                            {/* Stars, Tasks, and View Button */}
                            <div className="flex items-center gap-16">
                                <div className="flex items-center gap-3 w-[50px] justify-between">
                                    <img src={Star} className="w-5 h-5" />
                                    <span className="font-semibold text-center">{entry.stars}</span>
                                </div>                                
                                <div className="flex items-center gap-3 w-[50px] justify-between">
                                    <img src={Task} className="w-5 h-5" />
                                    <span className="font-semibold text-center">{entry.tasks}</span>
                                </div>
                                <Button className="bg-[#179447] hover:bg-[#158640] text-white px-6 rounded-2xl">
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