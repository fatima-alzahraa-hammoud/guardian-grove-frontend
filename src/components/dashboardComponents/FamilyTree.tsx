import React from "react";
import { useSelector } from "react-redux";
import { selectFamilyAvatar, selectFamilyMembers, selectFamilyName } from "../../redux/slices/familySlice";
import FamilyMemberCard from "../cards/FamilyMemberCard";
import { motion } from "framer-motion";
import starsImage from "/assets/images/stars.png";

interface FamilyTreeProps {
    collapsed: boolean;
}

const parentColorPalette = [
    "bg-gradient-to-br from-blue-500 to-blue-600",
    "bg-gradient-to-br from-purple-500 to-purple-600",
    "bg-gradient-to-br from-teal-500 to-teal-600",
    "bg-gradient-to-br from-rose-500 to-rose-600",
];

const childColorPalette = [
    "bg-gradient-to-br from-green-400 to-green-500",
    "bg-gradient-to-br from-yellow-400 to-yellow-500",
    "bg-gradient-to-br from-red-400 to-red-500",
    "bg-gradient-to-br from-pink-400 to-pink-500",
    "bg-gradient-to-br from-indigo-400 to-indigo-500",
    "bg-gradient-to-br from-orange-400 to-orange-500",
    "bg-gradient-to-br from-cyan-400 to-cyan-500",
];

// Enhanced floating leaves animation
const FloatingLeaves = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => {
                const size = Math.random() * 15 + 10;
                const left = `${Math.random() * 100}%`;
                const animDuration = 20 + Math.random() * 25;
                const delay = Math.random() * -30;
                const leafEmoji = ['🍃', '🌿', '🍂', '🌱'][Math.floor(Math.random() * 4)];
                
                return (
                    <motion.div
                        key={i}
                        className="absolute text-green-400 opacity-60"
                        style={{
                            fontSize: size,
                            left,
                            top: "105%",
                        }}
                        initial={{ top: "105%", rotate: 0, opacity: 0.6 }}
                        animate={{ 
                            top: "-5%", 
                            rotate: 360,
                            x: [0, 30, -20, 15, 0],
                            opacity: [0.6, 0.8, 0.4, 0.6]
                        }}
                        transition={{
                            duration: animDuration,
                            repeat: Infinity,
                            delay,
                            ease: "linear"
                        }}
                    >
                        {leafEmoji}
                    </motion.div>
                );
            })}
        </div>
    );
};

// Beautiful sparkle effect for extra magic
const Sparkles = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 6 }).map((_, i) => {
                const size = Math.random() * 8 + 6;
                const left = `${Math.random() * 100}%`;
                const top = `${Math.random() * 100}%`;
                const delay = Math.random() * 3;
                
                return (
                    <motion.div
                        key={i}
                        className="absolute text-yellow-400"
                        style={{
                            fontSize: size,
                            left,
                            top,
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                            scale: [0, 1, 0.8, 1, 0],
                            opacity: [0, 1, 0.7, 1, 0],
                            rotate: [0, 180, 360]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay,
                            repeatDelay: 8
                        }}
                    >
                        ✨
                    </motion.div>
                );
            })}
        </div>
    );
};

