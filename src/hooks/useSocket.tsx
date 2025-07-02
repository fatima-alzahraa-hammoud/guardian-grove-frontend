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

export const useSocket = ({ token, userId }: UseSocketProps) => {
    const socketRef = useRef<Socket | null>(null);
    const dispatch = useDispatch();
    const activeChat = useSelector(selectActiveChat);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const currentChatRef = useRef<string | null>(null);
    const isConnectingRef = useRef<boolean>(false);

    // Keep track of joined chats to avoid duplicate joins
    const joinedChatsRef = useRef<Set<string>>(new Set());

    // Setup socket event listeners
    const setupSocketListeners = useCallback((socket: Socket) => {
        console.log('🔧 Setting up socket listeners...');

        // Connection events
        socket.on('connect', () => {
            console.log('✅ Socket connected successfully!', socket.id);
            isConnectingRef.current = false;
            
            // Clear any pending reconnection timeouts
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
            
            // Re-join active chat if exists
            if (activeChat && activeChat._id) {
                console.log('🚪 Re-joining active chat on reconnect:', activeChat._id);
                socket.emit('join_chat', activeChat._id);
                joinedChatsRef.current.add(activeChat._id);
            }
        });

        socket.on('disconnect', (reason) => {
            console.log('❌ Socket disconnected:', reason);
            joinedChatsRef.current.clear();
            isConnectingRef.current = false;
            
            // Auto-reconnect for certain disconnect reasons
            if (reason === 'io server disconnect' || reason === 'transport close') {
                console.log('🔄 Scheduling reconnection...');
                reconnectTimeoutRef.current = setTimeout(() => {
                    if (!socket.connected && !isConnectingRef.current) {
                        console.log('🔄 Attempting to reconnect...');
                        socket.connect();
                    }
                }, 3000);
            }
        });

        socket.on('connect_error', (error) => {
            console.error('🔴 Socket connection error:', error);
            isConnectingRef.current = false;
        });

        // Message events
        socket.on('new_message', (message: Message) => {
            console.log('📨 New message received via socket:', message);
            dispatch(addMessage(message));
            
            // Update unread count if message is not from current user and not in active chat
            if (message.senderId !== userId && 
                (!activeChat || activeChat._id !== message.chatId)) {
                dispatch(updateChatUnreadCount({ 
                    chatId: message.chatId, 
                    count: 1,
                    increment: true
                }));
            }
        });

        socket.on('message_updated', (message: Message) => {
            console.log('📝 Message updated via socket:', message);
            dispatch(updateMessage(message));
        });

        socket.on('message_deleted', (data: { messageId: string; chatId: string }) => {
            console.log('🗑️ Message deleted via socket:', data);
            dispatch(deleteMessage(data));
        });

        socket.on('reaction_updated', (data: { messageId: string; reactions: Message['reactions'] }) => {
            console.log('😊 Reaction updated via socket:', data);
            dispatch(updateMessageReactions({
                messageId: data.messageId,
                chatId: currentChatRef.current || '',
                reactions: data.reactions
            }));
        });

        // User status events
        socket.on('user_status_changed', (data: { userId: string; isOnline: boolean }) => {
            console.log('👤 User status changed via socket:', data);
            dispatch(updateUserStatus(data));
        });

        socket.on('online_users', (userIds: string[]) => {
            console.log('🟢 Online users updated via socket:', userIds);
            dispatch(setOnlineUsers(userIds));
        });

        // Typing events
        socket.on('user_typing', (data: { userId: string; userName: string; chatId: string }) => {
            if (data.userId !== userId) {
                console.log('⌨️ User typing via socket:', data);
                dispatch(addTypingUser(data));
            }
        });

        socket.on('user_stop_typing', (data: { userId: string; chatId: string }) => {
            console.log('⌨️ User stopped typing via socket:', data);
            dispatch(removeTypingUser(data));
        });

        // Read status events
        socket.on('messages_read', (data: { userId: string; userName: string; chatId: string }) => {
            if (data.chatId === currentChatRef.current) {
                console.log(`📖 ${data.userName} read messages in current chat`);
            }
        });

        // Error handling
        socket.on('error', (data: { message: string }) => {
            console.error('❌ Socket error:', data.message);
        });

        console.log('✅ Socket listeners setup complete');

    }, [dispatch, userId, activeChat]);

    // Initialize socket connection
    const connect = useCallback(() => {
        // Prevent multiple connection attempts
        if (isConnectingRef.current || socketRef.current?.connected) {
            console.log('⚠️ Socket already connecting or connected, skipping...');
            return;
        }

        if (!token || !userId) {
            console.log('⚠️ Missing token or userId, cannot connect socket');
            console.log('Token present:', !!token);
            console.log('UserId present:', !!userId);
            return;
        }

        console.log('🔌 Initializing socket connection...');
        console.log('Token:', token ? 'Present' : 'Missing');
        console.log('User ID:', userId);

        isConnectingRef.current = true;

        const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';
        console.log('🌐 Connecting to:', serverUrl);
        
        // Disconnect existing socket if any
        if (socketRef.current) {
            console.log('🔌 Cleaning up existing socket...');
            socketRef.current.disconnect();
            socketRef.current = null;
        }

        socketRef.current = io(serverUrl, {
            auth: { 
                token: token.startsWith('Bearer ') ? token.slice(7) : token 
            },
            transports: ['websocket', 'polling'],
            timeout: 20000,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            forceNew: true,
            autoConnect: true
        });

        setupSocketListeners(socketRef.current);

        // Manual connection attempt
        if (!socketRef.current.connected) {
            console.log('🔌 Manually triggering connection...');
            socketRef.current.connect();
        }

    }, [token, userId, setupSocketListeners]);

    // Disconnect socket
    const disconnect = useCallback(() => {
        console.log('🔌 Disconnecting socket...');
        
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
        
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
        
        joinedChatsRef.current.clear();
        isConnectingRef.current = false;
    }, []);

    // Join a chat room
    const joinChat = useCallback((chatId: string) => {
        if (!socketRef.current) {
            console.log('❌ Cannot join chat - socket not initialized');
            return;
        }

        if (!socketRef.current.connected) {
            console.log('❌ Cannot join chat - socket not connected');
            return;
        }

        if (joinedChatsRef.current.has(chatId)) {
            console.log('⚠️ Already joined chat:', chatId);
            return;
        }

        console.log('🚪 Joining chat via socket:', chatId);
        socketRef.current.emit('join_chat', chatId);
        joinedChatsRef.current.add(chatId);
        currentChatRef.current = chatId;
    }, []);

    // Leave a chat room
    const leaveChat = useCallback((chatId: string) => {
        if (!socketRef.current?.connected) {
            console.log('❌ Cannot leave chat - socket not connected');
            return;
        }

        if (!joinedChatsRef.current.has(chatId)) {
            console.log('⚠️ Not joined to chat:', chatId);
            return;
        }

        console.log('🚪 Leaving chat via socket:', chatId);
        socketRef.current.emit('leave_chat', chatId);
        joinedChatsRef.current.delete(chatId);
        
        if (currentChatRef.current === chatId) {
            currentChatRef.current = null;
        }
    }, []);

    // Send a message via socket
    const sendMessage = useCallback((messageData: {
        chatId: string;
        content: string;
        type?: string;
        replyTo?: string;
    }) => {
        if (!socketRef.current) {
            console.log('❌ Cannot send message - socket not initialized');
            return false;
        }

        if (!socketRef.current.connected) {
            console.log('❌ Cannot send message - socket not connected');
            return false;
        }

        console.log('📤 Sending message via socket:', messageData);
        socketRef.current.emit('send_message', messageData);
        return true;
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
        if (!socketRef.current?.connected) {
            console.log('❌ Cannot add reaction - socket not connected');
            return false;
        }

        console.log('😊 Adding reaction via socket:', { messageId, emoji });
        socketRef.current.emit('add_reaction', { messageId, emoji });
        return true;
    }, []);

    // Mark messages as read
    const markMessagesAsRead = useCallback((chatId: string) => {
        if (!socketRef.current?.connected) {
            console.log('❌ Cannot mark messages as read - socket not connected');
            return;
        }

        console.log('📖 Marking messages as read via socket:', chatId);
        socketRef.current.emit('mark_messages_read', chatId);
    }, []);

    // Initialize connection on mount and when dependencies change
    useEffect(() => {
        console.log('🚀 useSocket effect triggered');
        console.log('Token:', token ? 'Present' : 'Missing');
        console.log('UserId:', userId || 'Missing');
        console.log('Token type:', typeof token);
        console.log('UserId type:', typeof userId);
        
        if (token && userId) {
            console.log('✅ Both token and userId present - initializing connection');
            connect();
        } else {
            console.log('❌ Missing requirements for socket connection:');
            console.log('  - Token:', token ? '✅' : '❌');
            console.log('  - UserId:', userId ? '✅' : '❌');
        }

        return () => {
            console.log('🧹 useSocket cleanup');
            disconnect();
        };
    }, [token, userId]); // Remove connect/disconnect to avoid infinite loops

    // Handle active chat changes
    useEffect(() => {
        if (socketRef.current?.connected && activeChat && activeChat._id) {
            console.log('💬 Active chat changed, managing room subscriptions');
            
            // Leave all previous chats and join new one
            const previousChats = Array.from(joinedChatsRef.current);
            previousChats.forEach(chatId => {
                if (chatId !== activeChat._id) {
                    leaveChat(chatId);
                }
            });

            // Join new chat
            joinChat(activeChat._id);
            
            // Mark messages as read when entering chat
            markMessagesAsRead(activeChat._id);
        }
    }, [activeChat?._id]); // Only depend on the chat ID

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

    // Debug connection status
    useEffect(() => {
        const interval = setInterval(() => {
            if (socketRef.current) {
                console.log('🔍 Socket status check:', {
                    connected: socketRef.current.connected,
                    id: socketRef.current.id,
                    transport: socketRef.current.io.engine?.transport?.name
                });
            } else {
                console.log('🔍 Socket status: Not initialized');
            }
        }, 10000); // Check every 10 seconds

        return () => clearInterval(interval);
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