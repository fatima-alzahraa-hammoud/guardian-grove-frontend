import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { requestApi } from '../../libs/requestApi';
import { requestMethods } from '../../libs/enum/requestMethods';

export interface Message {
    _id: string;
    chatId: string;
    senderId: string;
    senderName: string;
    senderAvatar: string;
    content: string;
    type: 'text' | 'emoji' | 'sticker' | 'image' | 'file';
    timestamp: string;
    edited?: boolean;
    editedAt?: string;
    replyTo?: {
        _id: string;
        content: string;
        senderName: string;
        type: string;
    };
    reactions: {
        userId: string;
        emoji: string;
        timestamp: string;
    }[];
    readBy: {
        userId: string;
        readAt: string;
    }[];
    isDeleted: boolean;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
}

export interface Chat {
    _id: string;
    name: string;
    type: 'direct' | 'group';
    members: {
        _id: string;
        name: string;
        avatar: string;
        role: string;
    }[];
    familyId: string;
    avatar?: string;
    description?: string;
    lastMessage?: {
        messageId: string;
        content: string;
        senderId: string;
        senderName: string;
        timestamp: string;
        type: string;
    };
    unreadCount: number;
    isOnline?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface FamilyMember {
    _id: string;
    name: string;
    avatar: string;
    role: string;
}

export interface TypingUser {
    userId: string;
    userName: string;
    chatId: string;
}

interface MessageState {
    chats: Chat[];
    messages: { [chatId: string]: Message[] };
    familyMembers: FamilyMember[];
    activeChat: Chat | null;
    onlineUsers: string[];
    typingUsers: TypingUser[];
    loading: {
        chats: boolean;
        messages: boolean;
        sending: boolean;
        familyMembers: boolean;
    };
    error: string | null;
    hasMoreMessages: { [chatId: string]: boolean };
    messagePages: { [chatId: string]: number };
}

const initialState: MessageState = {
    chats: [],
    messages: {},
    familyMembers: [],
    activeChat: null,
    onlineUsers: [],
    typingUsers: [],
    loading: {
        chats: false,
        messages: false,
        sending: false,
        familyMembers: false
    },
    error: null,
    hasMoreMessages: {},
    messagePages: {}
};

const messageSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        setActiveChat: (state, action: PayloadAction<Chat | null>) => {
            // Reset unread count for the chat being activated
            if (action.payload) {
                const chatIndex = state.chats.findIndex(chat => chat._id === action.payload!._id);
                if (chatIndex !== -1) {
                    state.chats[chatIndex].unreadCount = 0;
                }
            }
            state.activeChat = action.payload;
        },
        addMessage: (state, action: PayloadAction<Message>) => {
            const message = action.payload;
            const chatId = message.chatId;
            
            // Initialize messages array if it doesn't exist
            if (!state.messages[chatId]) {
                state.messages[chatId] = [];
            }
            
            // Check if message already exists to avoid duplicates
            const existingIndex = state.messages[chatId].findIndex(msg => msg._id === message._id);
            if (existingIndex === -1) {
                state.messages[chatId].push(message);
                
                // Sort messages by timestamp to maintain order
                state.messages[chatId].sort((a, b) => 
                    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                );
            }
            
            // Update chat's last message and move to top
            const chatIndex = state.chats.findIndex(chat => chat._id === chatId);
            if (chatIndex !== -1) {
                const chat = state.chats[chatIndex];
                
                // Update last message
                chat.lastMessage = {
                    messageId: message._id,
                    content: message.content,
                    senderId: message.senderId,
                    senderName: message.senderName,
                    timestamp: message.timestamp,
                    type: message.type
                };
                
                // Move chat to top
                state.chats.splice(chatIndex, 1);
                state.chats.unshift(chat);
            }
        },
        updateMessage: (state, action: PayloadAction<Message>) => {
            const message = action.payload;
            const chatMessages = state.messages[message.chatId];
            if (chatMessages) {
                const index = chatMessages.findIndex(msg => msg._id === message._id);
                if (index !== -1) {
                    chatMessages[index] = message;
                }
            }
        },
        deleteMessage: (state, action: PayloadAction<{ messageId: string; chatId: string }>) => {
            const { messageId, chatId } = action.payload;
            const chatMessages = state.messages[chatId];
            if (chatMessages) {
                const index = chatMessages.findIndex(msg => msg._id === messageId);
                if (index !== -1) {
                    chatMessages[index].isDeleted = true;
                    chatMessages[index].content = "This message was deleted";
                }
            }
        },
        updateMessageReactions: (state, action: PayloadAction<{
            messageId: string;
            chatId: string;
            reactions: Message['reactions'];
        }>) => {
            const { messageId, chatId, reactions } = action.payload;
            const chatMessages = state.messages[chatId];
            if (chatMessages) {
                const index = chatMessages.findIndex(msg => msg._id === messageId);
                if (index !== -1) {
                    chatMessages[index].reactions = reactions;
                }
            }
        },
        setOnlineUsers: (state, action: PayloadAction<string[]>) => {
            state.onlineUsers = action.payload;
        },
        updateUserStatus: (state, action: PayloadAction<{ userId: string; isOnline: boolean }>) => {
            const { userId, isOnline } = action.payload;
            if (isOnline) {
                if (!state.onlineUsers.includes(userId)) {
                    state.onlineUsers.push(userId);
                }
            } else {
                state.onlineUsers = state.onlineUsers.filter(id => id !== userId);
            }
            
            // Update online status for direct chats
            state.chats.forEach(chat => {
                if (chat.type === 'direct') {
                    const otherMember = chat.members.find(member => member._id === userId);
                    if (otherMember) {
                        chat.isOnline = isOnline;
                    }
                }
            });
        },
        addTypingUser: (state, action: PayloadAction<TypingUser>) => {
            const typingUser = action.payload;
            const existingIndex = state.typingUsers.findIndex(
                user => user.userId === typingUser.userId && user.chatId === typingUser.chatId
            );
            if (existingIndex === -1) {
                state.typingUsers.push(typingUser);
            }
        },
        removeTypingUser: (state, action: PayloadAction<{ userId: string; chatId: string }>) => {
            const { userId, chatId } = action.payload;
            state.typingUsers = state.typingUsers.filter(
                user => !(user.userId === userId && user.chatId === chatId)
            );
        },
        clearError: (state) => {
            state.error = null;
        },
        resetMessages: (state) => {
            return initialState;
        },
        addChat: (state, action: PayloadAction<Chat>) => {
            const newChat = action.payload;
            const existingIndex = state.chats.findIndex(chat => chat._id === newChat._id);
            if (existingIndex === -1) {
                state.chats.unshift(newChat);
            } else {
                // Update existing chat
                state.chats[existingIndex] = newChat;
            }
        },
        updateChatUnreadCount: (state, action: PayloadAction<{ chatId: string; count: number; increment?: boolean }>) => {
            const { chatId, count, increment = true } = action.payload;
            const chat = state.chats.find(c => c._id === chatId);
            if (chat) {
                if (increment) {
                    chat.unreadCount += count;
                } else {
                    chat.unreadCount = count;
                }
                // Ensure unread count doesn't go below 0
                chat.unreadCount = Math.max(0, chat.unreadCount);
            }
        },
        setMessages: (state, action: PayloadAction<{ chatId: string; messages: Message[]; replace?: boolean }>) => {
            const { chatId, messages, replace = true } = action.payload;
            
            if (replace) {
                state.messages[chatId] = messages;
            } else {
                // Append messages (for pagination)
                if (!state.messages[chatId]) {
                    state.messages[chatId] = [];
                }
                
                // Add only new messages
                const existingIds = new Set(state.messages[chatId].map(msg => msg._id));
                const newMessages = messages.filter(msg => !existingIds.has(msg._id));
                
                state.messages[chatId] = [...newMessages, ...state.messages[chatId]];
                
                // Sort messages by timestamp
                state.messages[chatId].sort((a, b) => 
                    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                );
            }
        },
        setChats: (state, action: PayloadAction<Chat[]>) => {
            state.chats = action.payload;
        },
        markChatAsRead: (state, action: PayloadAction<string>) => {
            const chatId = action.payload;
            const chat = state.chats.find(c => c._id === chatId);
            if (chat) {
                chat.unreadCount = 0;
            }
        },
        incrementChatUnread: (state, action: PayloadAction<string>) => {
            const chatId = action.payload;
            const chat = state.chats.find(c => c._id === chatId);
            if (chat && state.activeChat?._id !== chatId) {
                chat.unreadCount += 1;
            }
        }
    }
});

export const {
    setActiveChat,
    addMessage,
    updateMessage,
    deleteMessage,
    updateMessageReactions,
    setOnlineUsers,
    updateUserStatus,
    addTypingUser,
    removeTypingUser,
    clearError,
    resetMessages,
    addChat,
    updateChatUnreadCount,
    setMessages,
    setChats,
    markChatAsRead,
    incrementChatUnread
} = messageSlice.actions;

export default messageSlice.reducer;

// Selectors
export const selectChats = (state: { messages: MessageState }) => state.messages.chats;
export const selectActiveChat = (state: { messages: MessageState }) => state.messages.activeChat;
export const selectMessages = (chatId: string) => (state: { messages: MessageState }) => 
    state.messages.messages[chatId] || [];
export const selectFamilyMembers = (state: { messages: MessageState }) => state.messages.familyMembers;
export const selectOnlineUsers = (state: { messages: MessageState }) => state.messages.onlineUsers;
export const selectTypingUsers = (chatId: string) => (state: { messages: MessageState }) =>
    state.messages.typingUsers.filter(user => user.chatId === chatId);
export const selectMessageLoading = (state: { messages: MessageState }) => state.messages.loading;
export const selectMessageError = (state: { messages: MessageState }) => state.messages.error;