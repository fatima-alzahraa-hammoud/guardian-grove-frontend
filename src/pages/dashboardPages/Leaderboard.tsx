import React, { useCallback, useEffect, useState } from "react";
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
import { motion, AnimatePresence } from "framer-motion";

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

    const [loading, setLoading] = useState(true);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
                duration: 0.6
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        }
    };

    const fadeInUpVariants = {
        hidden: {
            opacity: 0,
            y: 30
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    // Floating particles background
    const FloatingParticles = () => {
        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 6 }).map((_, i) => {
                    const size = Math.random() * 4 + 2;
                    const color = ["#3A8EBA20", "#FDE4CF20", "#E3F2FD20"][Math.floor(Math.random() * 3)];
                    const left = `${Math.random() * 100}%`;
                    const animDuration = 25 + Math.random() * 20;
                    const delay = Math.random() * -30;
                    
                    return (
                        <motion.div
                            key={i}
                            className="absolute rounded-full"
                            style={{
                                width: size,
                                height: size,
                                backgroundColor: color,
                                left,
                                top: "110%",
                            }}
                            initial={{ top: "110%" }}
                            animate={{ top: "-10%" }}
                            transition={{
                                duration: animDuration,
                                repeat: Infinity,
                                delay,
                                ease: "linear"
                            }}
                        />
                    );
                })}
            </div>
        );
    };

    // fetch leaderboard data
    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                setLoading(true);
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
            } finally {
                setLoading(false);
            }
        };
        if (familyId) fetchLeaderboard();
    }, [familyId]);

    // Fetch progress stats
    const fetchProgressStats = useCallback(async () => {
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
    }, [activeFilter, familyId]);

    useEffect(() => {
        fetchProgressStats();
    }, [fetchProgressStats]);

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

    const leaderboardData = getFilteredRanks();
    const period = activeFilter.split(" ")[0].toLowerCase();
    const currentFamilyRank = familyRanks[period as keyof typeof familyRanks];

    const getMotivationalMessage = useCallback(() => {
        if (currentFamilyRank){
            let comparisonFamilyRank: LeaderboardEntry | null = null;

            if (currentFamilyRank.rank === 1){
                setRankingUpMessage("You've reached Rank 1! ");
                setMotivationalMessage("Keep it up and stay on top! You can do it—keep completing your tasks and stay there! 🌟");
            }
            else {
                if (currentFamilyRank.rank >= 10){
                    comparisonFamilyRank = leaderboardData.find(entry => entry.rank === 10) || null;
                    setMotivationalMessage("You're doing great, but there's always room to grow! Keep going! 🚀")
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
    }, [currentFamilyRank, leaderboardData]);

    useEffect(() => {
        getMotivationalMessage();
    }, [getMotivationalMessage]);

    return (
        <div className="pt-28 min-h-screen flex justify-center relative overflow-hidden">
            {/* Background particles */}
            <FloatingParticles />
            
            <div className="max-w-6xl w-full flex-grow font-poppins relative z-10">
                {/* Header */}
                <motion.div 
                    className="text-left mb-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-2xl font-bold font-comic text-gray-800 mb-2">
                        Family Leaderboard
                    </h2>
                    <div className="h-1 w-24 bg-[#3A8EBA] rounded-full mb-4" />
                    <div className="flex items-center justify-between">
                        <p className="text-gray-600 text-base">
                            Shine together! See how your family ranks among others.
                        </p>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                        >
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
                                className="flex items-center bg-[#3A8EBA] px-4 py-3 rounded-full hover:bg-[#347ea5] transition-all duration-300 shadow-lg"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <p className="text-sm font-semibold text-white">
                                        View Your Achievements
                                    </p>
                                </motion.div>
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Filters Section */}
                <motion.div 
                    className="flex flex-wrap gap-3 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    {filters.map((filter, index) => (
                        <motion.div
                            key={filter}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                        >
                            <Button
                                onClick={() => setActiveFilter(filter)}
                                variant="secondary"
                                className={cn(
                                    "bg-[#E3F2FD] hover:bg-[#d7edfd] w-44 text-black font-medium transition-all duration-300 px-6 py-3 rounded-full border border-[#3A8EBA]/20",
                                    activeFilter === filter && "bg-[#3A8EBA] text-white hover:bg-[#347ea5] border-[#3A8EBA]"
                                )}
                            >
                                {filter}
                            </Button>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Loading State */}
                {loading && (
                    <motion.div 
                        className="flex justify-center items-center py-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <motion.div
                            className="w-12 h-12 border-4 border-[#E3F2FD] border-t-[#3A8EBA] rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                    </motion.div>
                )}

                {/* Main Content */}
                {!loading && (
                    <motion.div 
                        className="flex gap-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        {/* Leaderboard List */}
                        <motion.div 
                            className="flex-grow"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <AnimatePresence mode="wait">
                                {leaderboardData.map((entry, index) => {
                                    const isFamily = entry.familyId === familyId;
                                    return (
                                        <motion.div
                                            key={`${entry.familyId}-${activeFilter}`}
                                            variants={itemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ 
                                                delay: index * 0.1,
                                                duration: 0.5,
                                                ease: "easeOut"
                                            }}
                                            whileHover={{ 
                                                scale: 1.02,
                                                transition: { duration: 0.2 }
                                            }}
                                            className="mb-3"
                                        >
                                            <LeaderboardItem
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
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </motion.div>

                        {/* Right Side Progress */}
                        <motion.div 
                            className="w-[350px] ml-[32px] font-poppins"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                        >
                            {/* Motivation section */}
                            <motion.div 
                                className="bg-[#E3F2FD] rounded-lg p-6 mb-6 flex flex-col justify-between items-center h-[280px] shadow-lg"
                                variants={fadeInUpVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: 0.7 }}
                                whileHover={{ 
                                    scale: 1.02,
                                    boxShadow: "0 10px 25px rgba(58, 142, 186, 0.15)",
                                    transition: { duration: 0.3 }
                                }}
                            >
                                <motion.h3 
                                    className="text-xl font-bold mb-2 font-comic"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8, duration: 0.5 }}
                                >
                                    Hooray!
                                    <motion.span
                                        className="inline-block ml-2"
                                        animate={{ 
                                            rotate: [0, 15, -15, 0],
                                            scale: [1, 1.2, 1]
                                        }}
                                        transition={{ 
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatDelay: 3
                                        }}
                                    >
                                        🎉
                                    </motion.span>
                                </motion.h3>
                                
                                <motion.div 
                                    className="mb-4 text-sm"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.9, duration: 0.5 }}
                                >
                                    <span className="font-bold font-poppins">Your {period} Rank:</span> 
                                    <motion.span
                                        className="ml-2 text-[#3A8EBA] font-bold text-lg"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 1, type: "spring", stiffness: 200 }}
                                    >
                                        {currentFamilyRank?.rank}
                                    </motion.span>
                                </motion.div>
                                
                                <motion.p 
                                    className="mb-4 text-sm text-center"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.1, duration: 0.5 }}
                                >
                                    {rankingUpMessage}
                                </motion.p>
                                
                                <motion.p 
                                    className="mb-2 text-sm text-center"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.2, duration: 0.5 }}
                                >
                                    {motivationalMessage}
                                </motion.p>
                            </motion.div>

                            {/* Family Progress section*/}
                            <motion.div 
                                className="bg-[#E3F2FD] rounded-lg p-6 h-[280px] flex flex-col items-center shadow-lg"
                                variants={fadeInUpVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: 0.8 }}
                                whileHover={{ 
                                    scale: 1.02,
                                    boxShadow: "0 10px 25px rgba(58, 142, 186, 0.15)",
                                    transition: { duration: 0.3 }
                                }}
                            >
                                <motion.h3 
                                    className="text-xl font-bold mb-4 font-comic"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.9, duration: 0.5 }}
                                >
                                    Your Family Progress
                                    <motion.span
                                        className="inline-block ml-2"
                                        animate={{ 
                                            y: [-2, 2, -2],
                                            rotate: [0, 5, -5, 0]
                                        }}
                                        transition={{ 
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        📊
                                    </motion.span>
                                </motion.h3>
                                
                                <motion.div 
                                    className="space-y-2 w-[70%]"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1, duration: 0.6 }}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1.1, duration: 0.5 }}
                                    >
                                        <ProgressBar 
                                            label="Tasks" 
                                            completed={progressData?.completedTasks || 0} 
                                            total={progressData?.totalTasks || 0}
                                        />
                                    </motion.div>
                                    
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1.2, duration: 0.5 }}
                                    >
                                        <ProgressBar 
                                            label="Goals" 
                                            completed={progressData?.completedGoals || 0} 
                                            total={progressData?.totalGoals || 0}
                                        />
                                    </motion.div>
                                    
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1.3, duration: 0.5 }}
                                    >
                                        <ProgressBar 
                                            label="Achievements" 
                                            completed={progressData?.unlockedAchievements || 0} 
                                            total={progressData?.totalAchievements || 0}
                                        />
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
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