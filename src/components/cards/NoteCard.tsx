import React from "react";
import { motion } from "framer-motion";
import { Note } from "../dashboardComponents/Notes";

const NoteCard: React.FC<{
    note: Note;
    index: number;
    onEdit: (note: Note) => void;
    onDelete: (id: string) => void;
    onPin: (id: string) => void;
}> = ({ note, index, onEdit, onDelete, onPin }) => {

    // Generate random rotation for sticky note effect
    const rotation = (index % 4 - 1.5) * 2; // Random rotation between -3 and 3 degrees

    return (
        <motion.div
            className="relative group cursor-pointer w-[200px]"
            initial={{ opacity: 0, y: 20, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: rotation }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ 
                scale: 1.05, 
                rotate: 0,
                transition: { duration: 0.2 } 
            }}
            onClick={() => onEdit(note)}
            style={{
                transform: `rotate(${rotation}deg)`,
            }}
        >
            <div 
                className="relative p-4 pb-8 rounded-sm h-[200px] w-full flex flex-col shadow-lg"
                style={{ 
                    backgroundColor: note.backgroundColor || '#fef68a',
                    background: `linear-gradient(135deg, ${note.backgroundColor || '#fef68a'} 0%, ${note.backgroundColor || '#fef68a'}dd 100%)`,
                    boxShadow: `
                        0 1px 3px rgba(0,0,0,0.12),
                        0 1px 2px rgba(0,0,0,0.24),
                        inset 0 0 0 1px rgba(255,255,255,0.1)
                    `
                }}
            >
                {/* Sticky note tape effect at top */}
                <div 
                    className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-16 h-4 opacity-30"
                    style={{
                        background: 'repeating-linear-gradient(45deg, #0006, #0006 2px, transparent 2px, transparent 8px)',
                        borderRadius: '2px'
                    }}
                />

                {/* Pin indicator */}
                {note.isPinned && (
                    <div className="absolute -top-1 -right-1 z-10">
                        <div className="w-6 h-6 bg-red-500 rounded-full shadow-md flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 2L8 8H4l6 4.5L8 18l2-6 2 6-2-5.5L16 8h-4l-2-6z" />
                            </svg>
                        </div>
                    </div>
                )}

                {/* Folded corner effect */}
                <div 
                    className="absolute top-0 right-0 w-6 h-6 opacity-10"
                    style={{
                        background: `linear-gradient(-45deg, transparent 46%, rgba(0,0,0,0.1) 50%, transparent 54%)`,
                        clipPath: 'polygon(100% 0, 0 100%, 100% 100%)'
                    }}
                />

                {/* Note content */}
                <div className="flex-grow relative z-10 min-h-0 flex flex-col">
                    {note.title && (
                        <h3 
                            className="font-bold text-base mb-3 text-gray-800 leading-tight flex-shrink-0"
                            style={{
                                fontFamily: '"Comic Sans MS", "Comic Sans", cursive, system-ui',
                                textShadow: '0 1px 1px rgba(255,255,255,0.5)',
                                maxHeight: '40px',
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                            }}
                        >
                            {note.title}
                        </h3>
                    )}
                    
                    {note.content && (
                        <div 
                            className="text-sm text-gray-700 leading-relaxed"
                            style={{ 
                                color: note.textColor || '#374151',
                                fontSize: `${note.fontSize || 12}px`, // Reduced from 14px to 12px
                                fontFamily: '"Comic Sans MS", "Comic Sans", cursive, system-ui',
                                textShadow: '0 1px 1px rgba(255,255,255,0.3)',
                                wordBreak: 'break-word',
                                display: '-webkit-box',
                                WebkitLineClamp: 4, // Reduced from 6 to 4 lines
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxHeight: '100px', // Added explicit max height
                                lineHeight: '1.4' // Added consistent line height
                            }}
                            dangerouslySetInnerHTML={{ __html: note.content }}
                        />
                    )}
                </div>

                {/* Note actions - appear on hover with INCREASED SIZE */}
                <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 z-20">
                    <motion.button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onPin(note.id);
                        }}
                        className="p-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 relative"
                        whileHover={{ scale: 1.3 }} // Increased from 1.1 to 1.3
                        whileTap={{ scale: 0.9 }}
                        title={note.isPinned ? "Unpin note" : "Pin note"}
                    >
                        {/* Larger hover circle background with increased scale */}
                        <motion.div
                            className="absolute inset-0 bg-white rounded-full shadow-lg border border-gray-200"
                            initial={{ opacity: 0, scale: 0.6 }}
                            whileHover={{ opacity: 1, scale: 1.5 }} // Increased from 1.2 to 1.5
                            transition={{ duration: 0.2 }}
                        />
                        <svg className="w-4 h-4 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2L8 8H4l6 4.5L8 18l2-6 2 6-2-5.5L16 8h-4l-2-6z" />
                        </svg>
                    </motion.button>
                    <motion.button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDelete(note.id);
                        }}
                        className="p-2 text-red-500 hover:text-red-700 transition-colors duration-200 relative"
                        whileHover={{ scale: 1.3 }} // Increased from 1.1 to 1.3
                        whileTap={{ scale: 0.9 }}
                        title="Delete note"
                    >
                        {/* Larger hover circle background with increased scale */}
                        <motion.div
                            className="absolute inset-0 bg-red-50 rounded-full shadow-lg border border-red-200"
                            initial={{ opacity: 0, scale: 0.6 }}
                            whileHover={{ opacity: 1, scale: 1.5 }} // Increased from 1.2 to 1.5
                            transition={{ duration: 0.2 }}
                        />
                        <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </motion.button>
                </div>

                {/* Date stamp in corner */}
                <div 
                    className="absolute bottom-1 left-1 text-xs text-gray-500 opacity-60"
                    style={{
                        fontFamily: '"Comic Sans MS", "Comic Sans", cursive, system-ui',
                        fontSize: '10px'
                    }}
                >
                    {note.updatedAt.toLocaleDateString()}
                </div>
            </div>
        </motion.div>
    );
};

export default NoteCard;
