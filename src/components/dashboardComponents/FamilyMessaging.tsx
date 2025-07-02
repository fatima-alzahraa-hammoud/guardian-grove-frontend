import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { selectName, selectAvatar, selectRole } from "../../redux/slices/userSlice";
import { selectFamilyMembers } from "../../redux/slices/familySlice";
import { 
    selectChats, 
    selectActiveChat, 
    selectMessages, 
    selectOnlineUsers, 
    selectTypingUsers,
    selectMessageLoading,
    setActiveChat,
    addMessage,
    addChat,
    setMessages,
    setChats,
    markChatAsRead
} from "../../redux/slices/messageSlice";
import { useSocket } from "../../hooks/useSocket";
import { requestApi } from "../../libs/requestApi";
import { requestMethods } from "../../libs/enum/requestMethods";
import { RootState } from "../../redux/store";

interface FamilyMessagingProps {
    collapsed?: boolean;
}

interface Member {
    _id: string;
    name: string;
    avatar?: string;
}


// Use the Message type from the Redux slice to ensure compatibility
import type { Message, Chat } from "../../redux/slices/messageSlice";

const FamilyMessaging: React.FC<FamilyMessagingProps> = () => {
    const dispatch = useDispatch();
    const currentUser = {
        id: useSelector((state: RootState) => state.user._id),
        name: useSelector(selectName),
        avatar: useSelector(selectAvatar),
        role: useSelector(selectRole)
    };
    
    const familyMembers = useSelector(selectFamilyMembers);
    const chats = useSelector(selectChats);
    const activeChat = useSelector(selectActiveChat);
    const messages = useSelector(selectMessages(activeChat?._id || ""));
    const onlineUsers = useSelector(selectOnlineUsers);
    const typingUsers = useSelector(selectTypingUsers(activeChat?._id || ""));
    const loading = useSelector(selectMessageLoading);

    const [message, setMessage] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [groupName, setGroupName] = useState("");
    const [replyTo, setReplyTo] = useState<Message | null>(null);
    // const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Get user token for socket connection
    const token = localStorage.getItem('accessToken');

    // Initialize socket connection
    const {
        socket,
        isConnected,
        sendMessage: socketSendMessage,
        handleTyping,
        addReaction: socketAddReaction,
        markMessagesAsRead
    } = useSocket({ 
        token, 
        userId: currentUser.id || "" 
    });

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

    // Fetch family chats on component mount
    const fetchFamilyChats = useCallback(async () => {
        if (!currentUser.id) return;
        
        try {
            const response = await requestApi({
                route: "/familyChats",
                method: requestMethods.GET
            });

            if (response?.chats) {
                console.log('📋 Fetched chats:', response.chats);
                dispatch(setChats(response.chats));
            }
        } catch (error) {
            console.error("Error fetching family chats:", error);
        }
    }, [dispatch, currentUser.id]);

    // Fetch messages for active chat
    const fetchChatMessages = useCallback(async (chatId: string) => {
        try {
            console.log('📨 Fetching messages for chat:', chatId);
            const response = await requestApi({
                route: `/familyChats/${chatId}/messages`,
                method: requestMethods.GET
            });

            if (response?.messages) {
                console.log('📨 Fetched messages:', response.messages.length);
                // Replace messages for the chat
                dispatch(setMessages({ 
                    chatId, 
                    messages: response.messages, 
                    replace: true 
                }));
                
                // setHasMoreMessages(response.pagination?.hasMore || false);
            }
        } catch (error) {
            console.error("Error fetching chat messages:", error);
        }
    }, [dispatch]);

    // Create or get direct chat
    const createDirectChat = useCallback(async (memberId: string) => {
        try {
            console.log('👥 Creating direct chat with:', memberId);
            const response = await requestApi({
                route: "/familyChats/chats/direct",
                method: requestMethods.POST,
                body: { memberId }
            });

            if (response?.chat) {
                dispatch(addChat(response.chat));
                dispatch(setActiveChat(response.chat));
            }
        } catch (error) {
            console.error("Error creating direct chat:", error);
        }
    }, [dispatch]);

    // Initialize component
    useEffect(() => {
        if (currentUser.id && !isInitialized) {
            console.log('🚀 Initializing Family Messaging...');
            fetchFamilyChats();
            setIsInitialized(true);
        }
    }, [fetchFamilyChats, currentUser.id, isInitialized]);

    // Fetch messages when active chat changes
    useEffect(() => {
        if (activeChat && activeChat._id) {
            console.log('💬 Active chat changed to:', activeChat._id);
            fetchChatMessages(activeChat._id);
            
            // Mark chat as read when switching to it
            dispatch(markChatAsRead(activeChat._id));
            
            // Mark messages as read via socket
            if (socket?.connected) {
                markMessagesAsRead(activeChat._id);
            }
        }
    }, [activeChat?._id, fetchChatMessages, socket, markMessagesAsRead, dispatch]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    // Send message via API and socket
    const sendMessageHandler = async () => {
        if (!message.trim() || !activeChat) return;

        const messageContent = message.trim();
        setMessage(""); // Clear input immediately for better UX
        setReplyTo(null);

        try {
            // Send via socket for real-time delivery
            if (socket?.connected) {
                console.log('📤 Sending message via socket');
                socketSendMessage({
                    chatId: activeChat._id,
                    content: messageContent,
                    type: 'text',
                    replyTo: replyTo?._id
                });
            } else {
                console.log('📤 Sending message via API (socket not connected)');
                // Fallback to API if socket not connected
                const response = await requestApi({
                    route: `/familyChats/${activeChat._id}/messages`,
                    method: requestMethods.POST,
                    body: {
                        chatId: activeChat._id,
                        content: messageContent,
                        type: 'text',
                        replyTo: replyTo?._id
                    }
                });

                if (response?.messageData) {
                    dispatch(addMessage(response.messageData));
                }
            }
        } catch (error) {
            console.error("Error sending message:", error);
            // Restore message content on error
            setMessage(messageContent);
        }
    };

    // Send quick emoji
    const sendQuickEmoji = async (emoji: string, isSticker = false) => {
        if (!activeChat) return;

        console.log("Sending emoji/sticker:", emoji);

        try {
            if (socket?.connected) {
                socketSendMessage({
                    chatId: activeChat._id,
                    content: emoji,
                    type: isSticker ? 'sticker' : 'emoji'
                });
            } else {
                const response = await requestApi({
                    route: `/familyChats/${activeChat._id}/messages`,
                    method: requestMethods.POST,
                    body: {
                        chatId: activeChat._id,
                        content: emoji,
                        type: isSticker ? 'sticker' : 'emoji'
                    }
                });

                if (response?.messageData) {
                    dispatch(addMessage(response.messageData));
                }
            }
        } catch (error) {
            console.error("Error sending emoji:", error);
        }
    };

    // Create group chat
    const createGroupChat = async () => {
        if (!groupName.trim() || selectedMembers.length === 0) return;

        try {
            const response = await requestApi({
                route: "/familyChats/group",
                method: requestMethods.POST,
                body: {
                    name: groupName,
                    members: selectedMembers,
                    description: ""
                }
            });

            if (response?.chat) {
                dispatch(addChat(response.chat));
                dispatch(setActiveChat(response.chat));
                setShowCreateGroup(false);
                setGroupName("");
                setSelectedMembers([]);
            }
        } catch (error) {
            console.error("Error creating group chat:", error);
        }
    };

    // Handle file upload
    const handleFileUpload = async (file: File) => {
        if (!activeChat) return;

        const formData = new FormData();
        formData.append('messageFile', file);
        formData.append('content', `Shared ${file.type.startsWith('image/') ? 'an image' : 'a file'}: ${file.name}`);
        formData.append('type', file.type.startsWith('image/') ? 'image' : 'file');

        try {
            const response = await requestApi({
                route: `/familyChats/${activeChat._id}/messages`,
                method: requestMethods.POST,
                body: formData,
            });

            if (response?.messageData) {
                dispatch(addMessage(response.messageData));
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    // Handle reaction
    const handleReaction = async (messageId: string, emoji: string) => {
        try {
            if (socket?.connected) {
                console.log('😊 Using socket for reaction');
                socketAddReaction(messageId, emoji);
            } else {
                console.log('😊 Falling back to API for reaction');
                await requestApi({
                    route: `/familyChats/messages/${messageId}/reactions`,
                    method: requestMethods.POST,
                    body: { emoji }
                });
            }
        } catch (error) {
            console.error("Error adding reaction:", error);
        }
    };

    // Handle typing
    const handleTypingInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
        if (activeChat && socket?.connected) {
            handleTyping(activeChat._id);
        }
    };

    // Format time
    const formatTime = (date: string | Date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Check if user is online
    const isUserOnline = (userId: string) => onlineUsers.includes(userId);

    // Get other member for direct chat
    const getOtherMember = (chat: Chat): Member | undefined => {
        return chat.members.find((member: Member) => member._id !== currentUser.id);
    };

    // Handle chat selection
    const handleChatSelect = (chat: Chat) => {
        console.log('🔄 Selecting chat:', chat._id);
        dispatch(setActiveChat(chat));
    };

    return (
        <div className="mx-auto px-4 max-w-7xl pt-20 min-h-screen flex flex-col font-poppins flex-grow relative">
            <FloatingParticles />

            {/* Connection status indicator */}
            <motion.div 
                className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-full text-sm font-medium ${
                    isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
            >
                {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </motion.div>

            {/* Main messaging container */}
            <motion.div 
                className="flex-1 flex bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                style={{ minHeight: '70vh', maxHeight: '88vh' }}
            >
                {/* Chat List */}
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

                    {/* Family Members for Direct Chat */}
                    <div className="p-4 border-b border-gray-200">
                        <p className="text-xs font-medium text-gray-500 mb-3">Start new chat</p>
                        <div className="flex space-x-2 overflow-x-auto pb-2">
                            {familyMembers
                                .filter(member => member._id !== currentUser.id)
                                .map((member) => (
                                    <motion.button
                                        key={member._id}
                                        onClick={() => createDirectChat(member._id)}
                                        className="flex-shrink-0 text-center"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <div className="relative">
                                            <img 
                                                src={member.avatar || "https://via.placeholder.com/40"} 
                                                alt={member.name}
                                                className="w-10 h-10 rounded-full border-2 border-gray-200"
                                            />
                                            {isUserOnline(member._id) && (
                                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-600 mt-1 truncate w-12">{member.name.split(' ')[0]}</p>
                                    </motion.button>
                                ))}
                        </div>
                    </div>

                    {/* Chat List Items */}
                    <div className="flex-1 overflow-y-auto">
                        {loading.chats ? (
                            <div className="p-4 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A8EBA] mx-auto"></div>
                            </div>
                        ) : (
                            chats.map((chat, index) => {
                                const otherMember = chat.type === 'direct' ? getOtherMember(chat) : null;
                                const isOnline = chat.type === 'direct' && otherMember ? isUserOnline(otherMember._id) : false;
                                
                                return (
                                    <motion.div
                                        key={chat._id}
                                        className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-300 ${
                                            activeChat?._id === chat._id 
                                                ? 'bg-blue-50 border-l-4 border-l-[#3A8EBA] shadow-sm' 
                                                : 'hover:bg-gray-50'
                                        }`}
                                        onClick={() => handleChatSelect(chat)}
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
                                                        src={otherMember?.avatar || "https://via.placeholder.com/48"} 
                                                        alt={chat.name}
                                                        className="w-12 h-12 rounded-full border-3 border-white shadow-md"
                                                        whileHover={{ scale: 1.1 }}
                                                    />
                                                )}
                                                {isOnline && (
                                                    <motion.div 
                                                        className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
                                                        animate={{ scale: [1, 1.2, 1] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 truncate text-sm">
                                                    {chat.type === 'direct' && otherMember ? otherMember.name : chat.name}
                                                </p>
                                                {chat.lastMessage && (
                                                    <p className="text-xs text-gray-500 truncate mt-1">
                                                        {chat.lastMessage.senderName}: {chat.lastMessage.content}
                                                    </p>
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
                                );
                            })
                        )}
                    </div>
                </motion.div>

                {/* Chat Area */}
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
                                            src={getOtherMember(activeChat)?.avatar || "https://via.placeholder.com/48"} 
                                            alt={activeChat.name}
                                            className="w-12 h-12 rounded-full border-3 border-white shadow-lg"
                                            whileHover={{ scale: 1.1 }}
                                        />
                                    )}
                                    <div>
                                        <h3 className="font-comic font-bold text-white text-lg">
                                            {activeChat.type === 'direct' && getOtherMember(activeChat) 
                                                ? getOtherMember(activeChat)?.name 
                                                : activeChat.name}
                                        </h3>
                                        {activeChat.type === 'direct' && (() => {
                                            const otherMember = getOtherMember(activeChat);
                                            return otherMember && isUserOnline(otherMember._id) && (
                                                <motion.p 
                                                    className="text-white/80 text-sm flex items-center"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                >
                                                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                                                    Online
                                                </motion.p>
                                            );
                                        })()}
                                        {typingUsers.length > 0 && (
                                            <motion.p 
                                                className="text-white/80 text-sm"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                            >
                                                {typingUsers.map(user => user.userName).join(', ')} typing...
                                            </motion.p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-blue-50/20 to-white">
                                {loading.messages ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A8EBA] mx-auto"></div>
                                    </div>
                                ) : (
                                    <AnimatePresence>
                                        {messages.map((msg) => (
                                            <motion.div
                                                key={msg._id}
                                                className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                                                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                            >
                                                <div className={`max-w-xs lg:max-w-md group relative ${
                                                    msg.senderId === currentUser.id ? 'ml-auto' : 'mr-auto'
                                                }`}>
                                                    {/* Reply indicator */}
                                                    {msg.replyTo && (
                                                        <div className={`text-xs text-gray-500 mb-1 p-2 rounded-lg bg-gray-100 border-l-2 ${
                                                            msg.senderId === currentUser.id ? 'border-blue-400' : 'border-gray-400'
                                                        }`}>
                                                            <p className="font-medium">{msg.replyTo.senderName}</p>
                                                            <p className="truncate">{msg.replyTo.content}</p>
                                                        </div>
                                                    )}

                                                    <div className={`px-4 py-3 rounded-2xl relative shadow-sm ${
                                                        msg.senderId === currentUser.id 
                                                            ? 'bg-[#3A8EBA] text-white' 
                                                            : 'bg-white border border-gray-200'
                                                    }`}>
                                                        {msg.senderId !== currentUser.id && activeChat.type === 'group' && (
                                                            <p className="text-xs font-medium text-gray-500 mb-1">{msg.senderName}</p>
                                                        )}
                                                        
                                                        {msg.type === 'emoji' ? (
                                                            <motion.span 
                                                                className="text-4xl"
                                                                whileHover={{ scale: 1.2 }}
                                                            >
                                                                {msg.content}
                                                            </motion.span>
                                                        ) : msg.type === 'image' ? (
                                                            <div>
                                                                <img 
                                                                    src={msg.fileUrl} 
                                                                    alt="Shared image" 
                                                                    className="max-w-full h-auto rounded-lg mb-2"
                                                                />
                                                                <p className="text-sm">{msg.content}</p>
                                                            </div>
                                                        ) : msg.type === 'file' ? (
                                                            <div className="flex items-center space-x-2">
                                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                                <div>
                                                                    <p className="text-sm font-medium">{msg.fileName}</p>
                                                                    <p className="text-xs opacity-70">{msg.fileSize ? `${(msg.fileSize / 1024 / 1024).toFixed(2)} MB` : ''}</p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <p className="text-sm leading-relaxed">{msg.content}</p>
                                                        )}

                                                        {/* Message reactions */}
                                                        {msg.reactions && msg.reactions.length > 0 && (
                                                            <div className="flex flex-wrap gap-1 mt-2">
                                                                {Object.entries(
                                                                    msg.reactions.reduce<Record<string, string[]>>((acc, reaction) => {
                                                                        acc[reaction.emoji] = acc[reaction.emoji] || [];
                                                                        acc[reaction.emoji].push(reaction.userId);
                                                                        return acc;
                                                                    }, {})
                                                                ).map(([emoji, userIds]) => (
                                                                    // ...existing code...

                                                                    <motion.button
                                                                        key={emoji}
                                                                        onClick={() => handleReaction(msg._id, emoji)}
                                                                        className={`text-xs px-2 py-1 rounded-full border ${
                                                                            userIds.includes(currentUser.id || "")
                                                                                ? 'bg-blue-100 border-blue-300'
                                                                                : 'bg-gray-100 border-gray-300'
                                                                        }`}
                                                                        whileHover={{ scale: 1.1 }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                    >
                                                                        {emoji} {userIds.length}
                                                                    </motion.button>
                                                                ))}
                                                            </div>
                                                        )}

                                                        <div className="flex items-center justify-between mt-2">
                                                            <p className={`text-xs ${
                                                                msg.senderId === currentUser.id ? 'text-white/70' : 'text-gray-400'
                                                            }`}>
                                                                {formatTime(msg.timestamp)}
                                                                {msg.edited && <span className="ml-1">(edited)</span>}
                                                            </p>
                                                            
                                                            {/* Quick reaction button */}
                                                            <motion.button
                                                                onClick={() => handleReaction(msg._id, '❤️')}
                                                                className="opacity-0 group-hover:opacity-100 text-xs hover:scale-110 transition-all"
                                                                whileHover={{ scale: 1.2 }}
                                                                whileTap={{ scale: 0.9 }}
                                                            >
                                                                ❤️
                                                            </motion.button>
                                                        </div>

                                                        {/* Message options menu */}
                                                        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <motion.button
                                                                onClick={() => setReplyTo(msg)}
                                                                className="bg-gray-100 hover:bg-gray-200 p-1 rounded-full text-xs"
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.95 }}
                                                            >
                                                                ↩️
                                                            </motion.button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Reply indicator */}
                            <AnimatePresence>
                                {replyTo && (
                                    <motion.div
                                        className="px-6 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-500">Replying to</span>
                                            <span className="text-sm font-medium">{replyTo.senderName}</span>
                                            <span className="text-sm text-gray-400 truncate max-w-32">{replyTo.content}</span>
                                        </div>
                                        <motion.button
                                            onClick={() => setReplyTo(null)}
                                            className="text-gray-400 hover:text-gray-600"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            ✕
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

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
                                    {/* File upload button */}
                                    <motion.button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-gray-400 hover:text-[#3A8EBA] transition-colors duration-200 p-2 rounded-full hover:bg-gray-50"
                                        whileHover={{ scale: 1.1, rotate: 10 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                        </svg>
                                    </motion.button>

                                    {/* Emoji picker button */}
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
                                        onChange={handleTypingInput}
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessageHandler()}
                                        placeholder="Type a loving message..."
                                        className="flex-1 p-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#3A8EBA] focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
                                        disabled={loading.sending}
                                    />
                                    
                                    <motion.button
                                        onClick={sendMessageHandler}
                                        disabled={!message.trim() || loading.sending}
                                        className="bg-[#3A8EBA] text-white p-4 rounded-full hover:bg-[#2C7EA8] transition-colors duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {loading.sending ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                        )}
                                    </motion.button>
                                </div>

                                {/* Hidden file input */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            handleFileUpload(file);
                                            e.target.value = '';
                                        }
                                    }}
                                    accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                                    className="hidden"
                                />

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
                                                            sendQuickEmoji(sticker, true);
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
                                        .filter(member => member._id !== currentUser.id)
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