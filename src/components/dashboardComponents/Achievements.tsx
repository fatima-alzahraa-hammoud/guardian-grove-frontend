import React, { useCallback, useEffect, useState } from "react";
import sortImage from "/assets/images/sort.png";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import AchievementCard from "../cards/AchievementCard";
import notesImage from '/assets/images/dashboard/notesBlack.png';
import { requestApi } from "../../libs/requestApi";
import { requestMethods } from "../../libs/enum/requestMethods";
import { toast } from "react-toastify";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

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

interface AchievementsProps {
  collapsed: boolean;
}

// Floating background elements with vibrant theme colors (same as AINotifications)
const FloatingElements = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Animated gradient orbs using vibrant theme colors */}
            {Array.from({ length: 4 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full blur-3xl"
                    style={{
                        width: `${100 + i * 50}px`,
                        height: `${100 + i * 50}px`,
                        left: `${10 + i * 25}%`,
                        top: `${20 + i * 15}%`,
                    }}
                    animate={{
                        x: [0, 50, -30, 0],
                        y: [0, -30, 20, 0],
                        scale: [1, 1.2, 0.8, 1],
                    }}
                    transition={{
                        duration: 15 + i * 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 2
                    }}
                />
            ))}

            {/* Floating particles with vibrant colors */}
            {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                    key={`particle-${i}`}
                    className="absolute w-2 h-2 rounded-full opacity-30"
                    style={{
                        backgroundColor: [
                            "#3A8EBA", // Primary blue
                            "#F09C14", // Orange
                            "#179447", // Green
                            "#8B5CF6"  // Purple
                        ][i % 4],
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -20, 0],
                        opacity: [0.2, 0.6, 0.2],
                    }}
                    transition={{
                        duration: 4 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
};

// Simple Enhanced Empty State
const EmptyState = ({ activeFilter }: { activeFilter: string }) => {
    return (
        <motion.div 
            className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-300px)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >

            <motion.h3 
                className="text-2xl font-bold text-[#3A8EBA] mb-4 font-comic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
                No {activeFilter.replace(" Achievements", "")} Yet!
            </motion.h3>

            <motion.p 
                className="text-gray-600 text-base mb-8 max-w-md mx-auto leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
            >
                Start completing exciting tasks and challenges to unlock your first achievement.
                <br />
                <span className="font-semibold text-[#3A8EBA]">You're capable of greatness!</span>
            </motion.p>

            <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                >
                    <motion.img
                        src="/assets/images/motivation.png"
                        alt="Motivational Illustration"
                        className="w-36 h-36 mb-8 mx-auto"
                        animate={{
                            y: [0, -8, 0],
                            rotate: [0, 1, -1, 0]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            onClick={() => console.log("Request AI for tasks")}
                            className="bg-[#3A8EBA] text-white px-6 py-3 rounded-full hover:bg-[#347ea5] transition-colors duration-300 font-semibold"
                        >
                            <span className="mr-2">🤖</span>
                            Ask AI for Tasks
                        </Button>
                    </motion.div>
                </motion.div>
        </motion.div>
    );
};

const Achievements : React.FC<AchievementsProps> = ({collapsed}) => {

    const [activeFilter, setActiveFilter] = useState<string>("My Achievements");
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [filteredAchievements, setFilteredAchievements] = useState<Achievement[]>([]);
    const filters = ["My Achievements", "Family Achievements", "Locked Achievements"];
    const [sortBy, setSortBy] = useState<keyof Achievement | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [loading, setLoading] = useState(true);

    const sortAchievements = useCallback((data: Achievement[], property: keyof Achievement) => {
        if (!data.length) return;
        
        const sorted = [...data].sort((a, b) => {
            const valueA = a[property];
            const valueB = b[property];

            if (typeof valueA === "string" && typeof valueB === "string") {
                return sortOrder === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
            }

            if (typeof valueA === "number" && typeof valueB === "number") {
                return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
            }

            if (valueA instanceof Date && valueB instanceof Date) {
                return sortOrder === "asc" ? +valueA - +valueB : +valueB - +valueA;
            }

            return 0;
        });

        setFilteredAchievements(sorted);
    }, [sortOrder]);

    const handleFilterChange = useCallback((filter: string, achievementsData: Achievement[]) => {
        setActiveFilter(filter);
        let filtered;
        if (filter === "My Achievements") {
            filtered = achievementsData.filter((ach) => ach.type === "personal" && !ach.isLocked);
        } else if (filter === "Family Achievements") {
            filtered = achievementsData.filter((ach) => ach.type === "family" && !ach.isLocked);
        } else {
            filtered = achievementsData.filter((ach) => ach.isLocked);
        }

        if (sortBy) {
            sortAchievements(filtered, sortBy);
        } else {
            setFilteredAchievements(filtered);
        }
    }, [sortBy, sortAchievements]);

    // Optimized fetch function with better error handling and performance
    const fetchAchievements = useCallback(async () => {
        try {
            setLoading(true);
            
            // Use Promise.allSettled for better error handling
            const [lockedResult, unlockedResult] = await Promise.allSettled([
                requestApi({
                    route: "/achievements/locked",
                    method: requestMethods.GET
                }),
                requestApi({
                    route: "/achievements/unlocked", 
                    method: requestMethods.GET
                })
            ]);

            const locked = lockedResult.status === 'fulfilled' 
                ? (lockedResult.value?.achievements?.map((ach: Achievement) => ({
                    ...ach,
                    isLocked: true,
                })) || [])
                : [];

            const unlocked = unlockedResult.status === 'fulfilled'
                ? (unlockedResult.value?.achievements?.map((ach: Achievement) => ({
                    ...ach,
                    isLocked: false,
                })) || [])
                : [];

            // Log any failed requests but don't fail completely
            if (lockedResult.status === 'rejected') {
                console.warn("Failed to fetch locked achievements:", lockedResult.reason);
            }
            if (unlockedResult.status === 'rejected') {
                console.warn("Failed to fetch unlocked achievements:", unlockedResult.reason);
            }

            const allAchievements = [...locked, ...unlocked];
            setAchievements(allAchievements);
            
            // Apply current filter to new data
            handleFilterChange(activeFilter, allAchievements);

        } catch (error) {
            console.error("Error fetching achievements:", error);
            toast.error("Failed to load achievements. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [activeFilter, handleFilterChange]);

    // Fetch only once on mount
    useEffect(() => {
        fetchAchievements();
    }, []); // Remove dependencies to prevent unnecessary re-fetching

    // Separate effect for filter changes (no API calls)
    useEffect(() => {
        if (achievements.length > 0) {
            handleFilterChange(activeFilter, achievements);
        }
    }, [activeFilter, achievements, handleFilterChange]);

    const handleFilterClick = useCallback((filter: string) => {
        // This will trigger the useEffect above, no need to refetch
        setActiveFilter(filter);
    }, []);

    const handleSortSelect = (property: keyof Achievement) => {
        setSortBy(property);
        sortAchievements(filteredAchievements, property as keyof Achievement);
    };

    const toggleSortOrder = () => {
        const newOrder = (sortOrder === "asc" ? "desc" : "asc");
        setSortOrder(newOrder);
    };

    useEffect(() => {
        if (sortBy) {
            sortAchievements(filteredAchievements, sortBy);
        }
    }, [sortOrder, sortBy, filteredAchievements, sortAchievements]);

    // Sort icons mapping
    const sortIcons: Record<string, string> = {
        "starsReward": "⭐",
        "coinsReward": "🪙",
        "title": "📝",
        "unlockedAt": "📅"
    };

    return(
        <div className="pt-24 min-h-screen flex justify-center relative overflow-hidden">
            {/* Floating Background Elements */}
            <FloatingElements />
            
            <div className={`w-full flex-grow font-poppins mx-auto px-4 relative z-10 ${ collapsed ? "max-w-6xl" : "max-w-5xl" }`} >
                
                {/* Header - Clean and Minimal */}
                <motion.div 
                    className="text-left mb-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-2xl font-bold font-comic text-gray-800 mb-2">
                        Achievements Gallery
                    </h2>
                    <div className="h-1 w-24 bg-[#3A8EBA] rounded-full mb-4" />
                    <p className="text-gray-600 text-base">
                        Celebrate your journey and unlock new milestones
                    </p>
                </motion.div>

                {/* Controls Section */}
                <motion.div 
                    className="flex items-center justify-between mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    {/* Filters Section */}
                    <div className="flex flex-wrap gap-3">
                        {filters.map((filter, index) => (
                            <motion.div
                                key={filter}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                            >
                                <Button
                                    onClick={() => handleFilterClick(filter)}
                                    variant="secondary"
                                    className={cn(
                                        "bg-[#E3F2FD] hover:bg-[#d7edfd] text-gray-700 font-medium transition-all duration-300 px-6 py-3 rounded-full border border-[#3A8EBA]/20",
                                        activeFilter === filter &&
                                            "bg-[#3A8EBA] text-white hover:bg-[#347ea5] border-[#3A8EBA]"
                                    )}
                                >
                                    {filter}
                                </Button>
                            </motion.div>
                        ))}
                    </div>

                    {/* Sort Dropdown */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    className="flex items-center bg-[#3A8EBA] px-4 py-3 rounded-full hover:bg-[#347ea5] transition-colors duration-300 border border-[#3A8EBA]/20"
                                >
                                    <img 
                                        src={sortImage} 
                                        alt="Sort" 
                                        className="w-4 h-4 mr-2" 
                                    />
                                    <span className="text-sm font-semibold text-white">
                                        {sortBy ? `${sortIcons[sortBy]} Sort by ${sortBy} (${sortOrder})` : "Sort Options"}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg rounded-xl p-1">
                                <DropdownMenuItem 
                                    onClick={() => handleSortSelect("starsReward")}
                                    className="hover:bg-[#E3F2FD] cursor-pointer rounded-lg px-3 py-2"
                                >
                                    <span className="mr-2">⭐</span> Stars
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    onClick={() => handleSortSelect("coinsReward")}
                                    className="hover:bg-[#E3F2FD] cursor-pointer rounded-lg px-3 py-2"
                                >
                                    <span className="mr-2">🪙</span> Coins
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    onClick={() => handleSortSelect("title")}
                                    className="hover:bg-[#E3F2FD] cursor-pointer rounded-lg px-3 py-2"
                                >
                                    <span className="mr-2">📝</span> Title
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    onClick={() => handleSortSelect("unlockedAt")}
                                    className="hover:bg-[#E3F2FD] cursor-pointer rounded-lg px-3 py-2"
                                >
                                    <span className="mr-2">📅</span> Date
                                </DropdownMenuItem>
                                <div className="border-t border-gray-200 my-1" />
                                <DropdownMenuItem 
                                    onClick={toggleSortOrder}
                                    className="hover:bg-[#F3E8FF] cursor-pointer rounded-lg px-3 py-2"
                                >
                                    <span className="mr-2">{sortOrder === "asc" ? "⬆️" : "⬇️"}</span>
                                    Sort Order: {sortOrder === "asc" ? "Ascending" : "Descending"}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </motion.div>
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

                {/* Content Section */}
                {!loading && (
                    <AnimatePresence mode="wait">
                        {filteredAchievements.length > 0 ? (
                            <motion.div
                                key="achievements-grid"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
                                    {filteredAchievements.map((achievement, index) => (
                                        <motion.div
                                            key={achievement._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ 
                                                delay: index * 0.1,
                                                duration: 0.5,
                                                ease: "easeOut"
                                            }}
                                            whileHover={{ 
                                                y: -5,
                                                transition: { duration: 0.3 }
                                            }}
                                        >
                                            <AchievementCard
                                                title={achievement.title}
                                                photo={achievement.photo || notesImage}
                                                description={achievement.description}
                                                starsReward={achievement.starsReward}
                                                coinsReward={achievement.coinsReward}
                                                criteria={achievement.criteria}
                                                isLocked={achievement.isLocked}
                                                unlockedAt={achievement.unlockedAt}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty-state"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.6 }}
                            >
                                <EmptyState activeFilter={activeFilter} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default Achievements;