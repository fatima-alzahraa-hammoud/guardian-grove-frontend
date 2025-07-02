import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Games from "../../Games/Games";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import CreativeFun from "../../creative/CreativeFun";

interface FunZoneProps {
    collapsed?: boolean;
}

const FunZone: React.FC<FunZoneProps> = ({ collapsed = false }) => {
    const [activeTab, setActiveTab] = useState<'games' | 'creative'>('games');

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

    // Floating particles background
    const FloatingParticles = () => {
        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 12 }).map((_, i) => {
                    const shapes = ["🎮", "🎨", "⭐", "🌟", "🎯", "🎪"];
                    const shape = shapes[Math.floor(Math.random() * shapes.length)];
                    const size = Math.random() * 20 + 15;
                    const left = `${Math.random() * 100}%`;
                    const animDuration = 25 + Math.random() * 15;
                    const delay = Math.random() * -30;
                    
                    return (
                        <motion.div
                            key={i}
                            className="absolute flex items-center justify-center text-2xl"
                            style={{
                                width: size,
                                height: size,
                                left,
                                top: "110%",
                                fontSize: size * 0.6,
                                opacity: 0.6
                            }}
                            initial={{ top: "110%" }}
                            animate={{ top: "-10%" }}
                            transition={{
                                duration: animDuration,
                                repeat: Infinity,
                                delay,
                                ease: "linear"
                            }}
                        >
                            {shape}
                        </motion.div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="pt-24 min-h-screen flex justify-center relative overflow-hidden">
            {/* Background particles */}
            <FloatingParticles />
            
            <div className={`w-full flex-grow font-poppins mx-auto px-4 relative z-10 ${collapsed ? "max-w-6xl" : "max-w-5xl"}`}>
                {/* Header */}
                <motion.div 
                    className="text-left mb-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-2xl font-bold font-comic text-gray-800 mb-2">
                        🎪 Fun Zone
                    </h2>
                    <div className="h-1 w-24 bg-[#3A8EBA] rounded-full mb-4" />
                    <p className="text-gray-600 text-base">
                        Play games, unleash creativity, and have amazing adventures!
                    </p>
                </motion.div>

                {/* Tab Navigation - Updated to be side by side */}
                <motion.div 
                    className="flex items-center mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    <div className="flex flex-wrap gap-3">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            <Button
                                onClick={() => setActiveTab('games')}
                                variant="secondary"
                                className={cn(
                                    "bg-[#E3F2FD] hover:bg-[#d7edfd] text-gray-700 font-medium transition-all duration-300 px-6 py-3 rounded-full border border-[#3A8EBA]/20 flex items-center gap-3",
                                    activeTab === 'games' &&
                                        "bg-[#3A8EBA] text-white hover:bg-[#347ea5] border-[#3A8EBA]"
                                )}
                            >
                                <motion.span 
                                    className="text-2xl pb-1"
                                    animate={{ rotate: activeTab === 'games' ? [0, 15, -15, 0] : 0 }}
                                    transition={{ duration: 2, repeat: activeTab === 'games' ? Infinity : 0, repeatDelay: 3 }}
                                >
                                    🎮
                                </motion.span>
                                Games
                            </Button>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            <Button
                                onClick={() => setActiveTab('creative')}
                                variant="secondary"
                                className={cn(
                                    "bg-[#E3F2FD] hover:bg-[#d7edfd] text-gray-700 font-medium transition-all duration-300 px-6 py-3 rounded-full border border-[#3A8EBA]/20 flex items-center gap-3",
                                    activeTab === 'creative' &&
                                        "bg-[#FF6B6B] text-white hover:bg-[#e55f5f] border-[#FF6B6B]"
                                )}
                            >
                                <motion.span 
                                    className="text-2xl"
                                    animate={{ rotate: activeTab === 'creative' ? [0, -15, 15, 0] : 0 }}
                                    transition={{ duration: 2, repeat: activeTab === 'creative' ? Infinity : 0, repeatDelay: 3 }}
                                >
                                    🎨
                                </motion.span>
                                Creative Fun
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Content Area */}
                <motion.div 
                    className="flex-grow"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <AnimatePresence mode="wait">
                        {activeTab === 'games' ? (
                            <motion.div
                                key="games"
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Games />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="creative"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.5 }}
                            >
                                <CreativeFun />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default FunZone;