import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Type, Bot, X, Search,
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, IndentIncrease, IndentDecrease, Pin,
  Undo, Redo, Send, Sparkles, PaintBucket
} from "lucide-react";
import { Note, TextStyle } from "../dashboardComponents/Notes";


const NoteEditor: React.FC<{
    note: Note;
    setNote: (note: Note) => void;
    colorOptions: string[];
    textStyle: TextStyle;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    addChecklistItem: () => void;
    updateChecklistItem: (itemId: string, text: string) => void;
    toggleChecklistItem: (itemId: string) => void;
    removeChecklistItem: (itemId: string) => void;
    contentRef: React.RefObject<HTMLDivElement>;
    saveToHistory: (content: string) => void;
}> = ({ 
    note, 
    setNote, 
    onUndo, 
    onRedo, 
    canUndo, 
    canRedo,
    contentRef,
    saveToHistory
}) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showTextColorPicker, setShowTextColorPicker] = useState(false);
    const [showAIAssistant, setShowAIAssistant] = useState(false);
    const [aiMessage, setAIMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentFormatting, setCurrentFormatting] = useState({
        bold: false,
        italic: false,
        underline: false,
        strikethrough: false
    });

    const backgroundColors = [
        "#FFFFFF", "#FFF9C4", "#FFCCBC", "#FFCDD2", "#F8BBD9", "#E1BEE7",
        "#C5CAE9", "#BBDEFB", "#B2DFDB", "#C8E6C9", "#DCEDC8", "#F0F4C3",
        "#FFE0B2", "#FFAB91", "#F48FB1", "#CE93D8", "#9FA8DA", "#81C784",
        "#A5D6A7", "#80CBC4", "#B39DDB", "#90CAF9", "#FFF176", "#FFCC02",
        "#FDE4CF", "#FDEBE3", "#E3F2FD", "#FDE3EC"
    ];

    const textColors = [
        "#000000", "#424242", "#616161", "#757575", "#9E9E9E",
        "#3A8EBA", "#F44336", "#E91E63", "#9C27B0", "#673AB7",
        "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50",
        "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800",
        "#FF5722", "#795548", "#607D8B", "#1976D2", "#388E3C"
    ];

    // Check current formatting state
    const checkFormatting = () => {
        if (!document.queryCommandSupported) return;
        
        try {
            // Small delay to ensure commands are properly executed
            setTimeout(() => {
                setCurrentFormatting({
                    bold: document.queryCommandState('bold'),
                    italic: document.queryCommandState('italic'),
                    underline: document.queryCommandState('underline'),
                    strikethrough: document.queryCommandState('strikeThrough')
                });
            }, 50);
        } catch (e) {
            console.error("Error checking formatting:", e);
            // Silently handle errors
        }
    };

    // Handle selection change to update formatting buttons
    useEffect(() => {
        const handleSelectionChange = () => {
            checkFormatting();
        };

        document.addEventListener('selectionchange', handleSelectionChange);
        return () => document.removeEventListener('selectionchange', handleSelectionChange);
    }, []);

    useEffect(() => {
        if (contentRef.current) {
            // Only set placeholder if content is empty
            if (!note.content || note.content.trim() === '') {
                contentRef.current.innerHTML = '<p style="color: #9CA3AF; font-style: italic; pointer-events: none;">Start writing your note...</p>';
            } else {
                // Set the actual content
                contentRef.current.innerHTML = note.content;
            }
        }
    }, [note.id, note.content, contentRef]);

    const handleAISubmit = () => {
        if (!aiMessage.trim()) return;
        
        // add actual AI integration
        console.log("AI request:", aiMessage);
        
        setAIMessage("");
    };

    // Apply text formatting functions
    const applyFormatting = (command: string) => {
        if (contentRef.current) {
            contentRef.current.focus();
        }
        document.execCommand(command, false, undefined);
        // Update formatting state immediately
        checkFormatting();
    };

    const applyAlignment = (alignment: string) => {
        if (contentRef.current) {
            contentRef.current.focus();
        }
        
        let command = '';
        switch (alignment) {
            case 'left':
                command = 'justifyLeft';
                break;
            case 'center':
                command = 'justifyCenter';
                break;
            case 'right':
                command = 'justifyRight';
                break;
        }
        if (command) {
            document.execCommand(command, false, undefined);
        }
    };

    // Apply lists with proper TypeScript types and enhanced functionality
    const applyList = (listType: string) => {
        if (contentRef.current) {
            contentRef.current.focus();
        }
        
        if (listType === 'ordered') {
            document.execCommand('insertOrderedList', false, undefined);
        } else if (listType === 'unordered') {
            document.execCommand('insertUnorderedList', false, undefined);
        }
        
        // Proper TypeScript handling for list styling
        setTimeout(() => {
            if (contentRef.current) {
                const lists = contentRef.current.querySelectorAll('ul, ol');
                lists.forEach(list => {
                    const htmlList = list as HTMLElement; // Cast to HTMLElement to access style
                    if (list.tagName === 'UL') {
                        htmlList.style.listStyleType = 'disc';
                        htmlList.style.paddingLeft = '30px';
                        htmlList.style.marginLeft = '0px';
                        htmlList.style.margin = '10px 0';
                    } else if (list.tagName === 'OL') {
                        htmlList.style.listStyleType = 'decimal';
                        htmlList.style.paddingLeft = '30px';
                        htmlList.style.marginLeft = '0px';
                        htmlList.style.margin = '10px 0';
                    }
                });
                
                // Also style list items
                const listItems = contentRef.current.querySelectorAll('li');
                listItems.forEach(item => {
                    const htmlItem = item as HTMLElement;
                    htmlItem.style.display = 'list-item';
                    htmlItem.style.listStyle = 'inherit';
                    htmlItem.style.margin = '5px 0';
                    htmlItem.style.paddingLeft = '5px';
                });
            }
            checkFormatting();
        }, 10);
    };

    const applyIndent = (direction: 'increase' | 'decrease') => {
        if (contentRef.current) {
            contentRef.current.focus();
        }
        
        if (direction === 'increase') {
            document.execCommand('indent', false, undefined);
        } else {
            document.execCommand('outdent', false, undefined);
        }
    };

    // Apply text color to selected text
    const applyTextColor = (color: string) => {
        if (contentRef.current) {
            contentRef.current.focus();
        }
        
        // Ensure we have a selection or cursor position
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0 && selection.toString().length > 0) {
            document.execCommand('foreColor', false, color);
        } else {
            // If no selection, set default text color for new text
            setNote({ ...note, textColor: color });
        }
        setShowTextColorPicker(false);
    };

    const fontSizes = [10, 12, 14, 16, 18, 20, 24, 28, 32];

    // Handle content input without conflicts
    const handleContentInput = (e: React.FormEvent<HTMLDivElement>) => {
        const content = e.currentTarget.innerHTML;
        
        // Clear placeholder when user starts typing
        if (content.includes('Start writing your note...')) {
            e.currentTarget.innerHTML = '';
            return;
        }
        
        setNote({ ...note, content });
        saveToHistory(content);
    };

    // Handle content focus
    const handleContentFocus = (e: React.FocusEvent<HTMLDivElement>) => {
        if (e.currentTarget.innerHTML.includes('Start writing your note...')) {
            e.currentTarget.innerHTML = '';
        }
    };

    // Handle content blur
    const handleContentBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        const content = e.currentTarget.innerHTML.trim();
        if (!content || content === '<br>' || content === '<div><br></div>' || content === '<p><br></p>') {
            e.currentTarget.innerHTML = '<p style="color: #9CA3AF; font-style: italic; pointer-events: none;">Start writing your note...</p>';
            setNote({ ...note, content: '' });
        }
    };

    // Floating particles background to match your theme
    const FloatingParticles = () => {
        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 6 }).map((_, i) => {
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

    return (
        <div className="flex h-full relative bg-white font-poppins">

            {/* Floating particles background */}
            <FloatingParticles />
            
            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col relative z-10">
                {/* Header */}
                <div className="border-b border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <motion.h2 
                            className="font-comic font-extrabold text-xl text-gray-800"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            Note Editor
                            <motion.span
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
                                className="inline-block ml-2"
                            >
                                ✨
                            </motion.span>
                        </motion.h2>
                        
                        <div className="flex items-center space-x-2">
                            <motion.button
                                onClick={() => setShowAIAssistant(!showAIAssistant)}
                                className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center space-x-2 shadow-lg ${
                                    showAIAssistant 
                                        ? 'bg-[#3A8EBA] text-white' 
                                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Bot size={18} />
                                <span className="font-medium text-sm">AI Assistant</span>
                            </motion.button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search in note..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#3A8EBA] focus:border-transparent transition-all duration-300"
                        />
                    </div>
                </div>

                {/* Toolbar */}
                <div className="border-b border-gray-200 p-4">
                    <div className="flex flex-wrap gap-2 items-center">
                        {/* Undo/Redo */}
                        <div className="flex items-center bg-gray-50 rounded-lg p-1">
                            <motion.button
                                onClick={onUndo}
                                disabled={!canUndo}
                                className="p-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                                whileHover={canUndo ? { scale: 1.1 } : {}}
                                whileTap={canUndo ? { scale: 0.9 } : {}}
                                title="Undo"
                            >
                                <Undo size={16} />
                            </motion.button>
                            <motion.button
                                onClick={onRedo}
                                disabled={!canRedo}
                                className="p-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                                whileHover={canRedo ? { scale: 1.1 } : {}}
                                whileTap={canRedo ? { scale: 0.9 } : {}}
                                title="Redo"
                            >
                                <Redo size={16} />
                            </motion.button>
                        </div>

                        <div className="w-px h-8 bg-gray-300" />

                        {/* Text Formatting */}
                        <div className="flex items-center bg-gray-50 rounded-lg p-1">
                            <motion.button
                                onClick={() => applyFormatting('bold')}
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                    currentFormatting.bold 
                                        ? 'bg-[#3A8EBA] text-white shadow-lg' 
                                        : 'hover:bg-gray-200 text-gray-600'
                                }`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Bold"
                            >
                                <Bold size={16} />
                            </motion.button>
                            <motion.button
                                onClick={() => applyFormatting('italic')}
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                    currentFormatting.italic 
                                        ? 'bg-[#3A8EBA] text-white shadow-lg' 
                                        : 'hover:bg-gray-200 text-gray-600'
                                }`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Italic"
                            >
                                <Italic size={16} />
                            </motion.button>
                            <motion.button
                                onClick={() => applyFormatting('underline')}
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                    currentFormatting.underline 
                                        ? 'bg-[#3A8EBA] text-white shadow-lg' 
                                        : 'hover:bg-gray-200 text-gray-600'
                                }`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Underline"
                            >
                                <Underline size={16} />
                            </motion.button>
                            <motion.button
                                onClick={() => applyFormatting('strikeThrough')}
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                    currentFormatting.strikethrough 
                                        ? 'bg-[#3A8EBA] text-white shadow-lg' 
                                        : 'hover:bg-gray-200 text-gray-600'
                                }`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Strikethrough"
                            >
                                <Strikethrough size={16} />
                            </motion.button>
                        </div>

                        <div className="w-px h-8 bg-gray-300" />

                        {/* Alignment */}
                        <div className="flex items-center bg-gray-50 rounded-lg p-1">
                            <motion.button
                                onClick={() => applyAlignment('left')}
                                className="p-2 rounded-lg hover:bg-gray-200 text-gray-600 transition-all duration-200"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Align Left"
                            >
                                <AlignLeft size={16} />
                            </motion.button>
                            <motion.button
                                onClick={() => applyAlignment('center')}
                                className="p-2 rounded-lg hover:bg-gray-200 text-gray-600 transition-all duration-200"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Align Center"
                            >
                                <AlignCenter size={16} />
                            </motion.button>
                            <motion.button
                                onClick={() => applyAlignment('right')}
                                className="p-2 rounded-lg hover:bg-gray-200 text-gray-600 transition-all duration-200"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Align Right"
                            >
                                <AlignRight size={16} />
                            </motion.button>
                        </div>

                        <div className="w-px h-8 bg-gray-300" />

                        {/* Lists and Indentation */}
                        <div className="flex items-center bg-gray-50 rounded-lg p-1">
                            <motion.button
                                onClick={() => applyList('unordered')}
                                className="p-2 rounded-lg hover:bg-gray-200 text-gray-600 transition-all duration-200"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Bullet List"
                            >
                                <List size={16} />
                            </motion.button>
                            <motion.button
                                onClick={() => applyList('ordered')}
                                className="p-2 rounded-lg hover:bg-gray-200 text-gray-600 transition-all duration-200"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Numbered List"
                            >
                                <ListOrdered size={16} />
                            </motion.button>
                            <motion.button
                                onClick={() => applyIndent('decrease')}
                                className="p-2 rounded-lg hover:bg-gray-200 text-gray-600 transition-all duration-200"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Decrease Indent"
                            >
                                <IndentDecrease size={16} />
                            </motion.button>
                            <motion.button
                                onClick={() => applyIndent('increase')}
                                className="p-2 rounded-lg hover:bg-gray-200 text-gray-600 transition-all duration-200"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Increase Indent"
                            >
                                <IndentIncrease size={16} />
                            </motion.button>
                        </div>

                        <div className="w-px h-8 bg-gray-300" />

                        {/* Colors and Font Size */}
                        <div className="flex items-center bg-gray-50 rounded-lg p-1">
                            {/* Background Color */}
                            <div className="relative">
                                <motion.button
                                    onClick={() => {
                                        setShowColorPicker(!showColorPicker);
                                        setShowTextColorPicker(false);
                                    }}
                                    className="p-2 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center space-x-1"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    title="Background Color"
                                >
                                    <PaintBucket size={16} />
                                    <div 
                                        className="w-3 h-3 rounded-full border border-gray-300"
                                        style={{ backgroundColor: note.backgroundColor }}
                                    />
                                </motion.button>
                                
                                <AnimatePresence>
                                    {showColorPicker && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                            className="absolute top-full left-0 z-50 mt-2 p-4 bg-white border rounded-xl shadow-xl grid grid-cols-7 gap-2 w-80"
                                        >
                                            <div className="col-span-7 mb-2">
                                                <h4 className="text-sm font-comic font-bold text-gray-700 mb-2">Background Color</h4>
                                            </div>
                                            {backgroundColors.map(color => (
                                                <motion.button
                                                    key={color}
                                                    whileHover={{ scale: 1.2 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => {
                                                        setNote({ ...note, backgroundColor: color });
                                                        setShowColorPicker(false);
                                                    }}
                                                    className="w-8 h-8 rounded-lg border-2 border-gray-200 hover:border-[#3A8EBA] transition-all shadow-sm"
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Text Color for Selected Text */}
                            <div className="relative">
                                <motion.button
                                    onClick={() => {
                                        setShowTextColorPicker(!showTextColorPicker);
                                        setShowColorPicker(false);
                                    }}
                                    className="p-2 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center space-x-1"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    title="Text Color"
                                >
                                    <Type size={16} />
                                    <div 
                                        className="w-3 h-3 rounded-full border border-gray-300"
                                        style={{ backgroundColor: note.textColor }}
                                    />
                                </motion.button>
                                
                                <AnimatePresence>
                                    {showTextColorPicker && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                            className="absolute top-full left-0 z-50 mt-2 p-4 bg-white border rounded-xl shadow-xl grid grid-cols-5 gap-2 w-64"
                                        >
                                            <div className="col-span-5 mb-2">
                                                <h4 className="text-sm font-comic font-bold text-gray-700 mb-2">Text Color</h4>
                                            </div>
                                            {textColors.map(color => (
                                                <motion.button
                                                    key={color}
                                                    whileHover={{ scale: 1.2 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => applyTextColor(color)}
                                                    className="w-8 h-8 rounded-lg border-2 border-gray-200 hover:border-[#3A8EBA] transition-all shadow-sm"
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Font Size */}
                            <select
                                value={note.fontSize}
                                onChange={(e) => setNote({ ...note, fontSize: parseInt(e.target.value) })}
                                className="p-2 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A8EBA] font-poppins"
                            >
                                {fontSizes.map(size => (
                                    <option key={size} value={size}>{size}px</option>
                                ))}
                            </select>
                        </div>

                        <div className="w-px h-8 bg-gray-300" />

                        {/* Pin Note */}
                        <div className="flex items-center bg-gray-50 rounded-lg p-1">
                            <motion.button
                                onClick={() => setNote({ ...note, isPinned: !note.isPinned })}
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                    note.isPinned 
                                        ? 'bg-yellow-400 text-white shadow-lg' 
                                        : 'hover:bg-gray-200 text-gray-600'
                                }`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Pin Note"
                            >
                                <Pin size={16} />
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                    {/* Title Input */}
                    <motion.input
                        type="text"
                        placeholder="Enter your note title..."
                        value={note.title}
                        onChange={(e) => setNote({ ...note, title: e.target.value })}
                        className="w-full p-4 text-xl font-comic font-bold border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A8EBA] focus:border-transparent transition-all duration-300"
                        style={{ backgroundColor: note.backgroundColor }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    />

                    {/* FIXED: Content Editor with Text Overflow Ellipsis */}
                    <motion.div
                        ref={contentRef}
                        contentEditable
                        className="min-h-[400px] max-h-[500px] p-6 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A8EBA] focus:border-transparent transition-all duration-300 font-poppins overflow-hidden"
                        style={{ 
                            backgroundColor: note.backgroundColor,
                            color: note.textColor,
                            fontSize: `${note.fontSize}px`,
                            direction: 'ltr',
                            unicodeBidi: 'embed',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word'
                        }}
                        onInput={handleContentInput}
                        onFocus={handleContentFocus}
                        onBlur={handleContentBlur}
                        onKeyDown={(e) => {
                            if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
                                e.preventDefault();
                                onUndo();
                            }
                            if (e.ctrlKey && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                                e.preventDefault();
                                onRedo();
                            }
                        }}
                        onMouseUp={() => checkFormatting()}
                        onKeyUp={() => checkFormatting()}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    />

                    {/* Note Stats */}
                    <motion.div 
                        className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-200"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex items-center gap-4">
                            <span>Created: {note.createdAt.toLocaleDateString()}</span>
                            <span>Updated: {note.updatedAt.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span>
                                {note.content.replace(/<[^>]*>/g, '').length} characters
                            </span>
                            {note.isPinned && (
                                <span className="flex items-center text-yellow-600">
                                    <Pin size={14} className="mr-1" />
                                    Pinned
                                </span>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* AI Assistant Sidebar */}
            <AnimatePresence>
                {showAIAssistant && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 280, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="bg-gradient-to-b from-blue-50 to-purple-50 border-l border-gray-200 flex flex-col relative z-20"
                    >
                        <div className="p-3 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                                <h3 className="font-comic font-bold text-[#3A8EBA] flex items-center text-sm">
                                    <Bot size={16} className="mr-2" />
                                    AI Assistant
                                </h3>
                                <motion.button
                                    onClick={() => setShowAIAssistant(false)}
                                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <X size={14} />
                                </motion.button>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">Ask me about your note!</p>
                        </div>
                        
                        <div className="flex-1 p-3 overflow-y-auto">
                            {/* Quick Actions - Condensed */}
                            <div className="space-y-2 mb-3">
                                <h4 className="text-xs font-comic font-bold text-gray-700 flex items-center">
                                    <Sparkles size={12} className="mr-1" />
                                    Quick Actions
                                </h4>
                                <div className="grid grid-cols-1 gap-1">
                                    {[
                                        { label: "Improve Grammar", icon: "✏️" },
                                        { label: "Make Creative", icon: "✨" },
                                        { label: "Add Bullets", icon: "•" },
                                        { label: "Summarize", icon: "📝" }
                                    ].map((action) => (
                                        <motion.button
                                            key={action.label}
                                            className="p-2 bg-white rounded-lg text-left text-xs hover:bg-[#3A8EBA] hover:text-white transition-all duration-200 border border-gray-100 shadow-sm"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm">{action.icon}</span>
                                                <span className="font-medium">{action.label}</span>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Content Suggestions - Condensed */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-comic font-bold text-gray-700 flex items-center">
                                    <Type size={12} className="mr-1" />
                                    Ideas
                                </h4>
                                <div className="space-y-1">
                                    {[
                                        { label: "Add Introduction", desc: "Opening" },
                                        { label: "Create Outline", desc: "Structure" },
                                        { label: "Add Conclusion", desc: "Wrap up" }
                                    ].map((suggestion) => (
                                        <motion.button
                                            key={suggestion.label}
                                            className="w-full p-2 bg-white rounded-lg text-left hover:bg-[#FDE4CF] transition-all duration-200 border border-gray-100"
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                        >
                                            <div className="text-xs font-medium text-gray-700">{suggestion.label}</div>
                                            <div className="text-xs text-gray-500">{suggestion.desc}</div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        {/* AI Input - Condensed */}
                        <div className="p-3 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
                            <div className="space-y-2">
                                <div className="flex space-x-1">
                                    <input
                                        type="text"
                                        value={aiMessage}
                                        onChange={(e) => setAIMessage(e.target.value)}
                                        placeholder="Ask AI..."
                                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#3A8EBA] focus:ring-1 focus:ring-blue-100 transition-all duration-200 font-poppins"
                                        onKeyPress={(e) => e.key === 'Enter' && handleAISubmit()}
                                    />
                                    <motion.button 
                                        onClick={handleAISubmit}
                                        className="px-3 py-2 bg-[#3A8EBA] text-white rounded-lg hover:bg-[#2C7EA8] transition-all duration-200 shadow-lg disabled:opacity-50"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        disabled={!aiMessage.trim()}
                                    >
                                        <Send size={12} />
                                    </motion.button>
                                </div>
                                <p className="text-xs text-gray-500 text-center font-poppins">
                                    Press Enter to send ✨
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NoteEditor;