import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { requestApi } from "../../libs/requestApi";
import { requestMethods } from "../../libs/enum/requestMethods";
import { toast } from "react-toastify";

interface JournalEntry {
    _id: string;
    type: 'text' | 'image' | 'video' | 'audio';
    content: string;
    title: string;
    date: Date;
    thumbnail?: string;
    rotation?: number;
    backgroundColor?: string;
}

interface FamilyJournalProps {
    collapsed?: boolean;
}

const FamilyJournal: React.FC<FamilyJournalProps> = ({ collapsed = false }) => {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isCreating, setIsCreating] = useState(false);
    const [newEntry, setNewEntry] = useState<Partial<JournalEntry>>({
        type: 'text',
        title: '',
        content: ''
    });
    const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
    const [isFlipping, setIsFlipping] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editedEntry, setEditedEntry] = useState<Partial<JournalEntry>>({});
    
    // 4 entries per spread (2 pages)
    const entriesPerSpread = 4;

    // Pastel colors for memory cards
    const memoryColors = [
        "#FFF2E5", "#E5F3FF", "#F0FFF0", "#FFF0F5", "#F5F0FF", 
        "#FFFACD", "#F0F8FF", "#F5FFFA", "#FDF5E6", "#E6E6FA"
    ];

    const pageFlipVariants = {
        initial: { rotateY: 0 },
        flip: { 
            rotateY: -180,
            transition: { 
                duration: 0.8,
                ease: "easeInOut"
            }
        },
        flipBack: { 
            rotateY: 0,
            transition: { 
                duration: 0.8,
                ease: "easeInOut"
            }
        }
    };

    const memoryCardVariants = {
        hidden: { 
            opacity: 0, 
            scale: 0.8,
            y: 30
        },
        visible: { 
            opacity: 1, 
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                duration: 0.6
            }
        }
    };

    // Fetch journal entries from backend
    const fetchJournalEntries = async () => {
        try {
            setIsLoading(true);
            const response = await requestApi({
                route: "/journal/",
                method: requestMethods.GET
            });

            if (response && response.journalEntries) {
                // Add frontend-only properties (rotation and background color)
                const entriesWithFrontendProps = response.journalEntries.map((entry: JournalEntry) => ({
                    ...entry,
                    date: new Date(entry.date),
                    rotation: generateRandomRotation(),
                    backgroundColor: getRandomColor()
                }));
                setEntries(entriesWithFrontendProps);
            }
        } catch (error) {
            console.error("Error fetching journal entries:", error);
            toast.error("Failed to load journal entries");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchJournalEntries();
    }, []);

    // Floating particles background
    const FloatingParticles = () => {
        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 12 }).map((_, i) => {
                    const size = Math.random() * 6 + 3;
                    const colors = ["#3A8EBA15", "#FDE4CF15", "#E3F2FD15", "#FFD70015"];
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    const left = `${Math.random() * 100}%`;
                    const animDuration = 20 + Math.random() * 15;
                    const delay = Math.random() * -25;
                    
                    return (
                        <motion.div
                            key={i}
                            className="absolute rounded-full"
                            style={{
                                width: size,
                                height: size,
                                backgroundColor: color,
                                left,
                                top: "110%",
                            }}
                            initial={{ top: "110%" }}
                            animate={{ top: "-10%" }}
                            transition={{
                                duration: animDuration,
                                repeat: Infinity,
                                delay,
                                ease: "linear"
                            }}
                        />
                    );
                })}
            </div>
        );
    };

    const generateRandomRotation = () => Math.random() * 6 - 3; // -3 to 3 degrees
    const getRandomColor = () => memoryColors[Math.floor(Math.random() * memoryColors.length)];

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            setNewEntry({
                ...newEntry,
                content: result,
                thumbnail: file.type.startsWith('image') ? result : undefined
            });
        };
        reader.readAsDataURL(file);
    };

    const handleCreateEntry = async () => {
        if (!newEntry.title || !newEntry.content) {
            toast.error("Title and content are required");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("type", newEntry.type || 'text');
            formData.append("title", newEntry.title || '');
            
            if (newEntry.type !== 'text') {
                const files = fileInputRef.current?.files;
                if (files && files.length > 0) {
                    formData.append("media", files[0]);
                }
            } else {
                formData.append("content", newEntry.content || '');
            }

            const response = await requestApi({
                route: "/journal/",
                method: requestMethods.POST,
                body: formData,
            });

            if (response && response.journalEntry) {
                const createdEntry = {
                    ...response.journalEntry,
                    date: new Date(response.journalEntry.date),
                    rotation: generateRandomRotation(),
                    backgroundColor: getRandomColor()
                };
                
                setEntries([createdEntry, ...entries]);
                setNewEntry({ type: 'text', title: '', content: '' });
                setIsCreating(false);
                toast.success("Memory created successfully!");
            }
        } catch (error) {
            console.error("Error creating journal entry:", error);
            toast.error("Failed to create memory");
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setEditedEntry({
            title: selectedEntry?.title || '',
            content: selectedEntry?.content || '',
            type: selectedEntry?.type || 'text'
        });
    };

    const handleEditSave = async () => {
        try {
            const response = await requestApi({
                route: `/journal/`,
                method: requestMethods.PUT,
                body: {
                    entryId: selectedEntry?._id,
                    title: editedEntry.title,
                    content: editedEntry.content
                }
            });

            if (response && response.journalEntry) {
                const updatedEntries = entries.map(entry => 
                    entry._id === selectedEntry?._id ? 
                    { ...response.journalEntry, 
                    date: new Date(response.journalEntry.date),
                    rotation: entry.rotation,
                    backgroundColor: entry.backgroundColor 
                    } : entry
                );
                
                setEntries(updatedEntries);
                setSelectedEntry({
                    ...response.journalEntry,
                    date: new Date(response.journalEntry.date),
                    rotation: selectedEntry?.rotation,
                    backgroundColor: selectedEntry?.backgroundColor
                });
                setIsEditing(false);
                toast.success("Memory updated successfully!");
            }
        } catch (error) {
            console.error("Error updating journal entry:", error);
            toast.error("Failed to update memory");
        }
    };

    const handleDeleteEntry = async (id: string) => {
        try {
            await requestApi({
                route: `/journal/`,
                method: requestMethods.DELETE,
                body: { entryId : id }
            });
            
            setEntries(entries.filter(entry => entry._id !== id));
            setSelectedEntry(null);
            toast.success("Memory deleted successfully");
        } catch (error) {
            console.error("Error deleting journal entry:", error);
            toast.error("Failed to delete memory");
        }
    };

    const handlePageChange = (direction: 'next' | 'prev') => {
        setIsFlipping(true);
        setTimeout(() => {
            if (direction === 'next') {
                setCurrentPage(Math.min(totalSpreads - 1, currentPage + 1));
            } else {
                setCurrentPage(Math.max(0, currentPage - 1));
            }
            setIsFlipping(false);
        }, 400);
    };

    const totalSpreads = Math.ceil(entries.length / entriesPerSpread);
    const currentSpreadEntries = entries.slice(
        currentPage * entriesPerSpread,
        (currentPage + 1) * entriesPerSpread
    );

    // Split entries into left and right pages
    const leftPageEntries = currentSpreadEntries.slice(0, 2);
    const rightPageEntries = currentSpreadEntries.slice(2, 4);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getEntryIcon = (type: string) => {
        switch (type) {
            case 'image':
                return '📸';
            case 'video':
                return '🎬';
            case 'audio':
                return '🎵';
            default:
                return '📝';
        }
    };

    const MemoryCard = ({ entry, index }: { entry: JournalEntry; index: number }) => (
        <motion.div
            key={index}
            className="relative cursor-pointer"
            style={{ 
                transform: `rotate(${entry.rotation}deg)`,
                transformOrigin: 'center center'
            }}
            variants={memoryCardVariants}
            whileHover={{ 
                scale: 1.05, 
                rotate: 0,
                zIndex: 10,
                transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedEntry(entry)}
        >
            {/* Memory Card */}
            <div 
                className="relative p-4 rounded-lg shadow-lg min-h-[200px] w-full max-w-[240px] mx-auto"
                style={{ 
                    backgroundColor: entry.backgroundColor,
                    boxShadow: `
                        0 4px 12px rgba(0,0,0,0.1),
                        0 1px 3px rgba(0,0,0,0.08),
                        inset 0 1px 0 rgba(255,255,255,0.3)
                    `
                }}
            >
                {/* Tape effect */}
                <div 
                    className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-yellow-200 opacity-70 rounded-sm"
                    style={{
                        background: 'linear-gradient(45deg, #F7DC6F 25%, transparent 25%), linear-gradient(-45deg, #F7DC6F 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #F7DC6F 75%), linear-gradient(-45deg, transparent 75%, #F7DC6F 75%)',
                        backgroundSize: '4px 4px',
                        backgroundPosition: '0 0, 0 2px, 2px -2px, -2px 0px',
                        border: '1px solid rgba(0,0,0,0.1)'
                    }}
                />

                {/* Corner fold */}
                <div 
                    className="absolute top-0 right-0 w-6 h-6 opacity-20"
                    style={{
                        background: `linear-gradient(-45deg, transparent 46%, rgba(0,0,0,0.15) 50%, transparent 54%)`,
                        clipPath: 'polygon(100% 0, 0 100%, 100% 100%)'
                    }}
                />

                {/* Content */}
                <div className="relative z-10">
                    {/* Header with icon and date */}
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl">{getEntryIcon(entry.type)}</span>
                        <span 
                            className="text-xs px-2 py-1 rounded-full"
                            style={{ 
                                backgroundColor: 'rgba(0,0,0,0.1)',
                                fontFamily: '"Comic Sans MS", cursive'
                            }}
                        >
                            {formatDate(entry.date)}
                        </span>
                    </div>

                    {/* Title */}
                    <h4 
                        className="font-bold text-sm mb-3 leading-tight"
                        style={{ 
                            fontFamily: '"Comic Sans MS", cursive',
                            color: '#2C3E50',
                            minHeight: '32px',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}
                    >
                        {entry.title}
                    </h4>

                    {/* Content Preview */}
                    <div className="relative">
                        {entry.type === 'image' && (
                            <img 
                                src={entry.thumbnail || entry.content} 
                                alt={entry.title}
                                className="w-full h-24 object-cover rounded-md shadow-sm"
                            />
                        )}
                        
                        {entry.type === 'video' && (
                            <div className="relative">
                                <img 
                                    src={entry.thumbnail || "https://via.placeholder.com/150"} 
                                    alt={entry.title}
                                    className="w-full h-24 object-cover rounded-md shadow-sm"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-black/60 rounded-full p-2">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M8 5v10l8-5-8-5z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {entry.type === 'audio' && (
                            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-md p-6 flex items-center justify-center h-24">
                                <svg className="w-10 h-10 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
                                </svg>
                            </div>
                        )}
                        
                        {entry.type === 'text' && (
                            <div className="space-y-2">
                                <p 
                                    className="text-xs leading-relaxed"
                                    style={{ 
                                        fontFamily: '"Comic Sans MS", cursive',
                                        color: '#34495E',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 4,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {entry.content.substring(0, 80)}
                                    {entry.content.length > 80 && '...'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Hover Effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
            </div>
        </motion.div>
    );

    const BookPage = ({ entries, isLeft }: { entries: JournalEntry[]; isLeft: boolean }) => (
        <div className={`w-1/2 h-full p-8 relative ${isLeft ? 'border-r border-amber-200' : ''}`}>
            {/* Page lines */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div 
                        key={i}
                        className="border-b border-blue-200"
                        style={{ 
                            marginTop: `${30 + i * 25}px`,
                            marginLeft: isLeft ? '60px' : '20px',
                            marginRight: isLeft ? '20px' : '60px'
                        }}
                    />
                ))}
            </div>

            {/* Hole punches for left page */}
            {isLeft && (
                <div className="absolute left-8 top-0 bottom-0 flex flex-col justify-evenly">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div 
                            key={i}
                            className="w-4 h-4 bg-white border-2 border-gray-300 rounded-full shadow-inner"
                        />
                    ))}
                </div>
            )}

            {/* Page content */}
            <div className={`grid gap-6 h-full ${isLeft ? 'ml-12' : 'mr-12'} mt-4`}>
                {entries.map((entry, index) => (
                    <MemoryCard key={entry._id} entry={entry} index={index} />
                ))}
            </div>
        </div>
    );

    return (
        <div className="pt-24 pb-10 min-h-screen flex justify-center relative overflow-hidden">
            {/* Background particles */}
            <FloatingParticles />
            
            <div className={`w-full flex-grow font-poppins mx-auto px-4 ${collapsed ? "max-w-7xl" : "max-w-6xl"}`}>
                {/* Header */}
                <motion.div 
                    className="text-left mb-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-2xl font-bold font-comic text-gray-800 mb-2">
                        Family Memory Book
                        <motion.span
                            className="inline-block ml-3"
                            animate={{ 
                                rotate: [0, -10, 10, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 4
                            }}
                        >
                            📖
                        </motion.span>
                    </h2>
                    <div className="h-1 w-24 bg-[#3A8EBA] rounded-full mb-4" />
                    <p className="text-gray-600 text-base">
                        A magical place to keep your family's precious moments
                    </p>
                </motion.div>

                {/* Control Panel */}
                <motion.div 
                    className="flex justify-between items-center mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    <motion.button
                        onClick={() => setIsCreating(true)}
                        className="bg-[#3A8EBA] text-white px-6 py-3 rounded-full text-sm flex items-center shadow-lg hover:shadow-xl transition-all duration-300 group"
                        whileHover={{ scale: 1.05, backgroundColor: "#2C7EA8" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <motion.svg 
                            className="w-5 h-5 mr-2" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            animate={{ rotate: [0, 90, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </motion.svg>
                        Add New Memory
                    </motion.button>

                    {/* Page Counter */}
                    {totalSpreads > 1 && (
                        <div className="flex items-center gap-6">
                            <motion.button
                                onClick={() => handlePageChange('prev')}
                                disabled={currentPage === 0 || isFlipping}
                                className="p-3 rounded-full bg-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all duration-300"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </motion.button>

                            <span className="font-comic font-bold text-xl bg-white px-4 py-2 rounded-full shadow-md">
                                Pages {currentPage * 2 + 1}-{currentPage * 2 + 2} of {totalSpreads * 2}
                            </span>

                            <motion.button
                                onClick={() => handlePageChange('next')}
                                disabled={currentPage === totalSpreads - 1 || isFlipping}
                                className="p-3 rounded-full bg-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all duration-300"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </motion.button>
                        </div>
                    )}
                </motion.div>

                {/* Book Container */}
                <motion.div 
                    className="relative bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 rounded-3xl shadow-2xl min-h-[700px] perspective-1000"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    style={{
                        boxShadow: `
                            0 25px 50px rgba(0,0,0,0.15),
                            inset 0 1px 0 rgba(255,255,255,0.6),
                            inset 0 -1px 0 rgba(0,0,0,0.1)
                        `
                    }}
                >
                    {/* Book Spine */}
                    <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-600 rounded-l-3xl shadow-inner flex flex-col justify-center items-center">
                        <div className="transform -rotate-90 text-white font-bold text-sm whitespace-nowrap font-comic">
                            Family Memories
                        </div>
                    </div>

                    {/* Book Pages */}
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div 
                                className="flex items-center justify-center h-[700px] ml-12"
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="text-center">
                                    <motion.div
                                        className="w-64 h-64 mx-auto mb-8 relative"
                                        animate={{ 
                                            rotate: 360,
                                        }}
                                        transition={{ 
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "linear"
                                        }}
                                    >
                                        <div className="w-full h-full rounded-full border-4 border-[#3A8EBA] border-t-transparent"></div>
                                    </motion.div>
                                    <h3 className="font-comic font-bold text-2xl text-gray-600 mb-4">
                                        Loading Your Memories...
                                    </h3>
                                </div>
                            </motion.div>
                        ) : entries.length === 0 ? (
                            <motion.div 
                                className="flex items-center justify-center h-[700px] ml-12"
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="text-center">
                                    <motion.div
                                        className="w-64 h-64 mx-auto mb-8 relative"
                                        animate={{ 
                                            y: [-10, 10, -10],
                                            rotate: [-2, 2, -2]
                                        }}
                                        transition={{ 
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <img
                                            src="/assets/images/motivation.png"
                                            alt="Empty book illustration"
                                            className="w-full h-full object-contain drop-shadow-lg filter brightness-90 hover:brightness-100 transition-all duration-300"
                                        />
                                    </motion.div>
                                    <h3 className="font-comic font-bold text-2xl text-gray-600 mb-4">
                                        Your Story Starts Here
                                    </h3>
                                    <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
                                        Every great family has amazing stories to tell. Start creating your first memory!
                                    </p>
                                    <motion.button
                                        onClick={() => setIsCreating(true)}
                                        className="bg-[#3A8EBA] text-white px-8 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                                        whileHover={{ scale: 1.05, backgroundColor: "#2C7EA8" }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Create First Memory
                                    </motion.button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={`spread-${currentPage}`}
                                className="flex h-[700px] ml-12"
                                variants={pageFlipVariants}
                                initial="initial"
                                animate={isFlipping ? "flip" : "flipBack"}
                            >
                                {/* Left Page */}
                                <BookPage entries={leftPageEntries} isLeft={true} />
                                
                                {/* Right Page */}
                                <BookPage entries={rightPageEntries} isLeft={false} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Create Entry Modal */}
                <AnimatePresence>
                    {isCreating && (
                        <motion.div
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={(e) => {
                                if (e.target === e.currentTarget) {
                                    setIsCreating(false);
                                    setNewEntry({ type: 'text', title: '', content: '' });
                                }
                            }}
                        >
                            <motion.div
                                className="bg-white rounded-3xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
                                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="font-comic font-bold text-2xl text-gray-800">
                                        Create a Beautiful Memory ✨
                                    </h2>
                                    <button
                                        onClick={() => {
                                            setIsCreating(false);
                                            setNewEntry({ type: 'text', title: '', content: '' });
                                        }}
                                        className="text-gray-500 hover:text-gray-700 p-2"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Entry Type Selection */}
                                <div className="mb-8">
                                    <label className="block text-lg font-bold text-gray-700 mb-4 font-comic">Choose Memory Type</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[
                                            { type: 'text', icon: '📝', label: 'Story', color: 'from-blue-100 to-blue-200' },
                                            { type: 'image', icon: '📸', label: 'Photo', color: 'from-green-100 to-green-200' },
                                            { type: 'video', icon: '🎬', label: 'Video', color: 'from-purple-100 to-purple-200' },
                                            { type: 'audio', icon: '🎵', label: 'Audio', color: 'from-pink-100 to-pink-200' }
                                        ].map((option) => (
                                            <motion.button
                                                key={option.type}
                                                onClick={() => setNewEntry({ ...newEntry, type: option.type as JournalEntry['type'] })}
                                                className={`p-6 rounded-2xl border-3 text-center transition-all duration-300 bg-gradient-to-br ${option.color} ${
                                                    newEntry.type === option.type
                                                        ? 'border-[#3A8EBA] shadow-lg transform scale-105'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <div className="text-3xl mb-3">{option.icon}</div>
                                                <div className="text-lg font-bold font-comic">{option.label}</div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                {/* Title Input */}
                                <div className="mb-8">
                                    <label className="block text-lg font-bold text-gray-700 mb-3 font-comic">Memory Title</label>
                                    <input
                                        type="text"
                                        value={newEntry.title || ''}
                                        onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                                        placeholder="Give your memory a special title..."
                                        className="w-full p-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#3A8EBA] focus:border-transparent text-lg font-comic"
                                    />
                                </div>

                                {/* Content Input */}
                                <div className="mb-8">
                                    <label className="block text-lg font-bold text-gray-700 mb-3 font-comic">Memory Content</label>
                                    
                                    {newEntry.type === 'text' && (
                                        <textarea
                                            value={newEntry.content || ''}
                                            onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                                            placeholder="Tell the story of this beautiful moment..."
                                            rows={8}
                                            className="w-full p-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#3A8EBA] focus:border-transparent resize-none text-lg font-comic leading-relaxed"
                                        />
                                    )}

                                    {newEntry.type !== 'text' && (
                                        <div>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept={
                                                    newEntry.type === 'image' ? 'image/*' :
                                                    newEntry.type === 'video' ? 'video/*' :
                                                    'audio/*'
                                                }
                                                onChange={handleFileSelect}
                                                className="hidden"
                                            />
                                            <motion.button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-full p-12 border-3 border-dashed border-gray-300 rounded-2xl text-center hover:border-[#3A8EBA] hover:bg-[#E3F2FD] transition-all duration-300 bg-gradient-to-br from-gray-50 to-gray-100"
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                            >
                                                <div className="text-6xl mb-4">
                                                    {newEntry.type === 'image' ? '📸' : 
                                                     newEntry.type === 'video' ? '🎬' : '🎵'}
                                                </div>
                                                <div className="text-xl font-comic text-gray-600">
                                                    Click to upload your {newEntry.type}
                                                </div>
                                                <div className="text-sm text-gray-500 mt-2">
                                                    Choose a file that captures this special moment
                                                </div>
                                            </motion.button>
                                            
                                            {newEntry.content && (
                                                <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
                                                    {newEntry.type === 'image' && (
                                                        <img 
                                                            src={newEntry.content} 
                                                            alt="Preview" 
                                                            className="w-full max-h-64 object-cover rounded-xl shadow-lg"
                                                        />
                                                    )}
                                                    {newEntry.type === 'video' && (
                                                        <video 
                                                            src={newEntry.content} 
                                                            controls 
                                                            className="w-full max-h-64 rounded-xl shadow-lg"
                                                        />
                                                    )}
                                                    {newEntry.type === 'audio' && (
                                                        <div className="text-center py-8">
                                                            <div className="text-4xl mb-4">🎵</div>
                                                            <audio 
                                                                src={newEntry.content} 
                                                                controls 
                                                                className="w-full"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 justify-end">
                                    <motion.button
                                        onClick={() => {
                                            setIsCreating(false);
                                            setNewEntry({ type: 'text', title: '', content: '' });
                                        }}
                                        className="px-8 py-3 border-2 border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 transition-colors duration-300 font-comic text-lg"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        onClick={handleCreateEntry}
                                        disabled={!newEntry.title || !newEntry.content}
                                        className="px-8 py-3 bg-[#3A8EBA] text-white rounded-2xl hover:bg-[#2C7EA8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 font-comic text-lg shadow-lg"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Save Memory ✨
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* View Entry Modal */}
                <AnimatePresence>
                    {selectedEntry && (
                        <motion.div
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={(e) => {
                                if (e.target === e.currentTarget) {
                                    setSelectedEntry(null);
                                    setIsEditing(false);
                                }
                            }}
                        >
                            <motion.div
                                className="bg-white rounded-3xl p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl"
                                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header */}
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-3xl">{getEntryIcon(selectedEntry.type)}</span>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editedEntry.title || ''}
                                                    onChange={(e) => setEditedEntry({...editedEntry, title: e.target.value})}
                                                    className="font-comic font-bold text-2xl text-gray-800 border-2 border-gray-300 rounded-lg p-2"
                                                />
                                            ) : (
                                                <h2 className="font-comic font-bold text-2xl text-gray-800">
                                                    {selectedEntry.title}
                                                </h2>
                                            )}
                                        </div>
                                        <p className="text-gray-500 font-comic text-lg">
                                            {formatDate(selectedEntry.date)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {!isEditing && (
                                            <motion.button
                                                onClick={handleEditClick}
                                                className="p-3 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-2xl transition-colors duration-300"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                title="Edit Memory"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </motion.button>
                                        )}
                                        <motion.button
                                            onClick={() => handleDeleteEntry(selectedEntry._id)}
                                            className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-2xl transition-colors duration-300"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            title="Delete Memory"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </motion.button>
                                        <button
                                            onClick={() => {
                                                setSelectedEntry(null);
                                                setIsEditing(false);
                                            }}
                                            className="text-gray-500 hover:text-gray-700 p-3"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div 
                                    className="rounded-2xl p-8 min-h-[400px]"
                                    style={{ backgroundColor: selectedEntry.backgroundColor }}
                                >
                                    {isEditing ? (
                                        <div className="space-y-4">
                                            {selectedEntry.type === 'text' ? (
                                                <textarea
                                                    value={editedEntry.content || ''}
                                                    onChange={(e) => setEditedEntry({...editedEntry, content: e.target.value})}
                                                    rows={10}
                                                    className="w-full p-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#3A8EBA] focus:border-transparent resize-none text-lg font-comic leading-relaxed"
                                                />
                                            ) : (
                                                <div className="text-center text-gray-500">
                                                    <p>Media content cannot be edited. Please delete and create a new entry if needed.</p>
                                                </div>
                                            )}
                                            <div className="flex justify-end gap-4 mt-4">
                                                <motion.button
                                                    onClick={() => setIsEditing(false)}
                                                    className="px-6 py-2 border-2 border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    Cancel
                                                </motion.button>
                                                <motion.button
                                                    onClick={handleEditSave}
                                                    disabled={!editedEntry.title || (selectedEntry.type === 'text' && !editedEntry.content)}
                                                    className="px-6 py-2 bg-[#3A8EBA] text-white rounded-2xl hover:bg-[#2C7EA8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    Save Changes
                                                </motion.button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {selectedEntry.type === 'text' && (
                                                <div className="prose max-w-none">
                                                    <p 
                                                        className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg"
                                                        style={{ fontFamily: '"Comic Sans MS", cursive' }}
                                                    >
                                                        {selectedEntry.content}
                                                    </p>
                                                </div>
                                            )}

                                            {selectedEntry.type === 'image' && (
                                                <div className="text-center">
                                                    <img 
                                                        src={selectedEntry.content} 
                                                        alt={selectedEntry.title}
                                                        className="max-w-full max-h-[500px] mx-auto rounded-2xl"
                                                    />
                                                </div>
                                            )}

                                            {selectedEntry.type === 'video' && (
                                                <div className="text-center">
                                                    <video 
                                                        src={selectedEntry.content} 
                                                        controls 
                                                        className="max-w-full max-h-[500px] mx-auto rounded-2xl shadow-2xl"
                                                    />
                                                </div>
                                            )}

                                            {selectedEntry.type === 'audio' && (
                                                <div className="text-center bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-12">
                                                    <div className="text-8xl mb-6">🎵</div>
                                                    <h3 className="font-comic text-xl text-gray-700 mb-6">
                                                        Listen to this beautiful memory
                                                    </h3>
                                                    <audio 
                                                        src={selectedEntry.content} 
                                                        controls 
                                                        className="w-full max-w-lg mx-auto"
                                                    />
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default FamilyJournal;