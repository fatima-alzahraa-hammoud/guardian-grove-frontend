import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import ActivityCard from "../cards/ActivityCard";
import { BondingActivity } from "../../libs/types/BondingActivity";
import { requestApi } from "../../libs/requestApi";
import { requestMethods } from "../../libs/enum/requestMethods";

interface BondingActivitiesProps {
    collapsed: boolean;
}

// Floating background elements with vibrant theme colors
const FloatingElements = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Animated gradient orbs using vibrant theme colors */}
            {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full blur-3xl opacity-20"
                    style={{
                        width: `${120 + i * 40}px`,
                        height: `${120 + i * 40}px`,
                        left: `${5 + i * 20}%`,
                        top: `${10 + i * 18}%`,
                        background: [
                            "linear-gradient(135deg, #3A8EBA, #179447)",
                            "linear-gradient(135deg, #F09C14, #8B5CF6)",
                            "linear-gradient(135deg, #179447, #3A8EBA)",
                            "linear-gradient(135deg, #8B5CF6, #F09C14)",
                            "linear-gradient(135deg, #3A8EBA, #8B5CF6)"
                        ][i % 5]
                    }}
                    animate={{
                        x: [0, 60, -40, 0],
                        y: [0, -40, 30, 0],
                        scale: [1, 1.3, 0.9, 1],
                        rotate: [0, 180, 360]
                    }}
                    transition={{
                        duration: 20 + i * 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 3
                    }}
                />
            ))}

            {/* Floating particles with vibrant colors */}
            {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                    key={`particle-${i}`}
                    className="absolute w-3 h-3 rounded-full opacity-40"
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
                        y: [0, -30, 0],
                        x: [0, Math.random() * 20 - 10, 0],
                        opacity: [0.2, 0.8, 0.2],
                        scale: [0.8, 1.2, 0.8]
                    }}
                    transition={{
                        duration: 5 + Math.random() * 3,
                        repeat: Infinity,
                        delay: Math.random() * 3,
                        ease: "easeInOut"
                    }}
                />
            ))}

            {/* Decorative geometric shapes */}
            {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                    key={`shape-${i}`}
                    className="absolute opacity-10"
                    style={{
                        left: `${10 + i * 15}%`,
                        top: `${20 + i * 12}%`,
                        transform: `rotate(${i * 45}deg)`
                    }}
                    animate={{
                        rotate: [i * 45, i * 45 + 360],
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.3, 0.1]
                    }}
                    transition={{
                        duration: 15 + i * 2,
                        repeat: Infinity,
                        ease: "linear",
                        delay: i * 1.5
                    }}
                >
                    {i % 3 === 0 ? (
                        <div className="w-8 h-8 border-2 border-[#3A8EBA] rounded-lg" />
                    ) : i % 3 === 1 ? (
                        <div className="w-6 h-6 bg-[#F09C14] rounded-full" />
                    ) : (
                        <div className="w-10 h-4 bg-[#179447] transform rotate-45" />
                    )}
                </motion.div>
            ))}
        </div>
    );
};

