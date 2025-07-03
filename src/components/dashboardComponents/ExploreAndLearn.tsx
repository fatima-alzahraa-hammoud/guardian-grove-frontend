import React, { useCallback, useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import notesImage from '/assets/images/dashboard/notesBlack.png';
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

interface LearningResource {
    _id: string;
    title: string;
    description: string;
    coverImage: string;
    type: "book" | "video" | "article" | "course";
    category: string;
    duration?: number; // in minutes
    pages?: number; // for books
    author?: string;
    isCompleted?: boolean;
    completedAt?: Date;
    progress?: number; // 0-100
}

interface ExploreLearnProps {
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
                        left: `${15 + i * 20}%`,
                        top: `${10 + i * 18}%`,
                    }}
                    animate={{
                        x: [0, 60, -40, 0],
                        y: [0, -40, 30, 0],
                        scale: [1, 1.3, 0.7, 1],
                        rotate: [0, 180, 360],
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
                    className="absolute rounded-full opacity-40"
                    style={{
                        width: `${4 + Math.random() * 6}px`,
                        height: `${4 + Math.random() * 6}px`,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        x: [0, Math.random() * 20 - 10, 0],
                        opacity: [0.2, 0.8, 0.2],
                        scale: [1, 1.5, 1],
                    }}
                    transition={{
                        duration: 5 + Math.random() * 3,
                        repeat: Infinity,
                        delay: Math.random() * 3,
                        ease: "easeInOut"
                    }}
                />
            ))}

            {/* Learning-themed floating icons */}
            {["📚", "🎓", "💡", "🚀", "✨"].map((icon, i) => (
                <motion.div
                    key={`icon-${i}`}
                    className="absolute text-2xl opacity-20"
                    style={{
                        left: `${20 + i * 15}%`,
                        top: `${30 + i * 10}%`,
                    }}
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 6 + i,
                        repeat: Infinity,
                        delay: i * 1.5,
                        ease: "easeInOut"
                    }}
                >
                    {icon}
                </motion.div>
            ))}
        </div>
    );
};

