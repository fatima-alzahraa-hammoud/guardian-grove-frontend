import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Tool {
    id: string;
    name: string;
    icon: string;
    type: 'brush' | 'eraser' | 'fill' | 'text';
}

const DrawingCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentTool, setCurrentTool] = useState<Tool>({
        id: 'brush',
        name: 'Brush',
        icon: '🖌️',
        type: 'brush'
    });
    const [brushSize, setBrushSize] = useState(5);
    const [currentColor, setCurrentColor] = useState('#000000');
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [isTyping, setIsTyping] = useState(false);
    const [textInput, setTextInput] = useState('');
    const [textPosition, setTextPosition] = useState<{x: number, y: number} | null>(null);
    const [fontSize, setFontSize] = useState(20);

    const tools: Tool[] = [
        { id: 'brush', name: 'Brush', icon: '🖌️', type: 'brush' },
        { id: 'eraser', name: 'Eraser', icon: '🧹', type: 'eraser' },
        { id: 'fill', name: 'Fill', icon: '🪣', type: 'fill' },
        { id: 'text', name: 'Text', icon: '✏️', type: 'text' }
    ];

    const colors = [
        '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
        '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
        '#FFC0CB', '#A52A2A', '#808080', '#FFD700', '#98FB98'
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Set canvas size
                canvas.width = 800;
                canvas.height = 600;
                
                // Initialize with white background
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Set better line quality
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                
                // Save initial state
                saveToHistory();
            }
        }
    }, []);

    const saveToHistory = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const dataURL = canvas.toDataURL();
            const newHistory = history.slice(0, historyIndex + 1);
            newHistory.push(dataURL);
            setHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
        }
    };

    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            loadFromHistory(historyIndex - 1);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            loadFromHistory(historyIndex + 1);
        }
    };

    const loadFromHistory = (index: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx && history[index]) {
            const img = new Image();
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            };
            img.src = history[index];
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            saveToHistory();
        }
    };

    const downloadCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const link = document.createElement('a');
            link.download = 'my-artwork.png';
            link.href = canvas.toDataURL();
            link.click();
        }
    };

    const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            
            return {
                x: (e.clientX - rect.left) * scaleX,
                y: (e.clientY - rect.top) * scaleY
            };
        }
        return { x: 0, y: 0 };
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const pos = getMousePos(e);
        
        if (currentTool.type === 'text') {
            setTextPosition(pos);
            setIsTyping(true);
            setTextInput('');
            return;
        }

        setIsDrawing(true);

        if (currentTool.type === 'brush' || currentTool.type === 'eraser') {
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        } else if (currentTool.type === 'fill') {
            floodFill(pos.x, pos.y);
        }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const pos = getMousePos(e);

        if (currentTool.type === 'brush') {
            ctx.lineTo(pos.x, pos.y);
            ctx.strokeStyle = currentColor;
            ctx.lineWidth = brushSize;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.globalCompositeOperation = 'source-over';
            ctx.stroke();
        } else if (currentTool.type === 'eraser') {
            ctx.lineTo(pos.x, pos.y);
            ctx.lineWidth = brushSize;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.globalCompositeOperation = 'destination-out';
            ctx.stroke();
        }
    };

    const stopDrawing = () => {
        if (isDrawing) {
            setIsDrawing(false);
            saveToHistory();
        }
    };

    const handleTextSubmit = () => {
        if (!textInput || !textPosition) return;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        ctx.fillStyle = currentColor;
        ctx.font = `${fontSize}px Arial`;
        ctx.fillText(textInput, textPosition.x, textPosition.y);

        setIsTyping(false);
        setTextInput('');
        setTextPosition(null);
        saveToHistory();
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleTextSubmit();
        } else if (e.key === 'Escape') {
            setIsTyping(false);
            setTextInput('');
            setTextPosition(null);
        }
    };

    const floodFill = (startX: number, startY: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        const startIndex = (Math.floor(startY) * canvas.width + Math.floor(startX)) * 4;
        const startColor = {
            r: data[startIndex],
            g: data[startIndex + 1],
            b: data[startIndex + 2],
            a: data[startIndex + 3]
        };

        // Convert hex color to RGB
        const fillColor = {
            r: parseInt(currentColor.slice(1, 3), 16),
            g: parseInt(currentColor.slice(3, 5), 16),
            b: parseInt(currentColor.slice(5, 7), 16),
            a: 255
        };

        // Don't fill if same color
        if (startColor.r === fillColor.r && startColor.g === fillColor.g && 
            startColor.b === fillColor.b && startColor.a === fillColor.a) {
            return;
        }

        const stack = [[Math.floor(startX), Math.floor(startY)]];
        const visited = new Set();

        while (stack.length > 0) {
            const [x, y] = stack.pop()!;
            const key = `${x},${y}`;
            
            if (visited.has(key) || x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
                continue;
            }
            
            visited.add(key);
            
            const index = (y * canvas.width + x) * 4;
            const currentPixel = {
                r: data[index],
                g: data[index + 1],
                b: data[index + 2],
                a: data[index + 3]
            };

            if (currentPixel.r === startColor.r && currentPixel.g === startColor.g && 
                currentPixel.b === startColor.b && currentPixel.a === startColor.a) {
                
                data[index] = fillColor.r;
                data[index + 1] = fillColor.g;
                data[index + 2] = fillColor.b;
                data[index + 3] = fillColor.a;

                stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
            }
        }

        ctx.putImageData(imageData, 0, 0);
        saveToHistory();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto pb-10"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold font-comic text-gray-800">
                        🎨 Free Drawing
                    </h2>
                    <p className="text-gray-600">Create your masterpiece!</p>
                </div>
                
                <div className="flex gap-3">
                    <motion.button
                        onClick={undo}
                        disabled={historyIndex <= 0}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        ↶ Undo
                    </motion.button>
                    <motion.button
                        onClick={redo}
                        disabled={historyIndex >= history.length - 1}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        ↷ Redo
                    </motion.button>
                    <motion.button
                        onClick={clearCanvas}
                        className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors flex items-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        🗑️ Clear
                    </motion.button>
                    <motion.button
                        onClick={downloadCanvas}
                        className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors flex items-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        💾 Save
                    </motion.button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Tools Panel */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Tools */}
                    <div className="bg-white rounded-2xl p-4 shadow-lg">
                        <h3 className="font-comic font-bold text-lg text-gray-800 mb-4">
                            Tools
                        </h3>
                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                            {tools.map((tool) => (
                                <motion.button
                                    key={tool.id}
                                    onClick={() => setCurrentTool(tool)}
                                    className={`p-3 rounded-xl transition-all duration-300 flex items-center gap-3 ${
                                        currentTool.id === tool.id
                                            ? 'bg-[#3A8EBA] text-white shadow-lg'
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="text-xl">{tool.icon}</span>
                                    <span className="font-semibold text-sm hidden lg:block">{tool.name}</span>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Brush Size */}
                    <div className="bg-white rounded-2xl p-4 shadow-lg">
                        <h3 className="font-comic font-bold text-lg text-gray-800 mb-4">
                            {currentTool.type === 'text' ? 'Font Size' : 'Brush Size'}
                        </h3>
                        <div className="space-y-3">
                            <input
                                type="range"
                                min={currentTool.type === 'text' ? "10" : "1"}
                                max={currentTool.type === 'text' ? "72" : "50"}
                                value={currentTool.type === 'text' ? fontSize : brushSize}
                                onChange={(e) => {
                                    if (currentTool.type === 'text') {
                                        setFontSize(parseInt(e.target.value));
                                    } else {
                                        setBrushSize(parseInt(e.target.value));
                                    }
                                }}
                                className="w-full"
                            />
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">
                                    {currentTool.type === 'text' 
                                        ? `Size: ${fontSize}px` 
                                        : `Size: ${brushSize}px`}
                                </span>
                                {currentTool.type !== 'text' && (
                                    <div 
                                        className="rounded-full bg-gray-800"
                                        style={{ 
                                            width: Math.min(brushSize, 30), 
                                            height: Math.min(brushSize, 30) 
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Colors */}
                    <div className="bg-white rounded-2xl p-4 shadow-lg">
                        <h3 className="font-comic font-bold text-lg text-gray-800 mb-4">
                            Colors
                        </h3>
                        <div className="grid grid-cols-5 gap-2 mb-4">
                            {colors.map((color) => (
                                <motion.button
                                    key={color}
                                    onClick={() => setCurrentColor(color)}
                                    className={`w-8 h-8 rounded-lg border-2 transition-all duration-300 ${
                                        currentColor === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                                    }`}
                                    style={{ backgroundColor: color }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                />
                            ))}
                        </div>
                        <input
                            type="color"
                            value={currentColor}
                            onChange={(e) => setCurrentColor(e.target.value)}
                            className="w-full h-10 rounded-lg border border-gray-300"
                        />
                    </div>
                </div>

                {/* Canvas */}
                <div className="lg:col-span-3 relative">
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <motion.canvas
                            ref={canvasRef}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            className="border border-gray-200 rounded-xl cursor-crosshair w-full max-w-full"
                            style={{ 
                                maxHeight: '600px',
                                display: 'block'
                            }}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        />
                        
                        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                            <span>Current Tool: {currentTool.icon} {currentTool.name}</span>
                            <span>Canvas: 800 × 600</span>
                        </div>
                    </div>

                    {/* Text Input Modal */}
                    <AnimatePresence>
                        {isTyping && textPosition && (
                            <motion.div
                                className="absolute bg-white border-2 border-[#3A8EBA] rounded-lg p-3 shadow-lg z-10"
                                style={{
                                    left: textPosition.x + 50,
                                    top: textPosition.y + 50
                                }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                <div className="mb-2">
                                    <label className="text-sm font-semibold text-gray-700">Enter text:</label>
                                </div>
                                <input
                                    type="text"
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    className="border border-gray-300 rounded px-2 py-1 w-48 focus:outline-none focus:border-[#3A8EBA]"
                                    placeholder="Type your text..."
                                    autoFocus
                                />
                                <div className="flex gap-2 mt-2">
                                    <motion.button
                                        onClick={handleTextSubmit}
                                        className="px-3 py-1 bg-[#3A8EBA] text-white rounded text-sm hover:bg-[#2C7EA8]"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Add
                                    </motion.button>
                                    <motion.button
                                        onClick={() => {
                                            setIsTyping(false);
                                            setTextInput('');
                                            setTextPosition(null);
                                        }}
                                        className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Cancel
                                    </motion.button>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Press Enter to add, Escape to cancel
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Tips */}
            <motion.div 
                className="mt-8 p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl border border-purple-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
            >
                <h3 className="font-comic font-bold text-lg text-gray-800 mb-4 text-center">
                    🌟 Drawing Tips
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                    <div className="text-center">
                        <div className="text-2xl mb-2">🎨</div>
                        <strong>Colors & Brushes:</strong> Experiment with different colors and brush sizes!
                    </div>
                    <div className="text-center">
                        <div className="text-2xl mb-2">✏️</div>
                        <strong>Text Tool:</strong> Click anywhere to add text to your artwork.
                    </div>
                    <div className="text-center">
                        <div className="text-2xl mb-2">✨</div>
                        <strong>Have Fun:</strong> There are no mistakes in art, only creative discoveries!
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default DrawingCanvas;