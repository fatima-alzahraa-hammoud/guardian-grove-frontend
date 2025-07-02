import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DrawingCanvas from "./DrawingCanvas";
import StoryCreator from "./StoryCreator";


interface CreativeActivityComponentProps {
    onBack: () => void;
}

interface CreativeActivity {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    component: React.ComponentType<CreativeActivityComponentProps>;
    category: 'Art' | 'Stories' | 'Colors';
}



const CreativeFun: React.FC = () => {
    const [selectedActivity, setSelectedActivity] = useState<CreativeActivity | null>(null);
    const [filterCategory, setFilterCategory] = useState<string>('All');

    const activities: CreativeActivity[] = [
        {
            id: 'drawing',
            title: 'Free Drawing',
            description: 'Create amazing artwork with our digital canvas and tools',
            icon: '🎨',
            color: 'bg-[#3A8EBA]',
            component: DrawingCanvas,
            category: 'Art'
        },
        // {
        //     id: 'coloring',
        //     title: 'Coloring Book',
        //     description: 'Color beautiful pictures and bring them to life',
        //     icon: '🖍️',
        //     color: 'from-pink-400 to-pink-600',
        //     component: ColoringBook,
        //     category: 'Colors'
        // },
        {
            id: 'stories',
            title: 'Story Creator',
            description: 'Write and illustrate your own magical stories',
            icon: '📖',
            color: 'from-blue-400 to-blue-600',
            component: StoryCreator,
            category: 'Stories'
        }
    ];

    const categories = ['All', 'Art', 'Colors', 'Stories'];

    const filteredActivities = filterCategory === 'All' 
        ? activities 
        : activities.filter(activity => activity.category === filterCategory);

    const handleActivitySelect = (activity: CreativeActivity) => {
        setSelectedActivity(activity);
    };

    const handleBackToActivities = () => {
        setSelectedActivity(null);
    };

    if (selectedActivity) {
        const ActivityComponent = selectedActivity.component;
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
            >
                <div className="mb-6">
                    <motion.button
                        onClick={handleBackToActivities}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span>←</span>
                        Back to Creative Fun
                    </motion.button>
                </div>
                <ActivityComponent onBack={handleBackToActivities} />
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="pb-10"
        >
            {/* Category Filters */}
            <motion.div 
                className="flex flex-wrap gap-3 mb-8 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
            >
                {categories.map((category, index) => (
                    <motion.button
                        key={category}
                        onClick={() => setFilterCategory(category)}
                        className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                            filterCategory === category
                                ? 'bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    >
                        {category}
                    </motion.button>
                ))}
            </motion.div>

            {/* Activities Grid */}
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
            >
                <AnimatePresence>
                    {filteredActivities.map((activity, index) => (
                        <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.9 }}
                            transition={{ 
                                delay: index * 0.1,
                                duration: 0.5,
                                ease: "easeOut"
                            }}
                            whileHover={{ 
                                y: -8,
                                transition: { duration: 0.3 }
                            }}
                            className="cursor-pointer"
                            onClick={() => handleActivitySelect(activity)}
                        >
                            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                                {/* Activity Icon */}
                                <motion.div 
                                    className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${activity.color} flex items-center justify-center text-3xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}
                                    whileHover={{ 
                                        rotate: [0, -10, 10, 0],
                                        scale: 1.15
                                    }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {activity.icon}
                                </motion.div>

                                {/* Activity Info */}
                                <h3 className="font-comic font-bold text-xl text-gray-800 mb-3 text-center">
                                    {activity.title}
                                </h3>
                                
                                <p className="text-gray-600 text-sm mb-6 text-center leading-relaxed">
                                    {activity.description}
                                </p>

                                {/* Category Tag */}
                                <div className="flex justify-center mb-6">
                                    <span className="px-4 py-2 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                                        {activity.category}
                                    </span>
                                </div>

                                {/* Start Button */}
                                <motion.button
                                    className={`w-full py-4 rounded-2xl font-semibold text-white bg-gradient-to-r ${activity.color} group-hover:shadow-lg transition-all duration-300`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Start Creating!
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {filteredActivities.length === 0 && (
                <motion.div 
                    className="text-center py-20"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div
                        className="text-6xl mb-4"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                        🎨
                    </motion.div>
                    <h3 className="font-comic font-bold text-xl text-gray-600 mb-2">
                        No activities found
                    </h3>
                    <p className="text-gray-500">
                        Try selecting a different category
                    </p>
                </motion.div>
            )}

            {/* Inspiration Gallery */}
            <motion.div 
                className="mt-16 p-8 bg-gradient-to-r from-[#FF6B6B]/10 to-[#FF8E53]/10 rounded-3xl border border-[#FF6B6B]/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
            >
                <div className="text-center">
                    <motion.h3 
                        className="font-comic font-bold text-2xl text-gray-800 mb-4"
                        whileHover={{ scale: 1.02 }}
                    >
                        🌟 Creative Gallery
                    </motion.h3>
                    <p className="text-gray-600 text-base mb-6 max-w-2xl mx-auto">
                        Share your amazing creations with family and friends! Every masterpiece tells a story.
                    </p>
                    
                    {/* Sample Creations Preview */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                        {['🎨', '🖼️', '📚'].map((emoji, index) => (
                            <motion.div
                                key={index}
                                className="aspect-square bg-white rounded-2xl flex items-center justify-center text-3xl shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                                whileHover={{ 
                                    scale: 1.05,
                                    rotate: [0, -2, 2, 0]
                                }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.8 + index * 0.1 }}
                            >
                                {emoji}
                            </motion.div>
                        ))}
                    </div>
                    
                    <motion.p 
                        className="text-sm text-gray-500 mt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                    >
                        Start creating to see your artwork here!
                    </motion.p>
                </div>
            </motion.div>

            {/* Creative Tips */}
            <motion.div 
                className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
            >
                {[
                    { icon: '💡', title: 'Get Inspired', tip: 'Look around you for colors, shapes, and stories waiting to be discovered!' },
                    { icon: '🎯', title: 'Practice Daily', tip: 'Even 5 minutes of creative time each day can spark amazing ideas!' },
                    { icon: '🌟', title: 'Share & Enjoy', tip: 'Show your family your creations - they\'ll love seeing your imagination!' }
                ].map((tip, index) => (
                    <motion.div
                        key={index}
                        className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 + index * 0.1 }}
                        whileHover={{ y: -2 }}
                    >
                        <div className="text-3xl mb-3">{tip.icon}</div>
                        <h4 className="font-comic font-bold text-gray-800 mb-2">{tip.title}</h4>
                        <p className="text-sm text-gray-600">{tip.tip}</p>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
};

export default CreativeFun;