const EmptyState = ({ activeTab }: { activeTab: string }) => {
    return (
        <motion.div 
            className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-300px)] relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="relative z-10">
                <motion.h3 
                    className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3A8EBA] via-[#8B5CF6] to-[#179447] mb-4 font-comic"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    No {activeTab} Content Yet!
                </motion.h3>

                <motion.p 
                    className="text-gray-600 text-base mb-8 max-w-md mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    {activeTab === "Books" 
                        ? "We're adding new books to our library soon. Check back later for amazing reads!"
                        : "Exciting learning materials are coming your way. Stay tuned for new courses and videos!"}
                </motion.p>

                <motion.div
                    className="inline-flex items-center gap-2 text-[#3A8EBA] font-medium mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                >
                    <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                        📚
                    </motion.div>
                    <span>Knowledge is coming your way!</span>
                    <motion.div
                        animate={{ rotate: [0, -360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                        🌟
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                >
                    <motion.img
                        src="/assets/images/learning.png"
                        alt="Learning Illustration"
                        className="w-40 h-40 mb-8 mx-auto"
                        animate={{
                            y: [0, -10, 0],
                            rotate: [0, 2, -2, 0],
                            scale: [1, 1.05, 1],
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

const ResourceCard = ({
    title,
    coverImage,
    description,
    type,
    category,
    duration,
    pages,
    author,
    progress,
    isCompleted
}: LearningResource) => {
    const typeIcons = {
        "book": "📚",
        "video": "🎬",
        "article": "📄",
        "course": "🎓"
    };

    return (
        <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 relative group"
            whileHover={{ 
                y: -8, 
                scale: 1.02,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Hover glow effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#3A8EBA]/5 via-[#8B5CF6]/5 to-[#179447]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
            />
            
            <div className="relative">
                <motion.img 
                    src={coverImage || notesImage} 
                    alt={title} 
                    className="w-full h-48 object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                />
                <motion.div 
                    className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium flex items-center shadow-sm"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                >
                    {typeIcons[type]} {type.charAt(0).toUpperCase() + type.slice(1)}
                </motion.div>
                
                {progress !== undefined && (
                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200/80">
                        <motion.div 
                            className="h-full bg-gradient-to-r from-[#3A8EBA] to-[#179447]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                        />
                    </div>
                )}
            </div>
            
            <div className="p-4 relative z-10">
                <motion.h3 
                    className="font-bold text-lg mb-1 line-clamp-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                >
                    {title}
                </motion.h3>
                
                {author && (
                    <motion.p 
                        className="text-gray-600 text-sm mb-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.4 }}
                    >
                        By {author}
                    </motion.p>
                )}
                
                <motion.div 
                    className="flex flex-wrap gap-2 mb-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                >
                    <span className="bg-gradient-to-r from-[#E3F2FD] to-[#F0F4FF] text-[#3A8EBA] text-xs px-2 py-1 rounded-full border border-[#3A8EBA]/20">
                        {category}
                    </span>
                    {pages && (
                        <span className="bg-gradient-to-r from-[#E8F5E9] to-[#F1F8E9] text-[#2E7D32] text-xs px-2 py-1 rounded-full border border-[#179447]/20">
                            {pages} pages
                        </span>
                    )}
                    {duration && (
                        <span className="bg-gradient-to-r from-[#FFF3E0] to-[#FFF8E1] text-[#E65100] text-xs px-2 py-1 rounded-full border border-[#F09C14]/20">
                            {duration} min
                        </span>
                    )}
                </motion.div>
                
                <motion.p 
                    className="text-gray-700 text-sm mb-4 line-clamp-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                >
                    {description}
                </motion.p>
                
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.4 }}
                >
                    <Button 
                        className={`w-full transition-all duration-300 ${
                            isCompleted 
                                ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' 
                                : 'bg-gradient-to-r from-[#3A8EBA] to-[#347ea5] hover:from-[#347ea5] hover:to-[#2d6b8f]'
                        }`}
                    >
                        {isCompleted ? 'Completed ✓' : progress ? `Continue (${progress}%)` : 'Start'}
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    );
};

const LoadingState = () => (
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
        <motion.p
            className="ml-4 text-gray-600"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
        >
            Loading amazing content...
        </motion.p>
    </motion.div>
);

const ExploreLearn: React.FC<ExploreLearnProps> = ({ collapsed }) => {
    const [activeTab, setActiveTab] = useState<"Books" | "Learning Zone">("Books");
    const [resources, setResources] = useState<LearningResource[]>([]);
    const [filteredResources, setFilteredResources] = useState<LearningResource[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchResources = useCallback(async () => {
        try {
            setLoading(true);
            
            // Simulate API call - replace with actual API call
            // const response = await requestApi({
            //     route: "/learning/resources",
            //     method: requestMethods.GET
            // });

            // Mock data - replace with actual response data
            const mockData: LearningResource[] = [
                {
                    _id: "1",
                    title: "The Psychology of Money",
                    description: "Timeless lessons on wealth, greed, and happiness",
                    coverImage: "/assets/assets/images/psychology_book.png",
                    type: "book",
                    category: "Finance",
                    pages: 256,
                    author: "Morgan Housel",
                    progress: 45
                },
                {
                    _id: "2",
                    title: "React Masterclass",
                    description: "Learn React from scratch to advanced patterns",
                    coverImage: "/assets/images/learning/react-course.jpg",
                    type: "course",
                    category: "Programming",
                    duration: 360,
                    progress: 10
                },
                {
                    _id: "3",
                    title: "Mindfulness Meditation",
                    description: "Daily practices for stress reduction and focus",
                    coverImage: "/assets/images/mindfulness_practice.png",
                    type: "video",
                    category: "Wellness",
                    duration: 30,
                    isCompleted: true,
                    completedAt: new Date()
                },
                {
                    _id: "4",
                    title: "Atomic Habits",
                    description: "Tiny changes, remarkable results",
                    coverImage: "/assets/images/atomic_habits_book.png",
                    type: "book",
                    category: "Productivity",
                    pages: 320,
                    author: "James Clear",
                    progress: 80
                },
                {
                    _id: "5",
                    title: "The Future of AI",
                    description: "How artificial intelligence is transforming industries",
                    coverImage: "/assets/images/AI_learn.png",
                    type: "article",
                    category: "Technology",
                    duration: 15
                }
            ];

            setResources(mockData);
            
            // Extract unique categories
            const uniqueCategories = ["All", ...new Set(mockData.map(r => r.category))];
            setCategories(uniqueCategories as string[]);

        } catch (error) {
            console.error("Error fetching resources:", error);
            toast.error("Failed to load resources. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchResources();
    }, []);

    useEffect(() => {
        if (resources.length === 0) return;

        const filtered = resources.filter(resource => {
            // Filter by tab
            const matchesTab = activeTab === "Books" 
                ? resource.type === "book"
                : resource.type !== "book";
            
            // Filter by category
            const matchesCategory = selectedCategory === "All" 
                ? true 
                : resource.category === selectedCategory;
            
            // Filter by search query
            const matchesSearch = searchQuery === "" 
                ? true 
                : resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  resource.description.toLowerCase().includes(searchQuery.toLowerCase());
            
            return matchesTab && matchesCategory && matchesSearch;
        });

        setFilteredResources(filtered);
    }, [activeTab, selectedCategory, resources, searchQuery]);

    const handleTabChange = (tab: "Books" | "Learning Zone") => {
        setActiveTab(tab);
        setSelectedCategory("All"); // Reset category filter when changing tabs
    };

    return (
        <div className="pt-24 min-h-screen flex justify-center relative overflow-hidden">
            {/* Animated background */}
            <FloatingElements />
            
            <div className={`w-full flex-grow font-poppins mx-auto px-4 relative z-10 ${ collapsed ? "max-w-6xl" : "max-w-5xl" }`} >
                {/* Enhanced Header with vibrant theme colors */}
                <motion.div 
                    className="text-left mb-10 relative"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.h2 
                        className="text-2xl font-bold font-comic text-gray-800 mb-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        Explore & Learn
                    </motion.h2>
                    <motion.div 
                        className="h-1 w-24 bg-[#3A8EBA] rounded-full mb-4"
                        initial={{ width: 0 }}
                        animate={{ width: 96 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    />
                    <motion.p 
                        className="text-gray-600 text-base"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        Discover books, courses, and resources to expand your knowledge
                    </motion.p>
                </motion.div>

                {/* Enhanced Tabs */}
                <motion.div 
                    className="flex mb-8 border-b border-gray-200 relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    {(["Books", "Learning Zone"] as const).map((tab, index) => (
                        <motion.button
                            key={tab}
                            onClick={() => handleTabChange(tab)}
                            className={cn(
                                "px-6 py-3 font-medium text-sm border-b-2 transition-all duration-300 relative overflow-hidden",
                                activeTab === tab
                                    ? "border-[#3A8EBA] text-[#3A8EBA]"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            )}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {activeTab === tab && (
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-[#E3F2FD] to-[#F0F4FF] -z-10"
                                    layoutId="activeTabBackground"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            {tab}
                        </motion.button>
                    ))}
                </motion.div>

                {/* Enhanced Controls Section */}
                <motion.div 
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    {/* Enhanced Search Bar */}
                    <motion.div 
                        className="relative w-full sm:w-64"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        <input
                            type="text"
                            placeholder={`Search ${activeTab.toLowerCase()}...`}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#3A8EBA] focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <motion.svg
                            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            animate={{ rotate: searchQuery ? [0, 360] : 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </motion.svg>
                    </motion.div>

                    {/* Enhanced Category Filter */}
                    <motion.div 
                        className="flex flex-wrap gap-2 w-full sm:w-auto"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        {categories.map((category, index) => (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
                            >
                                <Button
                                    onClick={() => setSelectedCategory(category)}
                                    variant="secondary"
                                    className={cn(
                                        "bg-white/80 backdrop-blur-sm hover:bg-[#d7edfd] text-gray-700 font-medium transition-all duration-300 px-4 py-2 rounded-full border text-sm relative overflow-hidden",
                                        selectedCategory === category
                                            ? "bg-gradient-to-r from-[#3A8EBA] to-[#347ea5] text-white hover:from-[#347ea5] hover:to-[#2d6b8f] border-[#3A8EBA] shadow-lg"
                                            : "border-[#3A8EBA]/20 hover:border-[#3A8EBA]/40"
                                    )}
                                >
                                    {selectedCategory === category && (
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-[#3A8EBA]/20 to-[#347ea5]/20"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}
                                    <span className="relative z-10">{category}</span>
                                </Button>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Loading State */}
                {loading && <LoadingState />}

                {/* Content Section */}
                {!loading && (
                    <AnimatePresence mode="wait">
                        {filteredResources.length > 0 ? (
                            <motion.div
                                key="resources-grid"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.6 }}
                            >
                                <motion.div 
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12"
                                    initial="hidden"
                                    animate="visible"
                                    variants={{
                                        hidden: { opacity: 0 },
                                        visible: {
                                            opacity: 1,
                                            transition: {
                                                staggerChildren: 0.1
                                            }
                                        }
                                    }}
                                >
                                    {filteredResources.map((resource, index) => (
                                        <motion.div
                                            key={index}
                                            variants={{
                                                hidden: { opacity: 0, y: 20, rotateY: -10 },
                                                visible: { 
                                                    opacity: 1, 
                                                    y: 0, 
                                                    rotateY: 0,
                                                    transition: {
                                                        duration: 0.5,
                                                        ease: [0.25, 0.46, 0.45, 0.94]
                                                    }
                                                }
                                            }}
                                        >
                                            <ResourceCard {...resource} />
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
                                <EmptyState activeTab={activeTab} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default ExploreLearn;