const FamilyTree : React.FC<FamilyTreeProps> = ({collapsed}) => {
    const familyMembers = useSelector(selectFamilyMembers);
    const familyName = useSelector(selectFamilyName);
    const familyAvatar = useSelector(selectFamilyAvatar);

    const parents = familyMembers.filter(member => member.role === "parent");
    const children = familyMembers.filter(member => member.role === "child");

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 120,
                damping: 15
            }
        }
    };

    const cardHoverVariants = {
        hover: {
            scale: 1.08,
            y: -8,
            rotateY: 5,
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    return(
        <div className={`pt-20 min-h-screen flex flex-col items-center mx-auto transition-all duration-300 ${collapsed ? 'px-4' : 'px-8'} relative overflow-hidden`}>
            {/* Enhanced animated background gradient */}
            <motion.div 
                className="absolute inset-0"
                animate={{
                    background: [
                        "linear-gradient(135deg, rgba(240,253,244,0.4) 0%, rgba(239,246,255,0.4) 30%, rgba(250,245,255,0.4) 60%, rgba(255,247,237,0.4) 100%)",
                        "linear-gradient(225deg, rgba(250,245,255,0.4) 0%, rgba(255,247,237,0.4) 30%, rgba(240,253,244,0.4) 60%, rgba(239,246,255,0.4) 100%)",
                        "linear-gradient(315deg, rgba(239,246,255,0.4) 0%, rgba(250,245,255,0.4) 30%, rgba(255,247,237,0.4) 60%, rgba(240,253,244,0.4) 100%)"
                    ]
                }}
                transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
            />
            
            {/* Enhanced floating elements */}
            <FloatingLeaves />
            <Sparkles />

            <div className={`w-full flex-grow font-poppins mx-auto px-4 transition-all duration-300 ${collapsed ? 'max-w-6xl' : 'max-w-5xl'} relative z-10`}>
                
                {/* Enhanced Header with Family Avatar */}
                <motion.div 
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    {/* Family Avatar Section */}
                    <motion.div 
                        className="flex flex-col items-center mb-10"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 80, delay: 0.3 }}
                    >
                        <motion.div
                            className="relative mb-6"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            {/* Multiple glowing rings */}
                            <motion.div
                                className="absolute -inset-6 bg-gradient-to-r from-yellow-400 via-green-400 via-blue-400 to-purple-400 rounded-full opacity-20 blur-xl"
                                animate={{
                                    rotate: [0, 360],
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{
                                    rotate: { duration: 12, repeat: Infinity, ease: "linear" },
                                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                                }}
                            />
                            <motion.div
                                className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30 blur-lg"
                                animate={{
                                    rotate: [360, 0],
                                    scale: [1, 1.15, 1]
                                }}
                                transition={{
                                    rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                                    scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                                }}
                            />
                            
                            {/* Family Avatar */}
                            <motion.img
                                src={familyAvatar || starsImage}
                                alt="Family Avatar"
                                className="w-28 h-28 rounded-full border-4 border-white shadow-2xl relative z-10 object-cover"
                                animate={{
                                    boxShadow: [
                                        "0 0 30px rgba(59, 130, 246, 0.6)",
                                        "0 0 40px rgba(16, 185, 129, 0.6)",
                                        "0 0 35px rgba(168, 85, 247, 0.6)",
                                        "0 0 30px rgba(59, 130, 246, 0.6)"
                                    ]
                                }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            />
                            
                            {/* Floating mini sparkles around avatar */}
                            <motion.div
                                className="absolute -top-2 -right-2 text-yellow-400 text-lg"
                                animate={{
                                    scale: [1, 1.3, 1],
                                    rotate: [0, 180, 360]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                ⭐
                            </motion.div>
                            <motion.div
                                className="absolute -bottom-2 -left-2 text-blue-400 text-sm"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, -180, -360]
                                }}
                                transition={{ duration: 2.5, repeat: Infinity }}
                            >
                                💫
                            </motion.div>
                        </motion.div>

                        <motion.h1
                            className={`font-bold font-comic bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent transition-all duration-300 ${collapsed ? 'text-5xl' : 'text-4xl'} mb-2`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 1 }}
                        >
                            The {familyName} Family Tree
                        </motion.h1>
                        
                        <motion.div
                            className="w-32 h-1 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: 128 }}
                            transition={{ delay: 0.8, duration: 1.2 }}
                        />
                    </motion.div>

                    <motion.div
                        className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/40"
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        whileHover={{ 
                            scale: 1.02,
                            boxShadow: "0 25px 50px rgba(0,0,0,0.15)"
                        }}
                    >
                        <h2 className={`font-bold font-comic text-gray-800 transition-all duration-300 ${collapsed ? 'text-2xl' : 'text-xl'} mb-3`}>
                            Our Growing Family 🌳
                        </h2>
                        <p className={`text-gray-600 transition-all duration-300 ${collapsed ? 'text-lg' : 'text-base'} mb-6`}>
                            Click on any family member to explore their magical journey
                        </p>
                        
                        {/* Enhanced Family stats */}
                        <motion.div 
                            className="flex justify-center gap-12"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div 
                                className="text-center group cursor-pointer"
                                variants={itemVariants}
                                whileHover={{ scale: 1.1 }}
                            >
                                <div className="text-3xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
                                    {parents.length}
                                </div>
                                <div className="text-sm text-gray-600 font-medium">Parents</div>
                                <div className="w-8 h-1 bg-blue-400 mx-auto mt-1 rounded-full group-hover:w-10 transition-all"></div>
                            </motion.div>
                            <motion.div 
                                className="text-center group cursor-pointer"
                                variants={itemVariants}
                                whileHover={{ scale: 1.1 }}
                            >
                                <div className="text-3xl font-bold text-green-600 group-hover:text-green-700 transition-colors">
                                    {children.length}
                                </div>
                                <div className="text-sm text-gray-600 font-medium">Children</div>
                                <div className="w-8 h-1 bg-green-400 mx-auto mt-1 rounded-full group-hover:w-10 transition-all"></div>
                            </motion.div>
                            <motion.div 
                                className="text-center group cursor-pointer"
                                variants={itemVariants}
                                whileHover={{ scale: 1.1 }}
                            >
                                <div className="text-3xl font-bold text-purple-600 group-hover:text-purple-700 transition-colors">
                                    {familyMembers.length}
                                </div>
                                <div className="text-sm text-gray-600 font-medium">Total Members</div>
                                <div className="w-8 h-1 bg-purple-400 mx-auto mt-1 rounded-full group-hover:w-10 transition-all"></div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Parents Section with Enhanced Styling */}
                <motion.div 
                    className={`transition-all duration-300 ${collapsed ? 'mb-24' : 'mb-20'} relative z-20`}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div 
                        className="text-center mb-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                    >
                        <h3 className="text-3xl font-comic font-bold text-gray-700 mb-4">
                            👨‍👩‍👧‍👦 The Parents
                        </h3>
                        <motion.div 
                            className="w-32 h-1.5 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: 128 }}
                            transition={{ delay: 1.4, duration: 1 }}
                        />
                        <p className="text-gray-600 mt-3">The loving guardians of our family</p>
                    </motion.div>

                    <motion.div 
                        className={`flex justify-center mb-12 transition-all duration-300 ${collapsed ? 'space-x-40' : 'space-x-32'}`}
                        variants={containerVariants}
                    >
                        {parents.map((parent, index) => (
                            <motion.div
                                key={parent.name}
                                variants={itemVariants}
                                whileHover={{ 
                                    scale: 1.05, 
                                    y: -5,
                                    transition: { 
                                        duration: 0.3, 
                                        ease: "easeOut" 
                                    }
                                }}
                            >
                                <motion.div variants={cardHoverVariants}>
                                    <FamilyMemberCard
                                        member={parent}
                                        colorClass={parentColorPalette[index % parentColorPalette.length]}
                                    />
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Children Section with Enhanced Styling */}
                <motion.div 
                    className="relative z-20 mb-20"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div 
                        className="text-center mb-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.6, duration: 0.8 }}
                    >
                        <h3 className="text-3xl font-comic font-bold text-gray-700 mb-4">
                            🧒 The Little Guardians
                        </h3>
                        <motion.div 
                            className="w-32 h-1.5 bg-gradient-to-r from-green-400 to-yellow-400 mx-auto rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: 128 }}
                            transition={{ delay: 1.8, duration: 1 }}
                        />
                        <p className="text-gray-600 mt-3">Our bright stars growing every day</p>
                    </motion.div>

                    <motion.div 
                        className={`flex flex-wrap justify-center transition-all duration-300 ${collapsed ? 'gap-x-20 gap-y-20' : 'gap-x-16 gap-y-16'}`}
                        variants={containerVariants}
                    >
                        {children.map((child, index) => (
                            <motion.div
                                key={child.name}
                                variants={itemVariants}
                                whileHover={{ 
                                    scale: 1.05, 
                                    y: -5,
                                    transition: { 
                                        duration: 0.3, 
                                        ease: "easeOut" 
                                    }
                                }}
                            >
                                <motion.div variants={cardHoverVariants}>
                                    <FamilyMemberCard
                                        member={child}
                                        colorClass={childColorPalette[index % childColorPalette.length]}
                                    />
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Enhanced Family motto/quote */}
                <motion.div
                    className="text-center mb-20 relative z-20"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.2, duration: 1.2 }}
                >
                    <motion.div 
                        className="bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/50 max-w-3xl mx-auto relative overflow-hidden"
                        whileHover={{ 
                            scale: 1.02,
                            boxShadow: "0 30px 60px rgba(0,0,0,0.15)"
                        }}
                    >
                        {/* Decorative elements */}
                        <motion.div
                            className="absolute top-4 left-4 text-yellow-400 text-2xl"
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            🌟
                        </motion.div>
                        <motion.div
                            className="absolute top-4 right-4 text-blue-400 text-xl"
                            animate={{ rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 2.5, repeat: Infinity }}
                        >
                            💫
                        </motion.div>
                        
                        <motion.p 
                            className="text-xl font-comic text-gray-700  leading-relaxed"
                            animate={{ 
                                textShadow: [
                                    "0 0 0px rgba(0,0,0,0)",
                                    "0 0 15px rgba(59, 130, 246, 0.2)",
                                    "0 0 0px rgba(0,0,0,0)"
                                ]
                            }}
                            transition={{ duration: 4, repeat: Infinity }}
                        >
                            "Together we grow, together we shine,
                            <br />
                            forever intertwined like branches of time." 
                            <motion.span
                                className="inline-block ml-2"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 10, -10, 0]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                🌟
                            </motion.span>
                        </motion.p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default FamilyTree;