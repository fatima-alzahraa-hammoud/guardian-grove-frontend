import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import ProgressBar from "../../components/common/ProgressBar";
import { useSelector } from "react-redux";
import { selectFamilyId } from "../../redux/slices/userSlice";
import { requestApi } from "../../libs/requestApi";
import { requestMethods } from "../../libs/enum/requestMethods";
import LeaderboardItem from "../../components/dashboardComponents/LeaderboardItem";
import FamilyDialog, { FamilyDialogProps } from "../../components/common/FamilyDialog";
import { selectFamilyName, selectFamilyStars } from "../../redux/slices/familySlice";

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
    const [rankingUpMessage, setRankingUpMessage] = useState<string>("");
    const [motivationalMessage, setMotivationalMessage] = useState<string>("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedFamily, setSelectedFamily] = useState<FamilyDialogProps | null>(null);

    const familyName = useSelector(selectFamilyName);
    const totalStars = useSelector(selectFamilyStars);

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
    const [progressData, setProgressData] = useState<{
        totalTasks: number;
        completedTasks: number;
        totalGoals: number;
        completedGoals: number;
        totalAchievements: number;
        unlockedAchievements: number;
    } | null>(null);


    // fetch leaderboard data
    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await requestApi({
                    route: `/family/leaderboard?familyId=${familyId}`,
                    method: requestMethods.GET,
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
        if (familyId) fetchLeaderboard();
    }, [familyId]);

    // Fetch progress stats
    const fetchProgressStats = async () => {
        try {
            const timeFrame = activeFilter.split(" ")[0].toLowerCase();
            const response = await requestApi({
                route: "/family/familyProgressStats",
                method: requestMethods.POST,
                body: { familyId, timeFrame },
            });
            if (response) {
                setProgressData(response);
            } else {
                console.error("Failed to fetch progress stats");
            }
        } catch (error) {
            console.error("Error fetching progress stats:", error);
        }
    };

    useEffect(() => {
        fetchProgressStats();
    }, [activeFilter, familyId]);

    // get filtered ranks
    const getFilteredRanks = () => {
        let rankings: LeaderboardEntry[] = [];
        let currentFamilyRank: FamilyRank | null = null;

        switch (activeFilter) {
            case "Daily Stars":
                rankings = dailyRanks;
                currentFamilyRank = familyRanks.daily;
                break;
            case "Weekly Champions":
                rankings = weeklyRanks;
                currentFamilyRank = familyRanks.weekly;
                break;
            case "Monthly Achievers":
                rankings = monthlyRanks;
                currentFamilyRank = familyRanks.monthly;
                break;
            case "Yearly Legends":
                rankings = yearlyRanks;
                currentFamilyRank = familyRanks.yearly;
                break;
            default:
                rankings = dailyRanks;
                currentFamilyRank = familyRanks.daily;
        }

        // Check if family is not in top 10 but has a rank
        if (currentFamilyRank && !rankings.some(entry => entry.familyId === familyId)) {
            rankings.push(currentFamilyRank);
        }

        return rankings;
    };

    useEffect(() => {
        getMotivationalMessage();
    }, [familyRanks, activeFilter]); 

    // put messages based on ranks
    const getMotivationalMessage = () => {
        if (currentFamilyRank){
            let comparisonFamilyRank: LeaderboardEntry | null = null;

            if (currentFamilyRank.rank === 1){
                setRankingUpMessage("You've reached Rank 1! ");
                setMotivationalMessage("Keep it up and stay on top! You can do it—keep completing your tasks and stay there! 🌟");
            }
            else {
                if (currentFamilyRank.rank >= 10){
                    comparisonFamilyRank = leaderboardData.find(entry => entry.rank === 10) || null;
                    setMotivationalMessage("You're doing great, but there’s always room to grow! Keep going! 🚀")
                }
                else{
                    comparisonFamilyRank = leaderboardData.find(entry => entry.rank === currentFamilyRank.rank - 1) || null;
                    setMotivationalMessage("You're so close to the top! Keep up the great work! 💪")
                }

                if (comparisonFamilyRank) {
                    const starsNeeded = comparisonFamilyRank.stars - currentFamilyRank.stars;
                    const tasksNeeded = comparisonFamilyRank.tasks - currentFamilyRank.tasks;
        
                    if (starsNeeded > 0 || tasksNeeded > 0) {
                        setRankingUpMessage(`You need ${starsNeeded} more stars and ${tasksNeeded} more tasks to reach Rank ${currentFamilyRank.rank - 1}. Keep pushing!`);
                    } else {
                        setRankingUpMessage("You're so close to the top! Keep up the great work! 💪");
                    }
                }
        
            }
        }
    }

    const leaderboardData = getFilteredRanks();
    const period = activeFilter.split(" ")[0].toLowerCase();
    const currentFamilyRank = familyRanks[period as keyof typeof familyRanks];

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
                    <Button 
                        onClick={() => {
                            // Set family data and open the dialog
                            setSelectedFamily({
                                familyName: familyName || "Family",
                                rank: currentFamilyRank?.rank || null,
                                totalStars: totalStars,
                                wonChallenges: 30,
                                familyId: familyId,
                                open: true,
                                onOpenChange: (open) => setDialogOpen(open)
                            });
                            setDialogOpen(true);
                        }} 
                        className="flex items-center bg-[#3A8EBA] px-3 py-2 rounded-full hover:bg-[#347ea5] transition"
                    >
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
                        {leaderboardData.map((entry, index) => {
                            const isFamily = entry.familyId === familyId;
                            return (
                                <LeaderboardItem
                                    key={index}
                                    rank={entry.rank}
                                    familyName={entry.familyName}
                                    stars={entry.stars}
                                    tasks={entry.tasks}
                                    familyAvatar={entry.familyAvatar}
                                    isFamily={isFamily}
                                    rankStyle={isFamily ? "font-bold text-lg text-[#3A8EBA]" : "font-semibold"}
                                    onView={() => {
                                        // Set family data and open the dialog
                                        setSelectedFamily({
                                            familyName: entry.familyName,
                                            rank: entry.rank,
                                            totalStars: entry.stars,
                                            wonChallenges: entry.tasks, // Assuming tasks as wonChallenges
                                            familyId: entry.familyId,
                                            open: true,
                                            onOpenChange: (open) => setDialogOpen(open)
                                        });
                                        setDialogOpen(true);
                                    }}
                                />
                            );
                        })}

                    </div>

                    {/* Right Side Progress */}
                    <div className="w-[350px] ml-[32px] font-poppins">
                        {/* Motivation section */}
                        <div className="bg-[#E3F2FD] rounded-lg p-6 mb-6 flex flex-col justify-between items-center h-[280px]">
                            <h3 className="text-xl font-bold mb-2 font-comic">Hooray!</h3>
                            <div className="mb-4 text-sm"><span className="font-bold font-poppins">Your {period} Rank:</span> {currentFamilyRank?.rank}</div>
                            <p className="mb-4 text-sm">
                                {rankingUpMessage}
                            </p>
                            <p className="mb-2 text-sm">
                                {motivationalMessage}
                            </p>
                        </div>

                        {/* Family Progress section*/}
                        <div className="bg-[#E3F2FD] rounded-lg p-6 h-[280px] flex flex-col items-center">
                            <h3 className="text-xl font-bold mb-4 font-comic">Your Family Progress</h3>
                            <div className="space-y-2 w-[70%]">
                                <ProgressBar label="Tasks" completed={progressData?.completedTasks || 0} total={progressData?.totalTasks || 0}/>
                                <ProgressBar label="Goals" completed={progressData?.completedGoals || 0} total={progressData?.totalGoals || 0}/>
                                <ProgressBar label="Achievements" completed={progressData?.unlockedAchievements || 0} total={progressData?.totalAchievements || 0}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {dialogOpen && selectedFamily && (
                <FamilyDialog
                    {...selectedFamily}
                />
            )}
        </div>
    );
};

export default Leaderboard;