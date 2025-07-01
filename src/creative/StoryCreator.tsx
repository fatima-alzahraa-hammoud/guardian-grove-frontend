import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FamilyMember {
    id: string;
    name: string;
    avatar: string;
    color: string;
    isOnline: boolean;
}

interface Cursor {
    id: string;
    x: number;
    y: number;
    name: string;
    color: string;
}

interface Story {
    id: string;
    title: string;
    content: string;
    lastModified: Date;
    contributors: string[];
    genre: string;
    coverImage: string;
}

const StoryCreator: React.FC = () => {
    const [activeStory, setActiveStory] = useState<Story | null>(null);
    const [stories, setStories] = useState<Story[]>([
        {
            id: '1',
            title: 'The Magic Kingdom Adventure',
            content: 'Once upon a time, in a land far away...',
            lastModified: new Date(),
            contributors: ['Mom', 'Dad', 'Alex'],
            genre: 'Fantasy',
            coverImage: '🏰'
        },
        {
            id: '2',
            title: 'Space Explorer Chronicles',
            content: 'Captain Luna was preparing for the biggest mission of her life...',
            lastModified: new Date(),
            contributors: ['Sarah', 'Dad'],
            genre: 'Sci-Fi',
            coverImage: '🚀'
        }
    ]);

    const [familyMembers] = useState<FamilyMember[]>([
        { id: '1', name: 'Mom', avatar: '/assets/images/mom-avatar.png', color: '#FF6B6B', isOnline: true },
        { id: '2', name: 'Dad', avatar: '/assets/images/dad-avatar.png', color: '#4ECDC4', isOnline: true },
        { id: '3', name: 'Alex', avatar: '/assets/images/alex-avatar.png', color: '#45B7D1', isOnline: false },
        { id: '4', name: 'Sarah', avatar: '/assets/images/sarah-avatar.png', color: '#96CEB4', isOnline: true },
    ]);

    const [cursors, setCursors] = useState<Cursor[]>([]);
    const [showAIAssistant, setShowAIAssistant] = useState(false);
    const [currentText, setCurrentText] = useState('');
    const editorRef = useRef<HTMLTextAreaElement>(null);

    // Simulate cursor movements
    useEffect(() => {
        const interval = setInterval(() => {
            if (activeStory) {
                const onlineMembers = familyMembers.filter(member => member.isOnline && member.name !== 'You');
                const newCursors = onlineMembers.map(member => ({
                    id: member.id,
                    x: Math.random() * 800 + 100,
                    y: Math.random() * 400 + 200,
                    name: member.name,
                    color: member.color
                }));
                setCursors(newCursors);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [activeStory, familyMembers]);

    // Floating particles background
    const FloatingParticles = () => {
        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 8 }).map((_, i) => {
                    const shapes = ["📚", "✨", "🖋️", "📖", "💫", "🌟"];
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
                                opacity: 0.3
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

    // Collaborative cursors
    const CollaborativeCursors = () => (
        <AnimatePresence>
            {cursors.map((cursor) => (
                <motion.div
                    key={cursor.id}
                    className="absolute pointer-events-none z-50"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                        x: cursor.x,
                        y: cursor.y,
                        opacity: 1,
                        scale: 1
                    }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                    <div className="relative">
                        {/* Cursor pointer */}
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="drop-shadow-lg"
                        >
                            <path
                                d="M3 3L10.5 10.5M10.5 10.5L21 12L10.5 10.5ZM10.5 10.5L12 21Z"
                                fill={cursor.color}
                                stroke="white"
                                strokeWidth="1"
                            />
                        </svg>
                        
                        {/* Name tag */}
                        <motion.div
                            className="absolute top-4 left-1 px-2 py-1 rounded-md text-xs font-medium text-white shadow-lg"
                            style={{ backgroundColor: cursor.color }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            {cursor.name}
                        </motion.div>
                    </div>
                </motion.div>
            ))}
        </AnimatePresence>
    );

    const handleCreateNewStory = () => {
        const newStory: Story = {
            id: Date.now().toString(),
            title: 'Untitled Story',
            content: '',
            lastModified: new Date(),
            contributors: ['You'],
            genre: 'Adventure',
            coverImage: '📝'
        };
        setStories([newStory, ...stories]);
        setActiveStory(newStory);
        setCurrentText('');
    };

    const handleStorySelect = (story: Story) => {
        setActiveStory(story);
        setCurrentText(story.content);
    };

    const handleBackToStories = () => {
        if (activeStory && currentText !== activeStory.content) {
            // Save changes
            setStories(stories.map(story => 
                story.id === activeStory.id 
                    ? { ...story, content: currentText, lastModified: new Date() }
                    : story
            ));
        }
        setActiveStory(null);
        setCurrentText('');
    };

    const getAIStoryAssistance = async () => {
        // Simulate AI assistance
        const suggestions = [
            "What if the main character discovers a hidden door?",
            "Perhaps add a mysterious character who knows the secret?",
            "Consider adding some dialogue between the characters.",
            "The plot could take an unexpected twist here.",
            "This would be a perfect place for some action!"
        ];
        
        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        
        // Add AI suggestion as a comment
        setTimeout(() => {
            alert(`AI Assistant suggests: "${randomSuggestion}"`);
        }, 1000);
    };

    if (activeStory) {
        return (
            <div className="pt-24 min-h-screen flex justify-center relative overflow-hidden">
                <FloatingParticles />
                <CollaborativeCursors />
                
                <div className="w-full flex-grow font-poppins mx-auto px-4 relative z-10 max-w-5xl">
                    {/* Header with back button */}
                    <motion.div 
                        className="flex items-center justify-between mb-6"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center gap-4">
                            <motion.button
                                onClick={handleBackToStories}
                                className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-300 text-sm"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span>←</span>
                                Back to Stories
                            </motion.button>
                            
                            <div>
                                <h2 className="text-xl font-bold font-comic text-gray-800">
                                    {activeStory.title}
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Contributors: {activeStory.contributors.join(', ')}
                                </p>
                            </div>
                        </div>

                        {/* Online family members */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 font-medium">Writing together:</span>
                            {familyMembers.filter(member => member.isOnline).map((member, index) => (
                                <motion.div
                                    key={member.id}
                                    className="relative"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div
                                        className="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-sm font-medium text-white"
                                        style={{ backgroundColor: member.color }}
                                    >
                                        {member.name[0]}
                                    </div>
                                    <motion.div
                                        className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Story Editor */}
                    <motion.div
                        className="bg-white rounded-2xl shadow-lg overflow-hidden relative border border-gray-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        {/* Editor toolbar */}
                        <div className="bg-[#3A8EBA] p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="text-white font-medium">Story Editor</span>
                                <div className="flex gap-2">
                                    <motion.button
                                        className="px-3 py-1 bg-white bg-opacity-20 text-white rounded-lg text-sm hover:bg-opacity-30 transition-all"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Bold
                                    </motion.button>
                                    <motion.button
                                        className="px-3 py-1 bg-white bg-opacity-20 text-white rounded-lg text-sm hover:bg-opacity-30 transition-all"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Italic
                                    </motion.button>
                                </div>
                            </div>
                            
                            <motion.button
                                onClick={() => setShowAIAssistant(!showAIAssistant)}
                                className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span>🤖</span>
                                AI Assistant
                            </motion.button>
                        </div>

                        {/* Text editor area */}
                        <div className="relative">
                            <textarea
                                ref={editorRef}
                                value={currentText}
                                onChange={(e) => setCurrentText(e.target.value)}
                                placeholder="Start writing your story together..."
                                className="w-full h-96 p-6 text-gray-800 leading-relaxed resize-none focus:outline-none text-base"
                                style={{ fontFamily: 'Georgia, serif' }}
                            />
                            
                            {/* AI Assistant Panel */}
                            <AnimatePresence>
                                {showAIAssistant && (
                                    <motion.div
                                        className="absolute top-4 right-4 bg-white rounded-2xl p-4 shadow-lg border border-gray-200 w-72"
                                        initial={{ opacity: 0, scale: 0.8, x: 50 }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.8, x: 50 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-2xl">🤖</span>
                                            <h4 className="font-comic font-bold text-[#3A8EBA]">AI Story Helper</h4>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">
                                            I can help with ideas, plot suggestions, character development, and more!
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <motion.button
                                                onClick={getAIStoryAssistance}
                                                className="px-3 py-2 bg-[#E3F2FD] text-[#3A8EBA] rounded-lg text-xs font-medium hover:bg-[#d7edfd] transition-colors"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                📝 Plot Ideas
                                            </motion.button>
                                            <motion.button
                                                onClick={getAIStoryAssistance}
                                                className="px-3 py-2 bg-[#E3F2FD] text-[#3A8EBA] rounded-lg text-xs font-medium hover:bg-[#d7edfd] transition-colors"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                👥 Characters
                                            </motion.button>
                                            <motion.button
                                                onClick={getAIStoryAssistance}
                                                className="px-3 py-2 bg-[#E3F2FD] text-[#3A8EBA] rounded-lg text-xs font-medium hover:bg-[#d7edfd] transition-colors"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                💬 Dialogue
                                            </motion.button>
                                            <motion.button
                                                onClick={getAIStoryAssistance}
                                                className="px-3 py-2 bg-[#E3F2FD] text-[#3A8EBA] rounded-lg text-xs font-medium hover:bg-[#d7edfd] transition-colors"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                🎬 Endings
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Word count and save status */}
                        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between text-sm text-gray-600">
                            <span>Words: {currentText.split(' ').filter(word => word.length > 0).length}</span>
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    Auto-saved
                                </span>
                                <motion.button
                                    className="text-[#3A8EBA] hover:text-[#2C7EA8] font-medium"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Export Story
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-10 flex justify-center relative overflow-hidden">
            <FloatingParticles />
            
            <div className="w-full flex-grow font-poppins mx-auto px-4 relative z-10 max-w-5xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <motion.h2 
                            className="text-2xl font-bold font-comic text-gray-800"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            📚 Family Story Creator
                        </motion.h2>
                        <motion.p 
                            className="text-gray-600"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            Create magical stories together with your family
                        </motion.p>
                    </div>
                    
                    <motion.button
                        onClick={handleCreateNewStory}
                        className="px-4 py-2 bg-[#3A8EBA] hover:bg-[#347ea5] text-white rounded-lg transition-colors flex items-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <span>✨</span>
                        New Story
                    </motion.button>
                </div>

                {/* Stories grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    <AnimatePresence>
                        {stories.map((story, index) => (
                            <motion.div
                                key={story.id}
                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                                transition={{ 
                                    delay: index * 0.1,
                                    duration: 0.5,
                                    ease: "easeOut"
                                }}
                                whileHover={{ y: -3 }}
                                className="cursor-pointer"
                                onClick={() => handleStorySelect(story)}
                            >
                                <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group h-full flex flex-col">
                                    {/* Story cover */}
                                    <motion.div 
                                        className="w-12 h-12 rounded-xl bg-[#3A8EBA] flex items-center justify-center text-2xl mb-4 mx-auto group-hover:scale-105 transition-transform duration-300"
                                        whileHover={{ 
                                            rotate: [0, -3, 3, 0],
                                            scale: 1.1
                                        }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <span className="text-white">{story.coverImage}</span>
                                    </motion.div>

                                    {/* Story info */}
                                    <h3 className="font-comic font-bold text-lg text-gray-800 mb-2 text-center">
                                        {story.title}
                                    </h3>
                                    
                                    <p className="text-gray-600 text-sm mb-4 text-center leading-relaxed flex-grow">
                                        {story.content || "Start writing your story..."}
                                    </p>

                                    {/* Contributors */}
                                    <div className="flex items-center justify-center gap-2 mb-3">
                                        <span className="text-xs text-gray-500">Contributors:</span>
                                        <div className="flex -space-x-1">
                                            {story.contributors.slice(0, 3).map((contributor, idx) => (
                                                <div
                                                    key={idx}
                                                    className="w-5 h-5 rounded-full bg-[#3A8EBA] border-2 border-white flex items-center justify-center text-xs text-white font-bold"
                                                >
                                                    {contributor[0]}
                                                </div>
                                            ))}
                                            {story.contributors.length > 3 && (
                                                <div className="w-5 h-5 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs text-gray-600 font-bold">
                                                    +{story.contributors.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Genre and last modified */}
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#E3F2FD] text-[#3A8EBA]">
                                            {story.genre}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {story.lastModified.toLocaleDateString()}
                                        </span>
                                    </div>

                                    {/* Continue button */}
                                    <motion.button
                                        className="w-full py-2 rounded-lg font-medium text-white bg-[#3A8EBA] hover:bg-[#347ea5] group-hover:shadow-md transition-all duration-300 text-sm mt-auto"
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                    >
                                        Continue Story
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Empty state */}
                {stories.length === 0 && (
                    <motion.div 
                        className="text-center py-16"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div
                            className="text-5xl mb-4"
                            animate={{ 
                                y: [0, -8, 0],
                                rotate: [0, 3, -3, 0]
                            }}
                            transition={{ 
                                duration: 4, 
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            📚
                        </motion.div>
                        <h3 className="font-comic font-bold text-xl text-gray-600 mb-3">
                            No stories yet!
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Create your first family story and start writing together
                        </p>
                    </motion.div>
                )}

                {/* Family writing tips */}
                <motion.div 
                    className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                >
                    {[
                        { icon: '👥', title: 'Write Together', tip: 'Take turns adding to the story and watch your imagination come to life!' },
                        { icon: '🤖', title: 'AI Helper', tip: 'Stuck? Ask our AI assistant for creative ideas and story suggestions!' },
                        { icon: '💾', title: 'Auto-Save', tip: 'Your stories are automatically saved so you never lose your creative work!' }
                    ].map((tip, index) => (
                        <motion.div
                            key={index}
                            className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 + index * 0.1 }}
                            whileHover={{ y: -2 }}
                        >
                            <motion.div 
                                className="text-2xl mb-2"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ duration: 0.3 }}
                            >
                                {tip.icon}
                            </motion.div>
                            <h4 className="font-comic font-bold text-gray-800 mb-1 text-sm">{tip.title}</h4>
                            <p className="text-xs text-gray-600">{tip.tip}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default StoryCreator;