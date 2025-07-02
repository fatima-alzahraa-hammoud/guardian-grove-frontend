import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Card {
    id: number;
    emoji: string;
    isFlipped: boolean;
    isMatched: boolean;
}

interface Level {
    id: number;
    name: string;
    gridSize: number;
    theme: string;
    emojis: string[];
    timeLimit: number;
}

const MemoryGame: React.FC = () => {
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [matchedPairs, setMatchedPairs] = useState(0);
    const [moves, setMoves] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [gameState, setGameState] = useState<'menu' | 'playing' | 'won' | 'lost'>('menu');
    const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
    const [score, setScore] = useState(0);

    const levels: Level[] = [
        {
            id: 1,
            name: "Animal Friends",
            gridSize: 4,
            theme: "🐾 Animals",
            emojis: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"],
            timeLimit: 60
        },
        {
            id: 2,
            name: "Fruit Basket",
            gridSize: 4,
            theme: "🍎 Fruits",
            emojis: ["🍎", "🍌", "🍇", "🍊", "🍓", "🥝", "🍑", "🥭"],
            timeLimit: 90
        },
        {
            id: 3,
            name: "Ocean World",
            gridSize: 6,
            theme: "🌊 Sea Life",
            emojis: ["🐠", "🐟", "🐡", "🦈", "🐙", "🦀", "🐳", "🐬", "🦑", "🐚", "🦞", "🐢", "⭐", "🪼", "🦭", "🐋", "🪸", "🏝️"],
            timeLimit: 120
        }
    ];

    // Timer effect
    useEffect(() => {
        if (gameState === 'playing' && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && gameState === 'playing') {
            setGameState('lost');
        }
    }, [timeLeft, gameState]);

    // Handle card matching logic
    useEffect(() => {
        if (flippedCards.length === 2) {
            const [first, second] = flippedCards;
            const firstCard = cards.find(card => card.id === first);
            const secondCard = cards.find(card => card.id === second);

            if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
                // Match found
                setTimeout(() => {
                    setCards(cards.map(card => 
                        card.id === first || card.id === second 
                            ? { ...card, isMatched: true }
                            : card
                    ));
                    setMatchedPairs(matchedPairs + 1);
                    setFlippedCards([]);
                    setScore(score + 100 + (timeLeft * 2)); // Bonus points for time
                }, 500);
            } else {
                // No match
                setTimeout(() => {
                    setCards(cards.map(card => 
                        card.id === first || card.id === second 
                            ? { ...card, isFlipped: false }
                            : card
                    ));
                    setFlippedCards([]);
                }, 1000);
            }
            setMoves(moves + 1);
        }
    }, [flippedCards, cards, matchedPairs, score, timeLeft, moves]);

    // Check for win condition
    useEffect(() => {
        if (currentLevel && matchedPairs === (currentLevel.gridSize * currentLevel.gridSize) / 2) {
            setGameState('won');
            const timeBonus = timeLeft * 10;
            const moveBonus = Math.max(0, 100 - moves * 2);
            setScore(score + timeBonus + moveBonus);
        }
    }, [matchedPairs, currentLevel, timeLeft, moves, score]);

    const createCards = (level: Level): Card[] => {
        const totalPairs = (level.gridSize * level.gridSize) / 2;
        const selectedEmojis = level.emojis.slice(0, totalPairs);
        const cardEmojis = [...selectedEmojis, ...selectedEmojis];
        
        // Shuffle the cards
        for (let i = cardEmojis.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cardEmojis[i], cardEmojis[j]] = [cardEmojis[j], cardEmojis[i]];
        }

        return cardEmojis.map((emoji, index) => ({
            id: index,
            emoji,
            isFlipped: false,
            isMatched: false
        }));
    };

    const startGame = (level: Level) => {
        setCurrentLevel(level);
        setCards(createCards(level));
        setFlippedCards([]);
        setMatchedPairs(0);
        setMoves(0);
        setTimeLeft(level.timeLimit);
        setGameState('playing');
        setScore(0);
    };

    const handleCardClick = (cardId: number) => {
        if (gameState !== 'playing' || flippedCards.length === 2) return;
        
        const card = cards.find(c => c.id === cardId);
        if (!card || card.isFlipped || card.isMatched) return;

        setCards(cards.map(c => 
            c.id === cardId ? { ...c, isFlipped: true } : c
        ));
        setFlippedCards([...flippedCards, cardId]);
    };

    const resetGame = () => {
        setGameState('menu');
        setCurrentLevel(null);
        setCards([]);
        setFlippedCards([]);
        setMatchedPairs(0);
        setMoves(0);
        setTimeLeft(0);
        setScore(0);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Level Selection Menu
    if (gameState === 'menu') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto"
            >
                <div className="text-center mb-8">
                    <motion.h1 
                        className="text-3xl font-bold font-comic text-gray-800 mb-4"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        🧠 Memory Match
                    </motion.h1>
                    <motion.p 
                        className="text-gray-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Test your memory by matching pairs of cards!
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {levels.map((level, index) => (
                        <motion.div
                            key={level.id}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="cursor-pointer"
                            onClick={() => startGame(level)}
                        >
                            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center text-2xl mb-4 mx-auto">
                                    {level.theme.split(' ')[0]}
                                </div>
                                
                                <h3 className="font-comic font-bold text-lg text-gray-800 mb-2 text-center">
                                    {level.name}
                                </h3>
                                
                                <p className="text-gray-600 text-sm mb-4 text-center">
                                    {level.theme}
                                </p>

                                <div className="flex justify-between items-center mb-4 text-xs">
                                    <span className="text-gray-500">
                                        {level.gridSize}×{level.gridSize}
                                    </span>
                                    <span className="text-gray-500">
                                        {formatTime(level.timeLimit)}
                                    </span>
                                    <span className="text-gray-500">
                                        {(level.gridSize * level.gridSize) / 2} pairs
                                    </span>
                                </div>

                                <motion.button
                                    className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-400 to-purple-600 hover:shadow-lg transition-all duration-300"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Start Game!
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        );
    }

    // Game Screen
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
        >
            {/* Game Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold font-comic text-gray-800">
                        {currentLevel?.name}
                    </h2>
                    <p className="text-gray-600">{currentLevel?.theme}</p>
                </div>
                
                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <div className="text-lg font-bold text-[#3A8EBA]">{formatTime(timeLeft)}</div>
                        <div className="text-xs text-gray-500">Time</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-bold text-[#FF6B6B]">{moves}</div>
                        <div className="text-xs text-gray-500">Moves</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-bold text-[#4CAF50]">
                            {matchedPairs}/{currentLevel ? (currentLevel.gridSize * currentLevel.gridSize) / 2 : 0}
                        </div>
                        <div className="text-xs text-gray-500">Pairs</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-bold text-[#9C27B0]">{score}</div>
                        <div className="text-xs text-gray-500">Score</div>
                    </div>
                </div>
            </div>

            {/* Game Grid */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div 
                    className="grid gap-3 mx-auto w-fit"
                    style={{ 
                        gridTemplateColumns: `repeat(${currentLevel?.gridSize}, 1fr)`
                    }}
                >
                    {cards.map((card, index) => (
                        <motion.div
                            key={card.id}
                            initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.5 }}
                            whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
                            whileTap={{ scale: card.isMatched ? 1 : 0.95 }}
                            className={`
                                w-16 h-16 rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-center text-2xl font-bold shadow-md
                                ${card.isMatched 
                                    ? 'bg-green-100 border-2 border-green-300 cursor-default' 
                                    : card.isFlipped
                                        ? 'bg-blue-100 border-2 border-blue-300'
                                        : 'bg-gray-200 hover:bg-gray-300 border-2 border-gray-300'
                                }
                            `}
                            onClick={() => handleCardClick(card.id)}
                        >
                            <motion.div
                                initial={false}
                                animate={{ rotateY: card.isFlipped || card.isMatched ? 0 : 180 }}
                                transition={{ duration: 0.3 }}
                                style={{ 
                                    backfaceVisibility: 'hidden',
                                    transformStyle: 'preserve-3d'
                                }}
                            >
                                {card.isFlipped || card.isMatched ? card.emoji : '?'}
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Game Over Modals */}
            <AnimatePresence>
                {(gameState === 'won' || gameState === 'lost') && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                        >
                            <div className="text-6xl mb-4">
                                {gameState === 'won' ? '🎉' : '😔'}
                            </div>
                            <h3 className="text-2xl font-bold font-comic text-gray-800 mb-4">
                                {gameState === 'won' ? 'Well Done!' : 'Time\'s Up!'}
                            </h3>
                            <div className="space-y-2 mb-6">
                                <p className="text-gray-600">
                                    {gameState === 'won' 
                                        ? `You matched all pairs in ${moves} moves!`
                                        : `You matched ${matchedPairs}/${currentLevel ? (currentLevel.gridSize * currentLevel.gridSize) / 2 : 0} pairs.`
                                    }
                                </p>
                                <p className="text-lg font-bold text-[#9C27B0]">
                                    Final Score: {score}
                                </p>
                            </div>
                            <div className="flex gap-4 justify-center">
                                <motion.button
                                    onClick={resetGame}
                                    className="px-6 py-3 bg-[#3A8EBA] text-white rounded-xl font-semibold hover:bg-[#2C7EA8] transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Play Again
                                </motion.button>
                                {gameState === 'won' && currentLevel && currentLevel.id < levels.length && (
                                    <motion.button
                                        onClick={() => startGame(levels[currentLevel.id])}
                                        className="px-6 py-3 bg-[#4CAF50] text-white rounded-xl font-semibold hover:bg-[#45A049] transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Next Level
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tips */}
            <motion.div 
                className="mt-8 p-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl border border-purple-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
            >
                <h3 className="font-comic font-bold text-lg text-gray-800 mb-4 text-center">
                    🧠 Memory Tips
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                    <div className="text-center">
                        <div className="text-2xl mb-2">👀</div>
                        <strong>Pay Attention:</strong> Try to remember where each card is located!
                    </div>
                    <div className="text-center">
                        <div className="text-2xl mb-2">🔄</div>
                        <strong>Use Patterns:</strong> Group similar cards mentally to remember better.
                    </div>
                    <div className="text-center">
                        <div className="text-2xl mb-2">⚡</div>
                        <strong>Stay Focused:</strong> Take your time and don't rush your choices.
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default MemoryGame;