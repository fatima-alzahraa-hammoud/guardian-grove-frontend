import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";


interface Position {
    row: number;
    col: number;
}

interface Word {
    word: string;
    positions: Position[];
    found: boolean;
    direction: 'horizontal' | 'vertical' | 'diagonal';
}

interface Level {
    id: number;
    name: string;
    gridSize: number;
    words: string[];
    theme: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    timeLimit: number; // in seconds
}

const WordSearchGame: React.FC = () => {
    const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
    const [grid, setGrid] = useState<string[][]>([]);
    const [words, setWords] = useState<Word[]>([]);
    const [selectedCells, setSelectedCells] = useState<Position[]>([]);
    const [foundWords, setFoundWords] = useState<string[]>([]);
    const [isSelecting, setIsSelecting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [gameState, setGameState] = useState<'playing' | 'won' | 'lost' | 'menu'>('menu');
    const [score, setScore] = useState(0);

    const levels: Level[] = [
        {
            id: 1,
            name: "Animal Kingdom",
            gridSize: 10,
            words: ["CAT", "DOG", "BIRD", "FISH", "LION", "BEAR"],
            theme: "🐾 Animals",
            difficulty: "Easy",
            timeLimit: 300
        },
        {
            id: 2,
            name: "Colorful World",
            gridSize: 12,
            words: ["RED", "BLUE", "GREEN", "YELLOW", "PURPLE", "ORANGE", "PINK"],
            theme: "🌈 Colors",
            difficulty: "Medium", 
            timeLimit: 240
        },
        {
            id: 3,
            name: "Space Adventure",
            gridSize: 15,
            words: ["PLANET", "STAR", "GALAXY", "ROCKET", "ASTRONAUT", "MOON", "COMET", "NEBULA"],
            theme: "🚀 Space",
            difficulty: "Hard",
            timeLimit: 180
        },
        {
            id: 4,
            name: "Ocean Depths",
            gridSize: 12,
            words: ["WHALE", "SHARK", "CORAL", "WAVE", "OCEAN", "DOLPHIN", "SEAHORSE"],
            theme: "🌊 Ocean",
            difficulty: "Medium",
            timeLimit: 210
        },
        {
            id: 5,
            name: "Magic Forest",
            gridSize: 18,
            words: ["WIZARD", "DRAGON", "CASTLE", "MAGIC", "POTION", "SPELL", "FAIRY", "UNICORN", "CRYSTAL"],
            theme: "🧙‍♂️ Fantasy",
            difficulty: "Hard",
            timeLimit: 150
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

    // Check if all words are found
    useEffect(() => {
        if (currentLevel && foundWords.length === currentLevel.words.length && gameState === 'playing') {
            setGameState('won');
            const timeBonus = Math.floor(timeLeft / 10) * 50;
            const levelBonus = currentLevel.id * 100;
            setScore(score + foundWords.length * 100 + timeBonus + levelBonus);
        }
    }, [foundWords, currentLevel, timeLeft, gameState, score]);

    const generateGrid = useCallback((level: Level): { grid: string[][]; wordList: Word[] } => {
        const size = level.gridSize;
        const grid: string[][] = Array(size).fill(null).map(() => Array(size).fill(''));
        const wordList: Word[] = [];

        // Place words in grid
        level.words.forEach(word => {
            let placed = false;
            let attempts = 0;

            while (!placed && attempts < 100) {
                const direction = Math.floor(Math.random() * 3); // 0: horizontal, 1: vertical, 2: diagonal
                const reverse = Math.random() < 0.5;
                const processedWord = reverse ? word.split('').reverse().join('') : word;

                let startRow, startCol, deltaRow, deltaCol;

                if (direction === 0) { // horizontal
                    startRow = Math.floor(Math.random() * size);
                    startCol = Math.floor(Math.random() * (size - word.length + 1));
                    deltaRow = 0;
                    deltaCol = 1;
                } else if (direction === 1) { // vertical
                    startRow = Math.floor(Math.random() * (size - word.length + 1));
                    startCol = Math.floor(Math.random() * size);
                    deltaRow = 1;
                    deltaCol = 0;
                } else { // diagonal
                    startRow = Math.floor(Math.random() * (size - word.length + 1));
                    startCol = Math.floor(Math.random() * (size - word.length + 1));
                    deltaRow = 1;
                    deltaCol = 1;
                }

                // Check if word can be placed
                let canPlace = true;
                const positions: Position[] = [];

                for (let i = 0; i < word.length; i++) {
                    const row = startRow + i * deltaRow;
                    const col = startCol + i * deltaCol;
                    
                    if (row >= size || col >= size || (grid[row][col] !== '' && grid[row][col] !== processedWord[i])) {
                        canPlace = false;
                        break;
                    }
                    positions.push({ row, col });
                }

                if (canPlace) {
                    // Place the word
                    for (let i = 0; i < word.length; i++) {
                        const row = startRow + i * deltaRow;
                        const col = startCol + i * deltaCol;
                        grid[row][col] = processedWord[i];
                    }

                    wordList.push({
                        word: word,
                        positions: positions,
                        found: false,
                        direction: direction === 0 ? 'horizontal' : direction === 1 ? 'vertical' : 'diagonal'
                    });
                    placed = true;
                }
                attempts++;
            }
        });

        // Fill empty spaces with random letters
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                if (grid[row][col] === '') {
                    grid[row][col] = letters[Math.floor(Math.random() * letters.length)];
                }
            }
        }

        return { grid, wordList };
    }, []);

    const startLevel = (level: Level) => {
        setCurrentLevel(level);
        const { grid: newGrid, wordList } = generateGrid(level);
        setGrid(newGrid);
        setWords(wordList);
        setFoundWords([]);
        setSelectedCells([]);
        setTimeLeft(level.timeLimit);
        setGameState('playing');
    };

    const handleCellClick = (row: number, col: number) => {
        if (gameState !== 'playing') return;

        if (!isSelecting) {
            setIsSelecting(true);
            setSelectedCells([{ row, col }]);
        } else {
            const newSelection = [...selectedCells, { row, col }];
            setSelectedCells(newSelection);
        }
    };

    const handleMouseEnter = (row: number, col: number) => {
        if (isSelecting && selectedCells.length > 0) {
            const start = selectedCells[0];
            const path = getPathBetween(start, { row, col });
            setSelectedCells(path);
        }
    };

    const getPathBetween = (start: Position, end: Position): Position[] => {
        const path: Position[] = [];
        const deltaRow = end.row === start.row ? 0 : (end.row > start.row ? 1 : -1);
        const deltaCol = end.col === start.col ? 0 : (end.col > start.col ? 1 : -1);

        // Only allow straight lines (horizontal, vertical, diagonal)
        if (deltaRow !== 0 && deltaCol !== 0) {
            // Diagonal - must be same distance in both directions
            if (Math.abs(end.row - start.row) !== Math.abs(end.col - start.col)) {
                return [start];
            }
        }

        let currentRow = start.row;
        let currentCol = start.col;

        while (currentRow !== end.row || currentCol !== end.col) {
            path.push({ row: currentRow, col: currentCol });
            currentRow += deltaRow;
            currentCol += deltaCol;
        }
        path.push({ row: end.row, col: end.col });

        return path;
    };

    const handleMouseUp = () => {
        if (isSelecting && selectedCells.length > 1) {
            checkForWord();
        }
        setIsSelecting(false);
    };

    const checkForWord = () => {
        const selectedWord = selectedCells.map(pos => grid[pos.row][pos.col]).join('');
        const reversedWord = selectedWord.split('').reverse().join('');

        // Check if selected word matches any target word
        const foundWord = words.find(wordObj => 
            (wordObj.word === selectedWord || wordObj.word === reversedWord) && !wordObj.found
        );

        if (foundWord) {
            // Mark word as found
            setWords(words.map(w => w.word === foundWord.word ? { ...w, found: true } : w));
            setFoundWords([...foundWords, foundWord.word]);
            setScore(score + foundWord.word.length * 10);
        }

        setSelectedCells([]);
    };

    const isCellSelected = (row: number, col: number) => {
        return selectedCells.some(pos => pos.row === row && pos.col === col);
    };

    const isCellInFoundWord = (row: number, col: number) => {
        return words.some(wordObj => 
            wordObj.found && wordObj.positions.some(pos => pos.row === row && pos.col === col)
        );
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'bg-green-100 text-green-800';
            case 'Medium': return 'bg-yellow-100 text-yellow-800';
            case 'Hard': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };


    const resetGame = () => {
        setCurrentLevel(null);
        setGrid([]);
        setWords([]);
        setSelectedCells([]);
        setFoundWords([]);
        setIsSelecting(false);
        setTimeLeft(0);
        setGameState('menu');
    };

    // Level Selection Screen
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
                        🔍 Word Search Adventure
                    </motion.h1>
                    <motion.p 
                        className="text-gray-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Choose your adventure and find all the hidden words!
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {levels.map((level, index) => (
                        <motion.div
                            key={level.id}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="cursor-pointer"
                            onClick={() => startLevel(level)}
                        >
                            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${getDifficultyColor(level.difficulty)} flex items-center justify-center text-2xl mb-4 mx-auto`}>
                                    {level.theme.split(' ')[0]}
                                </div>
                                
                                <h3 className="font-comic font-bold text-lg text-gray-800 mb-2 text-center">
                                    {level.name}
                                </h3>
                                
                                <p className="text-gray-600 text-sm mb-4 text-center">
                                    {level.theme}
                                </p>

                                <div className="flex justify-between items-center mb-4 text-xs">
                                    <span className={`px-2 py-1 rounded-full font-semibold ${
                                        level.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                        level.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {level.difficulty}
                                    </span>
                                    <span className="text-gray-500">
                                        {level.gridSize}×{level.gridSize}
                                    </span>
                                    <span className="text-gray-500">
                                        {formatTime(level.timeLimit)}
                                    </span>
                                </div>

                                <div className="text-center text-xs text-gray-500 mb-4">
                                    {level.words.length} words to find
                                </div>

                                <motion.button
                                    className={`w-full py-3 rounded-xl font-semibold bg-gradient-to-r ${getDifficultyColor(level.difficulty)} hover:shadow-lg transition-all duration-300`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Start Adventure!
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
            className="max-w-6xl mx-auto"
            onMouseUp={handleMouseUp}
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
                        <div className="text-xs text-gray-500">Time Left</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-bold text-[#FF6B6B]">{score}</div>
                        <div className="text-xs text-gray-500">Score</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-bold text-[#4CAF50]">
                            {foundWords.length}/{currentLevel?.words.length}
                        </div>
                        <div className="text-xs text-gray-500">Found</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Word List */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl p-4 shadow-lg">
                        <h3 className="font-comic font-bold text-lg text-gray-800 mb-4">
                            Find These Words:
                        </h3>
                        <div className="space-y-2">
                            {words.map((wordObj, index) => (
                                <motion.div
                                    key={wordObj.word}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`p-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                                        wordObj.found
                                            ? 'bg-green-100 text-green-800 line-through'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {wordObj.word}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Game Grid */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl p-4 shadow-lg">
                        <div 
                            className="grid gap-1 mx-auto w-fit"
                            style={{ 
                                gridTemplateColumns: `repeat(${currentLevel?.gridSize}, 1fr)`,
                                userSelect: 'none'
                            }}
                        >
                            {grid.map((row, rowIndex) =>
                                row.map((cell, colIndex) => (
                                    <motion.div
                                        key={`${rowIndex}-${colIndex}`}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: (rowIndex + colIndex) * 0.01 }}
                                        className={`
                                            w-8 h-8 flex items-center justify-center text-sm font-bold cursor-pointer transition-all duration-200 rounded
                                            ${isCellInFoundWord(rowIndex, colIndex) 
                                                ? 'bg-green-200 text-green-800' 
                                                : isCellSelected(rowIndex, colIndex)
                                                    ? 'bg-blue-200 text-blue-800 transform scale-110'
                                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                            }
                                        `}
                                        onMouseDown={() => handleCellClick(rowIndex, colIndex)}
                                        onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {cell}
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
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
                                {gameState === 'won' ? 'Congratulations!' : 'Time\'s Up!'}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {gameState === 'won' 
                                    ? `You found all words! Final score: ${score}`
                                    : `You found ${foundWords.length}/${currentLevel?.words.length} words. Score: ${score}`
                                }
                            </p>
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
                                        onClick={() => startLevel(levels[currentLevel.id])}
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
        </motion.div>
    );
};

export default WordSearchGame;