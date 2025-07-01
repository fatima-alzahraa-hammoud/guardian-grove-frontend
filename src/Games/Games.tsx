import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WordSearchGame from "./WordSearchGame";
import MemoryGame from "./MemoryGame";

interface GameCard {
    id: string;
    title: string;
    description: string;
    icon: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: 'Puzzle' | 'Memory' | 'Math' | 'Strategy';
    color: string;
    component: React.ComponentType<any>;
}

const Games: React.FC = () => {
    const [selectedGame, setSelectedGame] = useState<GameCard | null>(null);
    const [filterCategory, setFilterCategory] = useState<string>('All');

    const gameCards: GameCard[] = [
        {
            id: 'word-search',
            title: 'Word Search',
            description: 'Find hidden words in the puzzle grid with multiple difficulty levels',
            icon: '🔍',
            difficulty: 'Medium',
            category: 'Puzzle',
            color: 'from-blue-400 to-blue-600',
            component: WordSearchGame
        },
        {
            id: 'memory-game',
            title: 'Memory Match',
            description: 'Test your memory by matching pairs of cards',
            icon: '🧠',
            difficulty: 'Easy',
            category: 'Memory',
            color: 'from-purple-400 to-purple-600',
            component: MemoryGame
        },
    ];

    const categories = ['All', 'Puzzle', 'Memory', 'Math', 'Strategy'];

    const filteredGames = filterCategory === 'All' 
        ? gameCards 
        : gameCards.filter(game => game.category === filterCategory);

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'bg-green-100 text-green-800';
            case 'Medium': return 'bg-yellow-100 text-yellow-800';
            case 'Hard': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleGameSelect = (game: GameCard) => {
        setSelectedGame(game);
    };

    const handleBackToGames = () => {
        setSelectedGame(null);
    };

    if (selectedGame) {
        const GameComponent = selectedGame.component;
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="pb-10"
            >
                <div className="mb-6">
                    <motion.button
                        onClick={handleBackToGames}
                        className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 rounded-full border border-gray-200 transition-colors duration-300 font-medium"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span>←</span>
                        Back to Games
                    </motion.button>
                </div>
                <GameComponent onBack={handleBackToGames} />
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full pb-10"
        >
            {/* Category Filters - Centered */}
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
                        className={`px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 ${
                            filterCategory === category
                                ? 'bg-[#3A8EBA] text-white hover:bg-[#347ea5] border-[#3A8EBA]'
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

            {/* Games Grid - Centered with consistent card sizes */}
            <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
            >
                <AnimatePresence>
                    {filteredGames.map((game, index) => (
                        <motion.div
                            key={game.id}
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
                            className="cursor-pointer w-full max-w-[280px]"
                            onClick={() => handleGameSelect(game)}
                        >
                            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group h-full flex flex-col">
                                {/* Game Icon */}
                                <motion.div 
                                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${game.color} flex items-center justify-center text-2xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}
                                    whileHover={{ rotate: [0, -10, 10, 0] }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {game.icon}
                                </motion.div>

                                {/* Game Info */}
                                <h3 className="font-comic font-bold text-lg text-gray-800 mb-2 text-center">
                                    {game.title}
                                </h3>
                                
                                <p className="text-gray-600 text-sm mb-4 text-center leading-relaxed flex-grow">
                                    {game.description}
                                </p>

                                {/* Tags */}
                                <div className="flex justify-between items-center mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(game.difficulty)}`}>
                                        {game.difficulty}
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                        {game.category}
                                    </span>
                                </div>

                                {/* Play Button */}
                                <motion.button
                                    className={`w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${game.color} group-hover:shadow-lg transition-all duration-300`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Play Now!
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {filteredGames.length === 0 && (
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
                        🎮
                    </motion.div>
                    <h3 className="font-comic font-bold text-xl text-gray-600 mb-2">
                        No games found
                    </h3>
                    <p className="text-gray-500">
                        Try selecting a different category
                    </p>
                </motion.div>
            )}

            {/* Statistics or Achievement Teaser - Centered */}
            <motion.div 
                className="mt-12 p-6 bg-gradient-to-r from-[#3A8EBA]/10 to-[#4FC3F7]/10 rounded-2xl border border-[#3A8EBA]/20 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
            >
                <div className="text-center">
                    <motion.h3 
                        className="font-comic font-bold text-lg text-gray-800 mb-2"
                        whileHover={{ scale: 1.02 }}
                    >
                        🏆 Gaming Achievements
                    </motion.h3>
                    <p className="text-gray-600 text-sm mb-4">
                        Play games to unlock achievements and earn rewards!
                    </p>
                    <div className="flex justify-center gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-[#3A8EBA]">0</div>
                            <div className="text-xs text-gray-500">Games Played</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-[#FF6B6B]">0</div>
                            <div className="text-xs text-gray-500">High Scores</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-[#4CAF50]">0</div>
                            <div className="text-xs text-gray-500">Achievements</div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Games;