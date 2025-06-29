import React from "react";
import { motion } from "framer-motion";
import coinImage from "/assets/images/coins.png";
import starsImage from "/assets/images/stars.png";

interface AchievementCardProps {
    title: string;
    description: string;
    photo: string;
    criteria: string;
    starsReward: number;
    coinsReward: number;
    isLocked?: boolean;
    unlockedAt?: Date;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ 
    title, 
    description, 
    photo, 
    criteria, 
    starsReward, 
    coinsReward, 
    isLocked, 
    unlockedAt 
}) => {
    return (
        <motion.div 
            className={`group relative h-[240px] rounded-2xl overflow-hidden cursor-pointer font-poppins transition-all duration-500 ${
                isLocked 
                    ? 'bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300' 
                    : 'bg-gradient-to-br from-[#E3F2FD] to-white border-2 border-[#3A8EBA]/30'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ 
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3 }
            }}
        >
            {/* Locked overlay gradient */}
            {isLocked && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-300/50 to-gray-400/30 z-10" />
            )}

            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Top corner accent */}
                <motion.div 
                    className={`absolute -top-10 -right-10 w-20 h-20 rounded-full ${
                        isLocked ? 'bg-gray-400/20' : 'bg-[#3A8EBA]/10'
                    }`}
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 10, 0]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                
                {/* Bottom left accent */}
                <motion.div 
                    className={`absolute -bottom-6 -left-6 w-12 h-12 rounded-full ${
                        isLocked ? 'bg-gray-300/20' : 'bg-[#8B5CF6]/15'
                    }`}
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, -15, 0]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                />
            </div>

            {/* Main content */}
            <div className="relative z-20 p-6 flex flex-col items-center justify-center h-full">
                {/* Achievement Image Container */}
                <motion.div 
                    className={`relative w-24 h-24 mb-4 ${
                        isLocked ? 'grayscale' : ''
                    }`}
                    whileHover={{ 
                        scale: 1.1,
                        rotate: 5,
                        transition: { duration: 0.3 }
                    }}
                >
                    {/* Glow effect behind image */}
                    <motion.div 
                        className={`absolute inset-0 rounded-full blur-lg ${
                            isLocked ? 'bg-gray-400/30' : 'bg-[#3A8EBA]/30'
                        }`}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    
                    {/* Image background circle */}
                    <div className={`relative w-full h-full rounded-full flex items-center justify-center shadow-lg border-3 ${
                        isLocked 
                            ? 'bg-white border-gray-300' 
                            : 'bg-white border-[#3A8EBA]/20'
                    }`}>
                        <img
                            src={photo}
                            alt={title}
                            className="w-16 h-16 object-contain"
                        />
                        
                        {/* Lock overlay for locked achievements */}
                        {isLocked && (
                            <motion.div 
                                className="absolute inset-0 bg-gray-500/20 rounded-full flex items-center justify-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </motion.div>
                        )}
                    </div>

                    {/* Floating sparkles for unlocked achievements */}
                    {!isLocked && (
                        <>
                            <motion.div
                                className="absolute -top-2 -right-2 text-yellow-400"
                                animate={{
                                    scale: [0, 1, 0],
                                    rotate: [0, 180, 360]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: 0.5
                                }}
                            >
                                ✨
                            </motion.div>
                            <motion.div
                                className="absolute -bottom-1 -left-1 text-blue-400"
                                animate={{
                                    scale: [0, 1, 0],
                                    rotate: [0, -180, -360]
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: 1
                                }}
                            >
                                ⭐
                            </motion.div>
                        </>
                    )}
                </motion.div>

                {/* Achievement Title */}
                <motion.h4 
                    className={`text-lg font-bold text-center font-comic mb-2 line-clamp-2 ${
                        isLocked ? 'text-gray-600' : 'text-gray-800'
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {title}
                </motion.h4>

                {/* Status indicator */}
                <motion.div 
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isLocked 
                            ? 'bg-gray-200 text-gray-600' 
                            : 'bg-[#3A8EBA]/10 text-[#3A8EBA]'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                >
                    {isLocked ? 'Locked' : 'Unlocked'}
                </motion.div>

                {/* Rewards preview for locked achievements */}
                {isLocked && (starsReward > 0 || coinsReward > 0) && (
                    <motion.div 
                        className="flex gap-3 mt-3 opacity-60"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 0.6, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        {starsReward > 0 && (
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                                <img src={starsImage} alt="Stars" className="w-4 h-4 grayscale" />
                                <span>{starsReward}</span>
                            </div>
                        )}
                        {coinsReward > 0 && (
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                                <img src={coinImage} alt="Coins" className="w-4 h-4 grayscale" />
                                <span>{coinsReward}</span>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>

            {/* Enhanced Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#3A8EBA]/95 to-[#8B5CF6]/90 backdrop-blur-sm text-white flex flex-col items-center justify-center p-5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 z-30">
                <div className="text-center space-y-3">
                    {!isLocked ? (
                        <>
                            {/* Unlocked Achievement Details */}
                            <div className="mb-3">
                                <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full border border-white/30">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm font-medium text-white">Achieved!</span>
                                </div>
                            </div>
                            
                            <p className="text-sm font-semibold mb-3 text-white/90">
                                Unlocked on:{" "}
                                {unlockedAt?.toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </p>
                            
                            {/* Show description for unlocked achievements */}
                            <p className="text-sm leading-relaxed text-white/95 px-2">
                                {description}
                            </p>
                        </>
                    ) : (
                        <>
                            {/* Locked Achievement Details */}
                            <div className="mb-3">
                                <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full border border-white/30">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm font-medium text-white">Challenge</span>
                                </div>
                            </div>
                            
                            {/* Show criteria as the main text */}
                            <p className="text-sm font-medium mb-3 leading-relaxed text-white/95 px-2">
                                {criteria}
                            </p>

                            {/* Also show description for context */}
                            <p className="text-xs leading-relaxed text-white/80 px-2 mb-3">
                                {description}
                            </p>
                            
                            {/* Rewards Section */}
                            {(starsReward > 0 || coinsReward > 0) && (
                                <div className="space-y-2">
                                    <p className="text-xs text-white/80 font-medium">Rewards:</p>
                                    <div className="flex gap-3 justify-center items-center">
                                        {starsReward > 0 && (
                                            <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                                                <img
                                                    src={starsImage}
                                                    alt="Stars"
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm font-semibold text-white">{starsReward}</span>
                                            </div>
                                        )}
                                        {coinsReward > 0 && (
                                            <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                                                <img
                                                    src={coinImage}
                                                    alt="Coins"
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm font-semibold text-white">{coinsReward}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default AchievementCard;