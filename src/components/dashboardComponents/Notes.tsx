import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NoteCard from "../cards/NoteCard";
import NoteEditor from "../cards/NoteEditor";
import { requestApi } from "../../libs/requestApi"; 
import { requestMethods } from "../../libs/enum/requestMethods";

export interface Note {
    _id?: string; // Updated to match backend
    id?: string; // Keep for backward compatibility
    title: string;
    content: string;
    backgroundColor: string;
    textColor: string;
    fontSize: number;
    isPinned: boolean;
    isChecklist: boolean;
    checklistItems: { id: string; text: string; completed: boolean }[];
    type?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface TextStyle {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
    align: 'left' | 'center' | 'right' | 'justify';
    listType: 'none' | 'ordered' | 'unordered';
}

interface NotesProps {
    collapsed?: boolean;
}

const Notes: React.FC<NotesProps> = ({ collapsed = false }) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedColor] = useState("#FFF9C4");
    const [textStyle] = useState<TextStyle>({
        bold: false,
        italic: false,
        underline: false,
        strikethrough: false,
        align: 'left',
        listType: 'none'
    });
    
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const contentRef = useRef<HTMLDivElement>(null);

    const colorOptions = [
        "#FFF9C4", // Light Yellow
        "#FFCCBC", // Light Orange
        "#FFCDD2", // Light Red
        "#F8BBD9", // Light Pink
        "#E1BEE7", // Light Purple
        "#C5CAE9", // Light Indigo
        "#BBDEFB", // Light Blue
        "#B2DFDB", // Light Teal
        "#C8E6C9", // Light Green
        "#DCEDC8", // Light Lime
        "#F0F4C3", // Light Lime Yellow
        "#FFFFFF"  // White
    ];

    // Load notes on component mount
    useEffect(() => {
        fetchNotes();
    }, []);

    // Fetch notes from backend
    const fetchNotes = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await requestApi({
                route: "/userNotes",
                method: requestMethods.GET
            });
            if (response?.notes) {
                // Convert dates and ensure proper format
                const formattedNotes = response.notes.map((note: Note) => ({
                    ...note,
                    id: note._id, // Map _id to id for compatibility
                    createdAt: new Date(note.createdAt),
                    updatedAt: new Date(note.updatedAt)
                }));
                setNotes(formattedNotes);
            }
        } catch (error) {
            console.error("Error fetching notes:", error);
            setError("Failed to load notes");
        } finally {
            setLoading(false);
        }
    };

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

    const fadeInUpVariants = {
        hidden: { 
            opacity: 0, 
            y: 30 
        },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    // Floating particles background
    const FloatingParticles = () => {
        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 8 }).map((_, i) => {
                    const size = Math.random() * 4 + 2;
                    const color = ["#3A8EBA20", "#FDE4CF20", "#E3F2FD20"][Math.floor(Math.random() * 3)];
                    const left = `${Math.random() * 100}%`;
                    const animDuration = 25 + Math.random() * 20;
                    const delay = Math.random() * -30;
                    
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

    const handleCreateNote = () => {
        const newNote: Note = {
            title: "",
            content: "",
            backgroundColor: selectedColor,
            textColor: "#000000",
            fontSize: 14,
            isPinned: false,
            isChecklist: false,
            checklistItems: [],
            type: "personal",
            createdAt: new Date(),
            updatedAt: new Date()
        };
        setEditingNote(newNote);
        setIsCreating(true);
    };

    const handleSaveNote = async () => {
        if (!editingNote) return;

        try {
            // Don't save if both title and content are empty
            if (!editingNote.title.trim() && !editingNote.content.trim()) {
                setEditingNote(null);
                setIsCreating(false);
                return;
            }

            editingNote.updatedAt = new Date();
            
            if (editingNote._id || editingNote.id) {
                // Update existing note
                const response = await requestApi({
                    route: "/userNotes",
                    method: requestMethods.PUT,
                    body: {
                        noteId: editingNote._id || editingNote.id,
                        title: editingNote.title,
                        content: editingNote.content,
                        backgroundColor: editingNote.backgroundColor,
                        textColor: editingNote.textColor,
                        fontSize: editingNote.fontSize,
                        isPinned: editingNote.isPinned,
                        isChecklist: editingNote.isChecklist,
                        checklistItems: editingNote.checklistItems
                    }
                });

                if (response?.note) {
                    const updatedNote = {
                        ...response.note,
                        id: response.note._id,
                        createdAt: new Date(response.note.createdAt),
                        updatedAt: new Date(response.note.updatedAt)
                    };
                    setNotes(notes.map(note => 
                        (note._id || note.id) === (editingNote._id || editingNote.id) ? updatedNote : note
                    ));
                }
            } else {
                // Create new note
                const response = await requestApi({
                    route: "/userNotes",
                    method: requestMethods.POST,
                    body: {
                        title: editingNote.title,
                        content: editingNote.content,
                        type: editingNote.type || "personal",
                        backgroundColor: editingNote.backgroundColor,
                        textColor: editingNote.textColor,
                        fontSize: editingNote.fontSize,
                        isPinned: editingNote.isPinned,
                        isChecklist: editingNote.isChecklist,
                        checklistItems: editingNote.checklistItems
                    }
                });

                if (response?.note) {
                    const newNote = {
                        ...response.note,
                        id: response.note._id,
                        createdAt: new Date(response.note.createdAt),
                        updatedAt: new Date(response.note.updatedAt)
                    };
                    setNotes([newNote, ...notes]);
                }
            }
        } catch (error) {
            console.error("Error saving note:", error);
            setError("Failed to save note");
        }

        setEditingNote(null);
        setIsCreating(false);
        setHistory([]);
        setHistoryIndex(-1);
    };

    const handleDeleteNote = async (id: string) => {
        try {
            await requestApi({
                route: "/userNotes",
                method: requestMethods.DELETE,
                body: { noteId: id }
            });

            setNotes(notes.filter(note => (note._id || note.id) !== id));
        } catch (error) {
            console.error("Error deleting note:", error);
            setError("Failed to delete note");
        }
    };

    const handlePinNote = async (id: string) => {
        try {
            const noteToPin = notes.find(note => (note._id || note.id) === id);
            if (!noteToPin) return;

            const response = await requestApi({
                route: "/userNotes",
                method: requestMethods.PUT,
                body: {
                    noteId: id,
                    isPinned: !noteToPin.isPinned
                }
            });

            if (response?.note) {
                const updatedNote = {
                    ...response.note,
                    id: response.note._id,
                    createdAt: new Date(response.note.createdAt),
                    updatedAt: new Date(response.note.updatedAt)
                };
                setNotes(notes.map(note => 
                    (note._id || note.id) === id ? updatedNote : note
                ));
            }
        } catch (error) {
            console.error("Error pinning note:", error);
            setError("Failed to pin note");
        }
    };

    const handleUndo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            if (editingNote && contentRef.current) {
                contentRef.current.innerHTML = history[historyIndex - 1];
                setEditingNote({
                    ...editingNote,
                    content: history[historyIndex - 1]
                });
            }
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            if (editingNote && contentRef.current) {
                contentRef.current.innerHTML = history[historyIndex + 1];
                setEditingNote({
                    ...editingNote,
                    content: history[historyIndex + 1]
                });
            }
        }
    };

    const saveToHistory = (content: string) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(content);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const addChecklistItem = () => {
        if (editingNote) {
            const newItem = {
                id: Date.now().toString(),
                text: "",
                completed: false
            };
            setEditingNote({
                ...editingNote,
                checklistItems: [...editingNote.checklistItems, newItem]
            });
        }
    };

    const updateChecklistItem = (itemId: string, text: string) => {
        if (editingNote) {
            setEditingNote({
                ...editingNote,
                checklistItems: editingNote.checklistItems.map(item =>
                    item.id === itemId ? { ...item, text } : item
                )
            });
        }
    };

    const toggleChecklistItem = (itemId: string) => {
        if (editingNote) {
            setEditingNote({
                ...editingNote,
                checklistItems: editingNote.checklistItems.map(item =>
                    item.id === itemId ? { ...item, completed: !item.completed } : item
                )
            });
        }
    };

    const removeChecklistItem = (itemId: string) => {
        if (editingNote) {
            setEditingNote({
                ...editingNote,
                checklistItems: editingNote.checklistItems.filter(item => item.id !== itemId)
            });
        }
    };

    // AI Assistant function
    const handleAIRequest = async (message: string, noteContent: string): Promise<string> => {
        try {
            const response = await requestApi({
                route: "/userNotes/askChat",
                method: requestMethods.POST,
                body: {
                    message,
                    noteContent
                }
            });

            return response?.response || "Sorry, I couldn't generate a response right now.";
        } catch (error) {
            console.error("Error getting AI response:", error);
            return "Sorry, there was an error communicating with the AI assistant.";
        }
    };

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const pinnedNotes = filteredNotes.filter(note => note.isPinned);
    const unpinnedNotes = filteredNotes.filter(note => !note.isPinned);

    // Loading state
    if (loading) {
        return (
            <div className="pt-24 min-h-screen flex justify-center items-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3A8EBA] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your notes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`pt-24 min-h-screen flex justify-center relative`}>
            {/* Background particles */}
            <FloatingParticles />
            
            <div className={`w-full flex-grow font-poppins mx-auto px-4 ${collapsed ? "max-w-6xl" : "max-w-5xl"}`}>
                {/* Error message */}
                {error && (
                    <motion.div 
                        className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {error}
                        <button 
                            onClick={() => setError(null)}
                            className="ml-2 text-red-500 hover:text-red-700"
                        >
                            ×
                        </button>
                    </motion.div>
                )}

                {/* Header - Updated to match Achievements style */}
                <motion.div 
                    className="text-left mb-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-2xl font-bold font-comic text-gray-800 mb-2">
                        My Notes
                    </h2>
                    <div className="h-1 w-24 bg-[#3A8EBA] rounded-full mb-4" />
                    <p className="text-gray-600 text-base">
                        Capture your thoughts, ideas, and memories
                    </p>
                </motion.div>

                {/* Controls Section */}
                <motion.div 
                    className="flex items-center justify-between mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    {/* Search Bar */}
                    <div className="relative max-w-md">
                        <motion.input
                            type="text"
                            placeholder="Search notes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3A8EBA] focus:border-transparent bg-white shadow-sm transition-all duration-300"
                            whileFocus={{ scale: 1.02 }}
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <motion.svg 
                                className="w-5 h-5 text-gray-400" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </motion.svg>
                        </div>
                    </div>
                    
                    {/* Create Note Button */}
                    <motion.button
                        onClick={handleCreateNote}
                        className="bg-[#3A8EBA] text-white px-6 py-3 rounded-full text-sm flex items-center shadow-lg hover:shadow-xl transition-all duration-300 group"
                        whileHover={{ scale: 1.05, backgroundColor: "#2C7EA8" }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
                    >
                        <motion.svg 
                            className="w-5 h-5 mr-2" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            animate={{ rotate: [0, 90, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </motion.svg>
                        Create Note
                    </motion.button>
                </motion.div>

                {/* Notes Grid */}
                <motion.div 
                    className="flex-grow"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Pinned Notes */}
                    {pinnedNotes.length > 0 && (
                        <motion.div 
                            className="mb-10"
                            variants={fadeInUpVariants}
                        >
                            <motion.h3 
                                className="font-comic font-bold text-lg text-gray-700 mb-6 flex items-center"
                                whileHover={{ scale: 1.02 }}
                            >
                                <motion.svg 
                                    className="w-5 h-5 mr-2" 
                                    fill="currentColor" 
                                    viewBox="0 0 20 20"
                                    animate={{ rotate: [0, 15, -15, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                                >
                                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                </motion.svg>
                                Pinned Notes
                            </motion.h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {pinnedNotes.map((note, index) => (
                                    <NoteCard
                                        key={note._id || note.id}
                                        note={note}
                                        index={index}
                                        onEdit={setEditingNote}
                                        onDelete={handleDeleteNote}
                                        onPin={handlePinNote}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Regular Notes */}
                    {unpinnedNotes.length > 0 && (
                        <motion.div
                            variants={fadeInUpVariants}
                        >
                            {pinnedNotes.length > 0 && (
                                <motion.h3 
                                    className="font-comic font-bold text-lg text-gray-700 mb-6"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    Other Notes
                                </motion.h3>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {unpinnedNotes.map((note, index) => (
                                    <NoteCard
                                        key={note._id || note.id}
                                        note={note}
                                        index={index}
                                        onEdit={setEditingNote}
                                        onDelete={handleDeleteNote}
                                        onPin={handlePinNote}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Empty State */}
                    {notes.length === 0 && (
                        <motion.div 
                            className="text-center py-20 relative"
                            variants={fadeInUpVariants}
                        >
                            <motion.div
                                className="w-56 h-56 mx-auto mb-8 relative"
                                animate={{ 
                                    y: [-8, 8, -8],
                                    rotate: [-3, 3, -3]
                                }}
                                transition={{ 
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <img
                                    src="/assets/images/AICreateNote.png"
                                    alt="No notes illustration"
                                    className="w-full h-full object-contain drop-shadow-lg filter brightness-90 hover:brightness-100 transition-all duration-300"
                                />
                                <motion.div
                                    className="absolute -top-2 -right-2 w-8 h-8 bg-[#3A8EBA]/20 rounded-full"
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.3, 0.6, 0.3]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: 0.5
                                    }}
                                />
                                <motion.div
                                    className="absolute -bottom-1 -left-1 w-6 h-6 bg-[#FDE4CF]/40 rounded-full"
                                    animate={{
                                        scale: [1, 1.3, 1],
                                        opacity: [0.4, 0.7, 0.4]
                                    }}
                                    transition={{
                                        duration: 2.5,
                                        repeat: Infinity,
                                        delay: 1
                                    }}
                                />
                            </motion.div>
                            <motion.h3 
                                className="font-comic font-bold text-xl text-gray-600 mb-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                No notes yet
                            </motion.h3>
                            <motion.p 
                                className="text-gray-500 mb-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                Start capturing your thoughts and ideas
                            </motion.p>
                            <motion.button
                                onClick={handleCreateNote}
                                className="bg-[#3A8EBA] text-white px-6 py-3 rounded-full text-sm shadow-lg hover:shadow-xl transition-all duration-300"
                                whileHover={{ scale: 1.05, backgroundColor: "#2C7EA8" }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, type: "spring" }}
                            >
                                Create your first note
                            </motion.button>
                        </motion.div>
                    )}
                </motion.div>

                {/* Note Editor Modal */}
                <AnimatePresence>
                    {(editingNote || isCreating) && (
                        <motion.div
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={(e) => {
                                if (e.target === e.currentTarget) {
                                    handleSaveNote();
                                }
                            }}
                        >
                            <motion.div
                                className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
                                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Editor Header */}
                                <div className="flex justify-between items-center mb-6">
                                    <motion.h2 
                                        className="font-comic font-bold text-xl text-gray-800"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        {isCreating ? "Create New Note" : "Edit Note"}
                                    </motion.h2>
                                    <div className="flex items-center gap-2">
                                        <motion.button
                                            onClick={handleSaveNote}
                                            className="bg-[#3A8EBA] text-white px-4 py-2 rounded-lg text-sm"
                                            whileHover={{ scale: 1.05, backgroundColor: "#2C7EA8" }}
                                            whileTap={{ scale: 0.95 }}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            Save
                                        </motion.button>
                                        <motion.button
                                            onClick={() => {
                                                setEditingNote(null);
                                                setIsCreating(false);
                                            }}
                                            className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm"
                                            whileHover={{ scale: 1.05, backgroundColor: "#6B7280" }}
                                            whileTap={{ scale: 0.95 }}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            Cancel
                                        </motion.button>
                                    </div>
                                </div>

                                {editingNote && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <NoteEditor
                                            note={editingNote}
                                            setNote={setEditingNote}
                                            colorOptions={colorOptions}
                                            textStyle={textStyle}
                                            onUndo={handleUndo}
                                            onRedo={handleRedo}
                                            canUndo={historyIndex > 0}
                                            canRedo={historyIndex < history.length - 1}
                                            addChecklistItem={addChecklistItem}
                                            updateChecklistItem={updateChecklistItem}
                                            toggleChecklistItem={toggleChecklistItem}
                                            removeChecklistItem={removeChecklistItem}
                                            contentRef={contentRef}
                                            saveToHistory={saveToHistory}
                                            onAIRequest={handleAIRequest}
                                        />
                                    </motion.div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Notes;