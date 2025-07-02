import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import {
    addMessage,
    updateMessage,
    deleteMessage,
    updateMessageReactions,
    setOnlineUsers,
    updateUserStatus,
    addTypingUser,
    removeTypingUser,
    updateChatUnreadCount,
    selectActiveChat,
    Message
} from '../redux/slices/messageSlice';

interface UseSocketProps {
    token: string | null;
    userId: string;
}

interface SocketEvents {
    // Server to client events
    new_message: (message: Message) => void;
    message_updated: (message: Message) => void;
    message_deleted: (data: { messageId: string; chatId: string }) => void;
    reaction_updated: (data: { messageId: string; reactions: Message['reactions'] }) => void;
    user_status_changed: (data: { userId: string; isOnline: boolean }) => void;
    user_typing: (data: { userId: string; userName: string; chatId: string }) => void;
    user_stop_typing: (data: { userId: string; chatId: string }) => void;
    messages_read: (data: { userId: string; userName: string; chatId: string }) => void;
    online_users: (userIds: string[]) => void;
    error: (data: { message: string }) => void;
}

export const useSocket = ({ token, userId }: UseSocketProps) => {
    const socketRef = useRef<Socket | null>(null);
    const dispatch = useDispatch();
    const activeChat = useSelector(selectActiveChat);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize socket connection
    const connect = useCallback(() => {
        if (!token || socketRef.current?.connected) return;

        const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';
        
        socketRef.current = io(serverUrl, {
            auth: { token },
            transports: ['websocket', 'polling'],
            timeout: 20000,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        const socket = socketRef.current;

        // Connection events
        socket.on('connect', () => {
            console.log('✅ Connected to messaging server');
            
            // Join active chat if exists
            if (activeChat) {
                socket.emit('join_chat', activeChat._id);
            }
        });

        socket.on('disconnect', (reason) => {
            console.log('❌ Disconnected from messaging server:', reason);
            
            // Auto-reconnect after delay
            if (reason === 'io server disconnect') {
                reconnectTimeoutRef.current = setTimeout(() => {
                    socket.connect();
                }, 3000);
            }
        });

        socket.on('connect_error', (error) => {
            console.error('🔴 Socket connection error:', error);
        });

        // Message events
        socket.on('new_message', (message: Message) => {
            dispatch(addMessage(message));
            
            // Update unread count if message is not from current user and not in active chat
            if (message.senderId !== userId && 
                (!activeChat || activeChat._id !== message.chatId)) {
                // This would need to be calculated or received from server
                // For now, we'll increment by 1
                dispatch(updateChatUnreadCount({ 
                    chatId: message.chatId, 
                    count: 1 // This should be the actual unread count
                }));
            }
        });

        socket.on('message_updated', (message: Message) => {
            dispatch(updateMessage(message));
        });

        socket.on('message_deleted', (data: { messageId: string; chatId: string }) => {
            dispatch(deleteMessage(data));
        });

        socket.on('reaction_updated', (data: { messageId: string; reactions: Message['reactions'] }) => {
            dispatch(updateMessageReactions({
                messageId: data.messageId,
                chatId: activeChat?._id || '',
                reactions: data.reactions
            }));
        });

        // User status events
        socket.on('user_status_changed', (data: { userId: string; isOnline: boolean }) => {
            dispatch(updateUserStatus(data));
        });

        socket.on('online_users', (userIds: string[]) => {
            dispatch(setOnlineUsers(userIds));
        });

        // Typing events
        socket.on('user_typing', (data: { userId: string; userName: string; chatId: string }) => {
            if (data.userId !== userId) {
                dispatch(addTypingUser(data));
            }
        });

        socket.on('user_stop_typing', (data: { userId: string; chatId: string }) => {
            dispatch(removeTypingUser(data));
        });

        // Read status events
        socket.on('messages_read', (data: { userId: string; userName: string; chatId: string }) => {
            if (data.chatId === activeChat?._id) {
                // Handle read receipts if needed
                console.log(`${data.userName} read messages in current chat`);
            }
        });

        // Error handling
        socket.on('error', (data: { message: string }) => {
            console.error('Socket error:', data.message);
        });

    }, [token, userId, activeChat, dispatch]);

    // Disconnect socket
    const disconnect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
        
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
    }, []);

    // Join a chat room
    const joinChat = useCallback((chatId: string) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('join_chat', chatId);
        }
    }, []);

    // Leave a chat room
    const leaveChat = useCallback((chatId: string) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('leave_chat', chatId);
        }
    }, []);

    // Send a message via socket
    const sendMessage = useCallback((messageData: {
        chatId: string;
        content: string;
        type?: string;
        replyTo?: string;
    }) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('send_message', messageData);
        }
    }, []);

    // Start typing indicator
    const startTyping = useCallback((chatId: string) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('typing_start', chatId);
        }
    }, []);

    // Stop typing indicator
    const stopTyping = useCallback((chatId: string) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('typing_stop', chatId);
        }
    }, []);

    // Handle typing with debouncing
    const handleTyping = useCallback((chatId: string) => {
        startTyping(chatId);
        
        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        
        // Set new timeout to stop typing
        typingTimeoutRef.current = setTimeout(() => {
            stopTyping(chatId);
        }, 2000);
    }, [startTyping, stopTyping]);

    // Add reaction to message
    const addReaction = useCallback((messageId: string, emoji: string) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('add_reaction', { messageId, emoji });
        }
    }, []);

    // Mark messages as read
    const markMessagesAsRead = useCallback((chatId: string) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('mark_messages_read', chatId);
        }
    }, []);

    // Initialize connection on mount
    useEffect(() => {
        if (token && userId) {
            connect();
        }

        return () => {
            disconnect();
        };
    }, [token, userId, connect, disconnect]);

    // Handle active chat changes
    useEffect(() => {
        if (socketRef.current?.connected && activeChat) {
            // Leave previous chat rooms and join new one
            joinChat(activeChat._id);
            
            // Mark messages as read when entering chat
            markMessagesAsRead(activeChat._id);
        }
    }, [activeChat, joinChat, markMessagesAsRead]);

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, []);

    return {
        socket: socketRef.current,
        isConnected: socketRef.current?.connected || false,
        connect,
        disconnect,
        joinChat,
        leaveChat,
        sendMessage,
        handleTyping,
        startTyping,
        stopTyping,
        addReaction,
        markMessagesAsRead
    };
};