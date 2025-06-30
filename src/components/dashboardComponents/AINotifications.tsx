import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectRole } from "../../redux/slices/userSlice";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { requestApi } from "../../libs/requestApi";
import { requestMethods } from "../../libs/enum/requestMethods";
import NotificationCard from "../cards/NotificationCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { motion, AnimatePresence } from "framer-motion";

interface AINotificationsProps {
    collapsed: boolean;
}

interface Notification {
    title: string;
    type: "personal" | "family";
    category: "tip" | "alert" | "suggestion" | "notification";
    message: string;
    timestamp: Date;
}

// Floating background elements with vibrant theme colors
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
                            "#8B5CF6"  // Purple instead of beige
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

// Enhanced empty state component with vibrant colors
const EmptyState = ({ activeFilter }: { activeFilter: string }) => {
    return (
        <motion.div 
            className="text-center mt-20 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
        >

            <div className="relative z-10">
                
                <motion.h3 
                    className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3A8EBA] via-[#8B5CF6] to-[#179447] mb-4 font-comic"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                >
                    No {activeFilter} Yet!
                </motion.h3>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                >
                    <p className="text-gray-600 text-base mb-8 max-w-md mx-auto leading-relaxed">
                        Start exploring and engaging with your AI companion to receive personalized updates and insights.
                    </p>
                    
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

                {/* Enhanced illustration */}
                <motion.div
                    className="mt-8"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                >
                    <motion.img
                        src="/assets/images/ai-notifications.png"
                        alt="AI Notifications Illustration"
                        className="w-56 h-56 mx-auto"
                        animate={{
                            y: [0, -10, 0],
                            rotate: [0, 2, -2, 0]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </motion.div>
            </div>
        </motion.div>
    );
};

const AINotifications: React.FC<AINotificationsProps> = ({ collapsed }) => {
    const role = useSelector(selectRole);
    const filters = role === "parent" ? ["Tips & Suggestions", "Alerts & Notifications", "Children's Notify & Tips"] : ["Tips & Suggestions", "Alerts & Notifications"];
    const [activeFilter, setActiveFilter] = useState<string>("Tips & Suggestions");
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await requestApi({
                route: "/userNotifications/",
                method: requestMethods.GET,
            });

            if (response && response.notifications) {
                setNotifications(response.notifications);
                console.log(response.notifications);
            } else {
                console.log("Failed to retrieve notifications", response.message);
            }
        } catch (error) {
            console.log("Something went wrong", error);
        } finally {
            setLoading(false);
        }
    };

    // Group notifications by time range
    const today = new Date();
    const oneDayAgo = new Date(today);
    oneDayAgo.setDate(today.getDate() - 1);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const groupedNotifications = {
        today: notifications.filter((n) => new Date(n.timestamp) >= oneDayAgo),
        last7Days: notifications.filter(
            (n) =>
                new Date(n.timestamp) < oneDayAgo &&
                new Date(n.timestamp) >= sevenDaysAgo
        ),
        old: notifications.filter((n) => new Date(n.timestamp) < sevenDaysAgo),
    };

    // Filter notifications based on active filter
    const filteredNotifications = (category: "today" | "last7Days" | "old") => {
        const filtered = groupedNotifications[category].filter((notification) => {
            if (activeFilter === "Tips & Suggestions") {
                return (
                    notification.category === "tip" ||
                    notification.category === "suggestion"
                );
            }
            if (activeFilter === "Alerts & Notifications") {
                return (
                    notification.category === "alert" ||
                    notification.category === "notification"
                );
            }
            return true;
        });

        return filtered;
    };

    // Filter icons mapping
    const filterIcons: Record<string, JSX.Element> = {
        "Tips & Suggestions": (
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ),
        "Alerts & Notifications": (
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
        ),
        "Children's Notify & Tips": (
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
        ),
    };

    // Category time labels
    const categoryLabels = {
        today: "Today",
        last7Days: "Previous 7 Days",
        old: "Older"
    };

    // Loading component with theme colors
    const LoadingState = () => (
        <motion.div 
            className="flex justify-center items-center mt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <motion.div
                className="w-12 h-12 border-4 border-[#E3F2FD] border-t-[#3A8EBA] rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
        </motion.div>
    );

    return (
        <div className="pt-24 min-h-screen flex flex-col items-center relative overflow-hidden">
            {/* Animated background */}
            <FloatingElements />
            
            <div
                className={`w-full flex-grow font-poppins mx-auto px-4 relative z-10 ${
                    collapsed ? "max-w-5xl" : "max-w-5xl"
                }`}
            >
                {/* Enhanced Header with vibrant theme colors */}
                <motion.div 
                    className="text-left relative"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Decorative elements with vibrant theme colors */}
                    
                    <motion.div 
                        className="text-left mb-10"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-2xl font-bold font-comic text-gray-800 mb-2">
                            AI Notifications
                        </h2>
                        <div className="h-1 w-24 bg-[#3A8EBA] rounded-full mb-4" />
                        <p className="text-gray-600 text-base">
                            Stay up to date with smart tips, alerts, and suggestions from your AI companion.
                        </p>
                    </motion.div>
                    
                </motion.div>

                {/* Enhanced Filters Section with theme colors */}
                    <motion.div 
                    className="flex flex-wrap gap-3 mb-12"
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
                                    "bg-[#E3F2FD] hover:bg-[#d7edfd] text-gray-700 font-medium transition-all duration-300 px-6 py-3 rounded-full border border-[#3A8EBA]/20",
                                    activeFilter === filter &&
                                        "bg-[#3A8EBA] text-white hover:bg-[#347ea5] border-[#3A8EBA]"
                                )}
                            >
                                {filterIcons[filter]}
                                {filter}
                            </Button>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Loading State */}
                {loading && <LoadingState />}

                {/* Content Area */}
                {!loading && (
                    <AnimatePresence mode="wait">
                        {/* Check if there are no notifications for the active filter */}
                        {(["today", "last7Days", "old"] as const).every(
                            (category) => filteredNotifications(category).length === 0
                        ) ? (
                            <EmptyState activeFilter={activeFilter} />
                        ) : (
                            <motion.div
                                key={activeFilter}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                {(["today", "last7Days", "old"] as const).map((category, categoryIndex) => {
                                    const notificationsList = filteredNotifications(category);
                                    if (notificationsList.length === 0) {
                                        return null; // Skip if no notifications in this category
                                    }

                                    return (
                                        <motion.div 
                                            key={category} 
                                            className="mt-12"
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ 
                                                delay: categoryIndex * 0.2,
                                                duration: 0.6,
                                                ease: [0.25, 0.46, 0.45, 0.94]
                                            }}
                                        >
                                            {/* Section Header with vibrant theme colors */}
                                            <motion.div
                                                className="flex items-center gap-4 mb-6"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: categoryIndex * 0.2 + 0.1, duration: 0.5 }}
                                            >
                                                <motion.div
                                                    className="w-2 h-8 bg-gradient-to-b from-[#3A8EBA] via-[#8B5CF6] to-[#179447] rounded-full"
                                                    initial={{ height: 0 }}
                                                    animate={{ height: 32 }}
                                                    transition={{ delay: categoryIndex * 0.2 + 0.3, duration: 0.4 }}
                                                />
                                                <h3 className="text-xl font-bold font-comic text-gray-800">
                                                    {categoryLabels[category]}
                                                </h3>
                                                <motion.div
                                                    className="flex-1 h-px bg-gradient-to-r from-[#3A8EBA]/30 to-transparent"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "100%" }}
                                                    transition={{ delay: categoryIndex * 0.2 + 0.4, duration: 0.6 }}
                                                />
                                                <motion.span
                                                    className="text-sm text-gray-500 bg-gradient-to-r from-[#E3F2FD] to-[#F8FAFC] px-3 py-1 rounded-full font-medium border border-[#3A8EBA]/20"
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: categoryIndex * 0.2 + 0.5, duration: 0.3 }}
                                                >
                                                    {notificationsList.length} notification{notificationsList.length > 1 ? 's' : ''}
                                                </motion.span>
                                            </motion.div>

                                            {/* Enhanced Carousel with theme colors */}
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: categoryIndex * 0.2 + 0.6, duration: 0.5 }}
                                            >
                                                <Carousel className="w-full">
                                                    <CarouselContent className="flex gap-6 pb-4 overflow-visible relative">
                                                        {notificationsList.map((notification, idx) => (
                                                            <CarouselItem 
                                                                key={idx} 
                                                                className="basis-[320px] flex-shrink-0 overflow-visible relative"
                                                            >
                                                                <motion.div
                                                                    className="h-full"
                                                                    initial={{ opacity: 0, y: 20, rotateY: -10 }}
                                                                    animate={{ opacity: 1, y: 0, rotateY: 0 }}
                                                                    transition={{ 
                                                                        delay: categoryIndex * 0.2 + 0.7 + idx * 0.1,
                                                                        duration: 0.5,
                                                                        ease: [0.25, 0.46, 0.45, 0.94]
                                                                    }}
                                                                    whileHover={{ 
                                                                        scale: 1.02,
                                                                        rotateY: 2,
                                                                        transition: { duration: 0.3 }
                                                                    }}
                                                                >
                                                                    <div className="h-[230px]">
                                                                        <NotificationCard notification={notification} />
                                                                    </div>
                                                                </motion.div>
                                                            </CarouselItem>
                                                        ))}
                                                    </CarouselContent>
                                                    
                                                    {/* Enhanced Carousel Controls with theme colors */}
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: categoryIndex * 0.2 + 1, duration: 0.5 }}
                                                    >
                                                        <CarouselPrevious className="w-10 h-10 bg-white/90 backdrop-blur-sm border-2 border-[#3A8EBA]/20 hover:bg-[#E3F2FD] hover:border-[#3A8EBA] hover:text-[#3A8EBA] transition-all duration-300 shadow-lg -left-5" />
                                                        <CarouselNext className="w-10 h-10 bg-white/90 backdrop-blur-sm border-2 border-[#3A8EBA]/20 hover:bg-[#E3F2FD] hover:border-[#3A8EBA] hover:text-[#3A8EBA] transition-all duration-300 shadow-lg -right-5" />
                                                    </motion.div>
                                                </Carousel>
                                            </motion.div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default AINotifications;