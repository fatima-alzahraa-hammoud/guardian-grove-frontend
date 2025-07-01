import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { selectName, selectAvatar, selectRole } from "../../redux/slices/userSlice";
import { selectFamilyMembers } from "../../redux/slices/familySlice";

interface Message {
    id: string;
    senderId: string;
    senderName: string;
    senderAvatar: string;
    content: string;
    timestamp: Date;
    type: 'text' | 'emoji' | 'sticker';
    chatId: string;
}

interface Chat {
    id: string;
    name: string;
    avatar?: string;
    type: 'direct' | 'group';
    members: string[];
    lastMessage?: Message;
    unreadCount: number;
    isOnline?: boolean;
}

interface FamilyMessagingProps {
    collapsed?: boolean;
}

const FamilyMessaging: React.FC<FamilyMessagingProps> = () => {
    const currentUser = {
        name: useSelector(selectName),
        avatar: useSelector(selectAvatar),
        role: useSelector(selectRole)
    };
    
    const familyMembers = useSelector(selectFamilyMembers);
    const [activeChat, setActiveChat] = useState<Chat | null>(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [chats, setChats] = useState<Chat[]>([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [groupName, setGroupName] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Sample emojis for quick access
    const quickEmojis = ["😊", "❤️", "👍", "😂", "🎉", "🥰", "👏", "🔥", "💯", "🌟"];

    // Sample stickers
    const familyStickers = [
        "🐻", "🦄", "🐸", "🐱", "🐶", "🦋", "🌈", "⭐", "🎈", "🎁"
    ];

    // Floating particles background
    const FloatingParticles = () => {
        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 8 }).map((_, i) => {
                    const size = Math.random() * 6 + 3;
                    const color = ["#3A8EBA15", "#FDE4CF20", "#E3F2FD20", "#FDEBE315"][Math.floor(Math.random() * 4)];
                    const left = `${Math.random() * 100}%`;
                    const animDuration = 30 + Math.random() * 25;
                    const delay = Math.random() * -35;
                    
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

    // Initialize sample chats and messages
    useEffect(() => {
        // Create family group chat
        const familyGroup: Chat = {
            id: "family-group",
            name: "Family Chat 👨‍👩‍👧‍👦",
            type: "group",
            members: familyMembers.map(m => m._id),
            unreadCount: 0
        };

        // Create direct chats with family members
        const directChats: Chat[] = familyMembers
            .filter(member => member.name !== currentUser.name)
            .map(member => ({
                id: `direct-${member._id}`,
                name: member.name,
                avatar: member.avatar,
                type: "direct" as const,
                members: [member._id, "current-user"],
                unreadCount: Math.floor(Math.random() * 3),
                isOnline: Math.random() > 0.5
            }));

        setChats([familyGroup, ...directChats]);

        // Sample messages
        const sampleMessages: Message[] = [
            {
                id: "1",
                senderId: "mom",
                senderName: "Mom",
                senderAvatar: "/assets/images/mom-avatar.png",
                content: "Good morning everyone! 🌅",
                timestamp: new Date(Date.now() - 3600000),
                type: "text",
                chatId: "family-group"
            },
            {
                id: "2",
                senderId: "dad",
                senderName: "Dad",
                senderAvatar: "/assets/images/dad-avatar.png",
                content: "Who wants pancakes for breakfast? 🥞",
                timestamp: new Date(Date.now() - 3000000),
                type: "text",
                chatId: "family-group"
            }
        ];
        setMessages(sampleMessages);
    }, [familyMembers, currentUser.name]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = () => {
        if (!message.trim() || !activeChat) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            senderId: "current-user",
            senderName: currentUser.name || "",
            senderAvatar: currentUser.avatar || "",
            content: message,
            timestamp: new Date(),
            type: "text",
            chatId: activeChat.id
        };

        setMessages(prev => [...prev, newMessage]);
        setMessage("");
    };

    const sendQuickEmoji = (emoji: string) => {
        if (!activeChat) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            senderId: "current-user",
            senderName: currentUser.name || "",
            senderAvatar: currentUser.avatar || "",
            content: emoji,
            timestamp: new Date(),
            type: "emoji",
            chatId: activeChat.id
        };

        setMessages(prev => [...prev, newMessage]);
    };

    const createGroupChat = () => {
        if (!groupName.trim() || selectedMembers.length === 0) return;

        const newGroup: Chat = {
            id: `group-${Date.now()}`,
            name: groupName,
            type: "group",
            members: [...selectedMembers, "current-user"],
            unreadCount: 0
        };

        setChats(prev => [newGroup, ...prev]);
        setShowCreateGroup(false);
        setGroupName("");
        setSelectedMembers([]);
        setActiveChat(newGroup);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getChatMessages = (chatId: string) => {
        return messages.filter(msg => msg.chatId === chatId);
    };

    return (
        <div className="mx-auto px-4 max-w-7xl pt-20 min-h-screen flex flex-col font-poppins flex-grow relative">
            <FloatingParticles />

            {/* Main messaging container - adjusted for better width utilization */}
            <motion.div 
                className="flex-1 flex bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                style={{ minHeight: '70vh', maxHeight: '88vh' }}
            >
                {/* Chat List - Made more compact */}
                <motion.div 
                    className="w-80 border-r border-gray-200 flex flex-col bg-gradient-to-b from-gray-50 to-white"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Chat List Header */}
                    <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-[#3A8EBA] to-[#2C7EA8]">
                        <div className="flex justify-between items-center">
                            <h3 className="font-comic font-bold text-white text-lg">Chats</h3>
                            <motion.button
                                onClick={() => setShowCreateGroup(true)}
                                className="bg-white/20 hover:bg-white/30 text-white p-2.5 rounded-full transition-all duration-300 shadow-lg"
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </motion.button>
                        </div>
                    </div>

                    {/* Chat List Items */}
                    <div className="flex-1 overflow-y-auto">
                        {chats.map((chat, index) => (
                            <motion.div
                                key={chat.id}
                                className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-300 ${
                                    activeChat?.id === chat.id 
                                        ? 'bg-blue-50 border-l-4 border-l-[#3A8EBA] shadow-sm' 
                                        : 'hover:bg-gray-50'
                                }`}
                                onClick={() => setActiveChat(chat)}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.01 }}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        {chat.type === 'group' ? (
                                            <motion.div 
                                                className="w-12 h-12 bg-gradient-to-br from-[#3A8EBA] to-[#2C7EA8] rounded-full flex items-center justify-center shadow-lg"
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                            >
                                                <span className="text-white font-bold text-lg">👨‍👩‍👧‍👦</span>
                                            </motion.div>
                                        ) : (
                                            <motion.img 
                                                src={chat.avatar || "https://via.placeholder.com/48"} 
                                                alt={chat.name}
                                                className="w-12 h-12 rounded-full border-3 border-white shadow-md"
                                                whileHover={{ scale: 1.1 }}
                                            />
                                        )}
                                        {chat.isOnline && chat.type === 'direct' && (
                                            <motion.div 
                                                className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 truncate text-sm">{chat.name}</p>
                                        {chat.lastMessage && (
                                            <p className="text-xs text-gray-500 truncate mt-1">{chat.lastMessage.content}</p>
                                        )}
                                    </div>
                                    {chat.unreadCount > 0 && (
                                        <motion.div 
                                            className="bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1.5"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                        >
                                            {chat.unreadCount}
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Chat Area - Takes remaining space */}
                <div className="flex-1 flex flex-col">
                    {activeChat ? (
                        <>
                            {/* Chat Header */}
                            <motion.div 
                                className="p-5 border-b border-gray-200 bg-gradient-to-r from-[#3A8EBA] to-[#2C7EA8] shadow-sm"
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                            >
                                <div className="flex items-center space-x-4">
                                    {activeChat.type === 'group' ? (
                                        <motion.div 
                                            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
                                            whileHover={{ scale: 1.1, rotate: 10 }}
                                        >
                                            <span className="text-white text-lg">👨‍👩‍👧‍👦</span>
                                        </motion.div>
                                    ) : (
                                        <motion.img 
                                            src={activeChat.avatar || "https://via.placeholder.com/48"} 
                                            alt={activeChat.name}
                                            className="w-12 h-12 rounded-full border-3 border-white shadow-lg"
                                            whileHover={{ scale: 1.1 }}
                                        />
                                    )}
                                    <div>
                                        <h3 className="font-comic font-bold text-white text-lg">{activeChat.name}</h3>
                                        {activeChat.type === 'direct' && activeChat.isOnline && (
                                            <motion.p 
                                                className="text-white/80 text-sm flex items-center"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                            >
                                                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                                                Online
                                            </motion.p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-blue-50/20 to-white">
                                <AnimatePresence>
                                    {getChatMessages(activeChat.id).map((msg) => (
                                        <motion.div
                                            key={msg.id}
                                            className={`flex ${msg.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}
                                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                        >
                                            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl relative shadow-sm ${
                                                msg.senderId === 'current-user' 
                                                    ? 'bg-[#3A8EBA] text-white' 
                                                    : 'bg-white border border-gray-200'
                                            }`}>
                                                {msg.senderId !== 'current-user' && activeChat.type === 'group' && (
                                                    <p className="text-xs font-medium text-gray-500 mb-1">{msg.senderName}</p>
                                                )}
                                                {msg.type === 'emoji' ? (
                                                    <motion.span 
                                                        className="text-4xl"
                                                        whileHover={{ scale: 1.2 }}
                                                    >
                                                        {msg.content}
                                                    </motion.span>
                                                ) : (
                                                    <p className="text-sm leading-relaxed">{msg.content}</p>
                                                )}
                                                <p className={`text-xs mt-2 ${
                                                    msg.senderId === 'current-user' ? 'text-white/70' : 'text-gray-400'
                                                }`}>
                                                    {formatTime(msg.timestamp)}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Quick Emoji Bar */}
                            <motion.div 
                                className="px-6 py-3 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50/30"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="flex space-x-3 overflow-x-auto pb-1">
                                    {quickEmojis.map((emoji) => (
                                        <motion.button
                                            key={emoji}
                                            onClick={() => sendQuickEmoji(emoji)}
                                            className="text-2xl hover:bg-white hover:shadow-sm rounded-lg p-2 transition-all duration-200 flex-shrink-0"
                                            whileHover={{ scale: 1.3, y: -2 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            {emoji}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Message Input */}
                            <motion.div 
                                className="p-6 border-t border-gray-200 bg-white"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <div className="flex items-center space-x-4">
                                    <motion.button
                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                        className="text-gray-400 hover:text-[#3A8EBA] transition-colors duration-200 p-2 rounded-full hover:bg-gray-50"
                                        whileHover={{ scale: 1.1, rotate: 10 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </motion.button>
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                        placeholder="Type a loving message..."
                                        className="flex-1 p-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#3A8EBA] focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
                                    />
                                    <motion.button
                                        onClick={sendMessage}
                                        className="bg-[#3A8EBA] text-white p-4 rounded-full hover:bg-[#2C7EA8] transition-colors duration-200 shadow-lg hover:shadow-xl"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </motion.button>
                                </div>

                                {/* Emoji Picker */}
                                <AnimatePresence>
                                    {showEmojiPicker && (
                                        <motion.div
                                            className="mt-4 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-gray-200"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                        >
                                            <div className="grid grid-cols-5 gap-3">
                                                {familyStickers.map((sticker) => (
                                                    <motion.button
                                                        key={sticker}
                                                        onClick={() => {
                                                            sendQuickEmoji(sticker);
                                                            setShowEmojiPicker(false);
                                                        }}
                                                        className="text-3xl hover:bg-white rounded-xl p-3 transition-colors shadow-sm hover:shadow-md"
                                                        whileHover={{ scale: 1.2, rotate: 10 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        {sticker}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50/20 to-purple-50/20">
                            <motion.div 
                                className="text-center p-8"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6 }}
                            >
                                <motion.div
                                    className="w-40 h-40 mx-auto mb-8 bg-gradient-to-br from-[#3A8EBA] to-[#2C7EA8] rounded-full flex items-center justify-center shadow-2xl"
                                    animate={{ 
                                        y: [-5, 5, -5],
                                        rotate: [0, 5, -5, 0]
                                    }}
                                    transition={{ 
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <span className="text-6xl text-white">💬</span>
                                </motion.div>
                                <h3 className="font-comic font-bold text-2xl text-gray-700 mb-4">
                                    Choose a chat to start the conversation
                                </h3>
                                <p className="text-gray-500 text-lg">
                                    Select a family member or group to share your thoughts and love
                                </p>
                                <motion.div
                                    className="mt-6 flex justify-center space-x-2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    {["❤️", "🌟", "🎉"].map((emoji, index) => (
                                        <motion.span
                                            key={emoji}
                                            className="text-2xl"
                                            animate={{
                                                y: [0, -10, 0],
                                                rotate: [0, 10, -10, 0]
                                            }}
                                            transition={{
                                                duration: 2,
                                                delay: index * 0.3,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        >
                                            {emoji}
                                        </motion.span>
                                    ))}
                                </motion.div>
                            </motion.div>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Create Group Modal */}
            <AnimatePresence>
                {showCreateGroup && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowCreateGroup(false)}
                    >
                        <motion.div
                            className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl"
                            initial={{ scale: 0.8, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 50 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="font-comic font-bold text-2xl text-gray-800 mb-6 text-center">
                                Create Group Chat
                            </h3>
                            
                            <input
                                type="text"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                placeholder="Enter group name..."
                                className="w-full p-4 border border-gray-300 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-[#3A8EBA] bg-gray-50 focus:bg-white transition-all duration-200"
                            />

                            <div className="mb-6">
                                <p className="text-sm font-medium text-gray-700 mb-4">Select family members:</p>
                                <div className="space-y-3 max-h-48 overflow-y-auto">
                                    {familyMembers
                                        .filter(member => member.name !== currentUser.name)
                                        .map((member) => (
                                            <motion.label 
                                                key={member._id} 
                                                className="flex items-center space-x-4 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors"
                                                whileHover={{ scale: 1.02 }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMembers.includes(member._id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedMembers([...selectedMembers, member._id]);
                                                        } else {
                                                            setSelectedMembers(selectedMembers.filter(id => id !== member._id));
                                                        }
                                                    }}
                                                    className="rounded text-[#3A8EBA] focus:ring-[#3A8EBA] w-5 h-5"
                                                />
                                                <img 
                                                    src={member.avatar || "https://via.placeholder.com/40"} 
                                                    alt={member.name}
                                                    className="w-10 h-10 rounded-full border-2 border-gray-200"
                                                />
                                                <span className="text-sm font-medium">{member.name}</span>
                                            </motion.label>
                                        ))}
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <motion.button
                                    onClick={() => setShowCreateGroup(false)}
                                    className="flex-1 px-6 py-3 text-gray-600 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    onClick={createGroupChat}
                                    disabled={!groupName.trim() || selectedMembers.length === 0}
                                    className="flex-1 px-6 py-3 bg-[#3A8EBA] text-white rounded-xl hover:bg-[#2C7EA8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-lg"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Create Group
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FamilyMessaging;