// Enhanced Empty State Component with more animations
const EmptyState = ({ activeFilter }: { activeFilter: string }) => {
    return (
        <motion.div 
            className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-300px)] relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 3 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-gradient-to-r from-[#E3F2FD] to-[#F8FAFC] opacity-50"
                        style={{
                            width: `${200 + i * 100}px`,
                            height: `${200 + i * 100}px`,
                            left: `${20 + i * 30}%`,
                            top: `${30 + i * 20}%`,
                        }}
                        animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 180, 360],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{
                            duration: 10 + i * 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 2
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10">
                <motion.h3 
                    className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3A8EBA] via-[#8B5CF6] to-[#179447] mb-4 font-comic"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    No {activeFilter} Activities Yet!
                </motion.h3>

                <motion.p 
                    className="text-gray-600 text-base mb-8 max-w-md mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                >
                    More bonding activities are coming soon! Check back later for new ways to connect with your family.
                    <br />
                    <span className="font-semibold text-[#3A8EBA]">Great bonds are built one activity at a time!</span>
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                >
                    <motion.div
                        className="w-36 h-36 mb-8 mx-auto bg-gradient-to-br from-[#E3F2FD] to-[#F8FAFC] rounded-full flex items-center justify-center border-4 border-[#3A8EBA]/20 shadow-lg"
                        animate={{
                            y: [0, -12, 0],
                            rotate: [0, 2, -2, 0],
                            boxShadow: [
                                "0 10px 30px rgba(58, 142, 186, 0.1)",
                                "0 20px 40px rgba(58, 142, 186, 0.2)",
                                "0 10px 30px rgba(58, 142, 186, 0.1)"
                            ]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Users className="w-16 h-16 text-[#3A8EBA]" />
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="inline-flex items-center gap-2 text-[#3A8EBA] font-medium"
                        animate={{
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                            ✨
                        </motion.div>
                        <span>Stay tuned for something exciting!</span>
                        <motion.div
                            animate={{ rotate: [0, -360] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                            🚀
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};

const BondingActivities: React.FC<BondingActivitiesProps> = ({ collapsed }) => {
    const [activeFilter, setActiveFilter] = useState<string>("All Activities");
    const [activities, setActivities] = useState<BondingActivity[]>([]);
    const [filteredActivities, setFilteredActivities] = useState<BondingActivity[]>([]);
    const [loading, setLoading] = useState(true);

    const filters = ["All Activities", "Creative", "Memory", "Games", "Emotional", "Planning"];

    const handleFilterChange = useCallback((filter: string, activitiesData: BondingActivity[]) => {
        setActiveFilter(filter);
        let filtered;
        if (filter === "All Activities") {
            filtered = activitiesData;
        } else {
            filtered = activitiesData.filter((activity) => activity.category === filter);
        }
        setFilteredActivities(filtered);
    }, []);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const response = await requestApi({
                route: "/bondingActivities/",
                method: requestMethods.GET,
            });

            if (response && response.activities) {
                setActivities(response.activities);
                handleFilterChange(activeFilter, response.activities);
            } else {
                console.log("Failed to retrieve activities", response?.message);
            }
        } catch (error) {
            console.log("Something went wrong", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadIncrement = async (activityId: string) => {
        try {
            await requestApi({
                route: `/bondingActivities/${activityId}/download`,
                method: requestMethods.PATCH
            });
            // Update local state to reflect the download count increment
            setActivities(prevActivities => 
                prevActivities.map(activity => 
                    activity._id === activityId 
                        ? { ...activity, downloads: (activity.downloads || 0) + 1 } 
                        : activity
                )
            );
        } catch (error) {
            console.log("Failed to increment download count", error);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, [activeFilter]);

    const handleFilterClick = useCallback((filter: string) => {
        setActiveFilter(filter);
    }, []);

    // Enhanced Loading component with theme colors
    const LoadingState = () => (
        <motion.div 
            className="flex flex-col justify-center items-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <motion.div
                className="w-16 h-16 border-4 border-[#E3F2FD] border-t-[#3A8EBA] rounded-full mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.p
                className="text-[#3A8EBA] font-medium"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
                Loading bonding activities...
            </motion.p>
        </motion.div>
    );

    return (
        <div className="pt-24 min-h-screen flex justify-center relative overflow-hidden">
            {/* Animated background */}
            <FloatingElements />
            
            <div className={`w-full flex-grow font-poppins mx-auto px-4 relative z-10 ${collapsed ? "max-w-6xl" : "max-w-5xl"}`}>
                
                {/* Enhanced Header with decorative elements */}
                <motion.div 
                    className="text-left mb-10 relative"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Decorative floating elements around header */}
                    <motion.div
                        className="absolute -top-4 -left-4 w-8 h-8 bg-[#F09C14] rounded-full opacity-20"
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 180, 360]
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute -top-2 right-10 w-6 h-6 bg-[#179447] rounded-lg opacity-20"
                        animate={{
                            y: [0, -10, 0],
                            rotate: [0, 45, 0]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                        }}
                    />

                    <h2 className="text-2xl font-bold font-comic text-gray-800 mb-2">
                        Family Bonding Activities
                    </h2>
                    <motion.div 
                        className="h-1 w-24 bg-gradient-to-r from-[#3A8EBA] to-[#179447] rounded-full mb-4"
                        initial={{ width: 0 }}
                        animate={{ width: 96 }}
                        transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                    />
                    <motion.p 
                        className="text-gray-600 text-base"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                    >
                        Download fun activities to strengthen your family bonds and create lasting memories
                    </motion.p>
                </motion.div>

                {/* Enhanced Filters with staggered animations */}
                <motion.div 
                    className="flex flex-wrap gap-3 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    {filters.map((filter, index) => (
                        <motion.div
                            key={filter}
                            initial={{ opacity: 0, x: -20, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ 
                                delay: 0.4 + index * 0.1, 
                                duration: 0.5,
                                type: "spring",
                                stiffness: 100
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                onClick={() => handleFilterClick(filter)}
                                variant="secondary"
                                className={cn(
                                    "bg-[#E3F2FD] hover:bg-[#d7edfd] text-gray-700 font-medium transition-all duration-300 px-6 py-3 rounded-full border border-[#3A8EBA]/20 shadow-sm hover:shadow-md",
                                    activeFilter === filter &&
                                        "bg-gradient-to-r from-[#3A8EBA] to-[#347ea5] text-white hover:from-[#347ea5] hover:to-[#2d6b8a] border-[#3A8EBA] shadow-lg transform scale-105"
                                )}
                            >
                                {filter}
                            </Button>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Loading State */}
                {loading && <LoadingState />}

                {/* Content Section with enhanced animations */}
                {!loading && (
                    <AnimatePresence mode="wait">
                        {filteredActivities.length > 0 ? (
                            <motion.div
                                key="activities-grid"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.6 }}
                            >
                                <motion.div 
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-12"
                                    initial="hidden"
                                    animate="visible"
                                    variants={{
                                        hidden: {},
                                        visible: {
                                            transition: {
                                                staggerChildren: 0.1
                                            }
                                        }
                                    }}
                                >
                                    {filteredActivities.map((activity, index) => (
                                        <motion.div
                                            key={activity._id}
                                            variants={{
                                                hidden: { 
                                                    opacity: 0, 
                                                    y: 30,
                                                    scale: 0.9
                                                },
                                                visible: { 
                                                    opacity: 1, 
                                                    y: 0,
                                                    scale: 1,
                                                    transition: {
                                                        type: "spring",
                                                        stiffness: 100,
                                                        damping: 12
                                                    }
                                                }
                                            }}
                                            whileHover={{ 
                                                scale: 1.02,
                                                y: -5,
                                                transition: { duration: 0.2 }
                                            }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <ActivityCard 
                                                activity={activity} 
                                                onDownload={() => handleDownloadIncrement(activity._id)}
                                            />
                                        </motion.div>
                                    ))}
                                </motion.div>
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

export default BondingActivities;