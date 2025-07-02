import React from 'react';
import { motion } from 'framer-motion';

type ProgressBarProps = {
    completed: number;
    total: number;
    label?: string;
    showPercentage?: boolean;
    animated?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ 
    completed, 
    total, 
    label,
    showPercentage = false,
    animated = true,
    size = 'md',
    className = ""
}) => {
    // Calculate percentage
    const percentage = total === 0 ? 0 : (completed / total) * 100;

    // Determine color based on percentage
    const getProgressColor = () => {
        if (percentage < 30) return "from-red-400 to-red-500";
        if (percentage < 60) return "from-orange-400 to-orange-500";
        if (percentage < 80) return "from-yellow-400 to-yellow-500";
        return "from-green-400 to-green-500";
    };

    // Get background color for the track
    const getTrackColor = () => {
        if (percentage < 30) return "bg-red-50";
        if (percentage < 60) return "bg-orange-50";
        if (percentage < 80) return "bg-yellow-50";
        return "bg-green-50";
    };

    // Size configurations
    const sizeConfig = {
        sm: { height: 'h-1.5', text: 'text-xs', spacing: 'mb-2' },
        md: { height: 'h-2', text: 'text-sm', spacing: 'mb-3' },
        lg: { height: 'h-3', text: 'text-base', spacing: 'mb-4' }
    };

    const config = sizeConfig[size];

    // Animation variants
    const progressVariants = {
        hidden: { width: 0, opacity: 0 },
        visible: { 
        width: `${percentage}%`, 
        opacity: 1,
        transition: { 
            duration: 1.2, 
            delay: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94]
        }
        }
    };

    const shimmerVariants = {
        animate: {
        x: ['-100%', '100%'],
        transition: {
            repeat: Infinity,
            duration: 2,
            ease: "linear"
        }
        }
    };

    return (
        <div className={`${config.spacing} ${className}`}>
            {/* Header with label and stats */}
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    {label && (
                        <motion.span 
                            className={`font-medium text-gray-700 ${config.text}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {label}
                        </motion.span>
                    )}
                    {percentage >= 80 && (
                        <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 1.5, duration: 0.5 }}
                            className="text-sm pl-1"
                        >
                            🎉
                        </motion.span>
                    )}
                </div>
                
                <div className="flex items-center gap-2">
                {showPercentage && (
                    <motion.span 
                        className={`font-semibold text-gray-600 ${config.text}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                    >
                        {Math.round(percentage)}%
                    </motion.span>
                )}
                <motion.span 
                    className={`text-gray-500 ${config.text}`}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {completed}/{total}
                </motion.span>
                </div>
            </div>

            {/* Progress track */}
            <div className={`w-full ${getTrackColor()} rounded-full ${config.height} relative overflow-hidden shadow-inner`}>
                {/* Progress fill */}
                {animated ? (
                    <motion.div
                        className={`${config.height} rounded-full bg-gradient-to-r ${getProgressColor()} relative overflow-hidden shadow-sm`}
                        variants={progressVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Shimmer effect for high progress */}
                        {percentage >= 70 && (
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            variants={shimmerVariants}
                            animate="animate"
                            style={{ width: '30%' }}
                        />
                        )}
                    </motion.div>
                ) : (
                    <div
                        className={`${config.height} rounded-full bg-gradient-to-r ${getProgressColor()} transition-all duration-1000 ease-out`}
                        style={{ width: `${percentage}%` }}
                    />
                )}

                {/* Glow effect for high progress */}
                {percentage >= 90 && (
                    <motion.div
                        className={`absolute inset-0 rounded-full bg-gradient-to-r ${getProgressColor()} opacity-50 blur-sm`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.3, 0] }}
                        transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        delay: 1.5
                        }}
                        style={{ width: `${percentage}%` }}
                    />
                )}
            </div>

            {/* Progress milestones indicators */}
            {size !== 'sm' && (
                <div className="flex justify-between mt-1 px-1">
                    {[25, 50, 75, 100].map((milestone) => (
                        <motion.div
                        key={milestone}
                        className={`w-1 h-1 rounded-full transition-colors duration-500 ${
                            percentage >= milestone 
                            ? 'bg-gray-400' 
                            : 'bg-gray-200'
                        }`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + (milestone / 100) * 0.5 }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProgressBar;