import React from "react";
import { motion } from "framer-motion";

interface Notification {
    title: string;
    type: 'personal' | 'family';
    category: 'tip' | 'alert' | 'suggestion' | 'notification';
    message: string;
    timestamp: Date;
}

interface NotificationProp {
    notification: Notification;
}

const NotificationCard: React.FC<NotificationProp> = ({ notification }) => {
    // Enhanced color mapping with gradients and icons
    const categoryStyles: Record<string, {
        gradient: string;
        textColor: string;
        icon: JSX.Element;
        borderColor: string;
        glowColor: string;
    }> = {
        tip: {
            gradient: "bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100",
            textColor: "text-blue-800",
            borderColor: "border-blue-200",
            glowColor: "rgba(59, 130, 246, 0.3)",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
            )
        },
        alert: {
            gradient: "bg-gradient-to-br from-red-50 via-red-100 to-pink-100",
            textColor: "text-red-800",
            borderColor: "border-red-200",
            glowColor: "rgba(239, 68, 68, 0.3)",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
            )
        },
        suggestion: {
            gradient: "bg-gradient-to-br from-pink-50 via-rose-100 to-purple-100",
            textColor: "text-pink-800",
            borderColor: "border-pink-200",
            glowColor: "rgba(236, 72, 153, 0.3)",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            )
        },
        notification: {
            gradient: "bg-gradient-to-br from-emerald-50 via-green-100 to-teal-100",
            textColor: "text-emerald-800",
            borderColor: "border-emerald-200",
            glowColor: "rgba(16, 185, 129, 0.3)",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
            )
        }
    };

    const style = categoryStyles[notification.category];
    
    // Format timestamp
    const formatTimestamp = (timestamp: Date) => {
        const now = new Date();
        const diff = now.getTime() - new Date(timestamp).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return new Date(timestamp).toLocaleDateString();
    };

    // Type indicator styles
    const typeStyles = {
        personal: {
            bg: "bg-purple-100",
            text: "text-purple-700",
            icon: (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
            )
        },
        family: {
            bg: "bg-orange-100",
            text: "text-orange-700",
            icon: (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
            )
        }
    };

    return (
        <motion.div
            className={`group relative ${style.gradient} ${style.borderColor} border-2 rounded-2xl shadow-lg hover:shadow-xl p-6 font-poppins h-[230px] flex flex-col justify-between w-full max-w-sm overflow-hidden transition-all duration-300 z-10 hover:z-50`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
            whileHover={{ 
                scale: 1.05,
                y: -8,
                zIndex: 50,
                transition: { duration: 0.3 }
            }}
            style={{
                transformOrigin: "center center"
            }}
        >
            {/* Animated background glow */}
            <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                style={{
                    background: `radial-gradient(circle at 50% 50%, ${style.glowColor} 0%, transparent 70%)`,
                    filter: "blur(20px)",
                    transform: "scale(1.1)"
                }}
            />

            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                {Array.from({ length: 3 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-current rounded-full opacity-20"
                        style={{
                            left: `${20 + i * 30}%`,
                            color: style.textColor.replace('text-', '#')
                        }}
                        animate={{
                            y: [0, -10, 0],
                            opacity: [0.2, 0.5, 0.2]
                        }}
                        transition={{
                            duration: 3 + i,
                            repeat: Infinity,
                            delay: i * 0.5
                        }}
                    />
                ))}
            </div>

            {/* Header section */}
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                    {/* Category icon and title */}
                    <div className="flex items-center gap-3 flex-1">
                        <motion.div
                            className={`${style.textColor} p-2 rounded-full bg-white/50 backdrop-blur-sm`}
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                        >
                            {style.icon}
                        </motion.div>
                        <motion.h3 
                            className={`font-bold text-base ${style.textColor} line-clamp-2 leading-tight`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {notification.title}
                        </motion.h3>
                    </div>

                    {/* Type indicator */}
                    <motion.div
                        className={`${typeStyles[notification.type].bg} ${typeStyles[notification.type].text} px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ml-2 shrink-0`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    >
                        {typeStyles[notification.type].icon}
                        <span className="capitalize">{notification.type}</span>
                    </motion.div>
                </div>

                {/* Message content */}
                <motion.div
                    className="relative"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <p className={`text-sm ${style.textColor} opacity-90 line-clamp-4 leading-relaxed`}>
                        {notification.message}
                    </p>
                    
                    {/* Gradient fade for long text */}
                    <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white/80 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
            </div>

            {/* Footer section */}
            <motion.div
                className="relative z-10 flex justify-between items-center mt-auto pt-4 border-t border-white/30"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <div className="flex items-center gap-2">
                    {/* Category badge */}
                    <motion.span
                        className={`${style.textColor} bg-white/60 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium capitalize`}
                        whileHover={{ scale: 1.05 }}
                    >
                        {notification.category}
                    </motion.span>
                </div>

                {/* Timestamp with animated clock icon */}
                <motion.div
                    className={`flex items-center gap-1 ${style.textColor} opacity-70`}
                    whileHover={{ opacity: 1 }}
                >
                    <motion.svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </motion.svg>
                    <span className="text-xs font-medium">
                        {formatTimestamp(notification.timestamp)}
                    </span>
                </motion.div>
            </motion.div>

            {/* Hover effect border */}
            <motion.div
                className="absolute inset-0 border-2 border-white/0 rounded-2xl pointer-events-none"
                whileHover={{
                    borderColor: "rgba(255, 255, 255, 0.6)",
                    transition: { duration: 0.3 }
                }}
            />
        </motion.div>
    );
};

export default NotificationCard;