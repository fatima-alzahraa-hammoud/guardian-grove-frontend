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

    // Helper function to preserve HTML formatting but limit content length
    const getTruncatedContent = (content: string, maxLines: number = 7) => {
        if (!content) return '';
        
        // Create a temporary div to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        
        // Get text content to check length
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        
        // If content is short, return as is
        if (textContent.length <= 150) {
            return content;
        }
        
        // For longer content, we'll truncate by counting lines
        const lines = content.split(/<\/?(div|p|br)[^>]*>/gi).filter(line => 
            line.trim() && !line.match(/^<[^>]*>$/)
        );
        
        if (lines.length <= maxLines) {
            return content;
        }
        
        // Take first few lines and add ellipsis
        const truncatedLines = lines.slice(0, maxLines).join('<br>');
        return truncatedLines + '<br>...';
    };

    // Use backend ID (_id) or fallback to frontend id
    const noteId = note._id || note.id || '';

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
                className="relative p-4 rounded-sm h-[200px] w-full flex flex-col shadow-lg"
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

                {/* Note content with proper overflow handling and spacing */}
                <div className="flex-grow relative z-10 overflow-hidden flex flex-col min-h-0">
                    {note.title && (
                        <h3 
                            className="font-bold text-base mb-2 text-gray-800 leading-tight overflow-hidden note-title"
                            style={{
                                fontFamily: '"Comic Sans MS", "Comic Sans", cursive, system-ui',
                                textShadow: '0 1px 1px rgba(255,255,255,0.5)',
                                display: '-webkit-box',
                                WebkitLineClamp: 2, // Limit title to 2 lines
                                WebkitBoxOrient: 'vertical',
                                textOverflow: 'ellipsis',
                                wordBreak: 'break-word'
                            }}
                        >
                            {note.title.length > 30 ? note.title.substring(0, 30) + '...' : note.title}
                        </h3>
                    )}
                    
                    {note.content && (
                        <div 
                            className="text-sm text-gray-700 leading-relaxed flex-grow overflow-hidden note-content"
                            style={{ 
                                color: note.textColor || '#374151',
                                fontSize: `${Math.min(note.fontSize || 14, 12)}px`, // Cap font size at 12px for cards
                                fontFamily: '"Comic Sans MS", "Comic Sans", cursive, system-ui',
                                textShadow: '0 1px 1px rgba(255,255,255,0.3)',
                                wordBreak: 'break-word'
                            }}
                            dangerouslySetInnerHTML={{ 
                                __html: getTruncatedContent(note.content, 7) 
                            }}
                        />
                    )}
                </div>

                {/* Note actions with better spacing */}
                <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 z-20">
                    <motion.button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onPin(noteId);
                        }}
                        className="p-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 relative"
                        whileHover={{ scale: 1.3 }}
                        whileTap={{ scale: 0.9 }}
                        title={note.isPinned ? "Unpin note" : "Pin note"}
                    >
                        <motion.div
                            className="absolute inset-0 bg-white rounded-full shadow-lg border border-gray-200"
                            initial={{ opacity: 0, scale: 0.6 }}
                            whileHover={{ opacity: 1, scale: 1.5 }}
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
                            onDelete(noteId);
                        }}
                        className="p-2 text-red-500 hover:text-red-700 transition-colors duration-200 relative"
                        whileHover={{ scale: 1.3 }}
                        whileTap={{ scale: 0.9 }}
                        title="Delete note"
                    >
                        <motion.div
                            className="absolute inset-0 bg-red-50 rounded-full shadow-lg border border-red-200"
                            initial={{ opacity: 0, scale: 0.6 }}
                            whileHover={{ opacity: 1, scale: 1.5 }}
                            transition={{ duration: 0.2 }}
                        />
                        <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </motion.button>
                </div>

                {/* Date stamp in corner - positioned to not overlap with buttons */}
                <div 
                    className="absolute bottom-1 left-1 text-xs text-gray-500 opacity-60 max-w-[120px] truncate"
                    style={{
                        fontFamily: '"Comic Sans MS", "Comic Sans", cursive, system-ui',
                        fontSize: '10px'
                    }}
                >
                    {note.updatedAt.toLocaleDateString()}
                </div>
            </div>

            {/* Add CSS for proper content display with formatting preserved */}
            <style>{`
                .note-content {
                    max-height: 80px;
                    line-height: 1.3;
                    overflow: hidden;
                    position: relative;
                }
                
                .note-content ul {
                    list-style-type: disc;
                    padding-left: 15px;
                    margin: 2px 0;
                }
                
                .note-content ol {
                    list-style-type: decimal;
                    padding-left: 15px;
                    margin: 2px 0;
                }
                
                .note-content li {
                    margin: 1px 0;
                    line-height: 1.2;
                }
                
                .note-content p, .note-content div {
                    margin: 2px 0;
                    line-height: 1.2;
                }
                
                .note-content br {
                    line-height: 1.2;
                }
                
                .note-content strong, .note-content b {
                    font-weight: bold;
                }
                
                .note-content em, .note-content i {
                    font-style: italic;
                }
                
                .note-content u {
                    text-decoration: underline;
                }
                
                .note-content s, .note-content strike {
                    text-decoration: line-through;
                }
                
                .note-title {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-height: 40px;
                    line-height: 1.2;
                }
            `}</style>
        </motion.div>
    );
};

export default NoteCard;