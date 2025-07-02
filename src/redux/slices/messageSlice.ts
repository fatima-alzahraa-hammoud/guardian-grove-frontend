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

// Async thunks
export const fetchChats = createAsyncThunk(
    'messages/fetchChats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await requestApi({
                route: "/familyChats/messages/chats",
                method: requestMethods.GET
            });
            return response.chats;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch chats');
        }
    }
);

export const fetchMessages = createAsyncThunk(
    'messages/fetchMessages',
    async ({ chatId, page = 1 }: { chatId: string; page?: number }, { rejectWithValue }) => {
        try {
            const response = await requestApi({
                route: `/familyChats/messages/chats/${chatId}/messages?page=${page}&limit=50`,
                method: requestMethods.GET
            });
            return {
                chatId,
                messages: response.messages,
                hasMore: response.pagination.hasMore,
                page
            };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch messages');
        }
    }
);

export const sendMessage = createAsyncThunk(
    'messages/sendMessage',
    async (messageData: {
        chatId: string;
        content: string;
        type?: string;
        replyTo?: string;
        file?: File;
    }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('chatId', messageData.chatId);
            formData.append('content', messageData.content);
            if (messageData.type) formData.append('type', messageData.type);
            if (messageData.replyTo) formData.append('replyTo', messageData.replyTo);
            if (messageData.file) formData.append('messageFile', messageData.file);

            const response = await requestApi({
                route: `/familyChats/messages/chats/${messageData.chatId}/messages`,
                method: requestMethods.POST,
                body: formData,
            });
            return response.messageData;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to send message');
        }
    }
);

export const createGroupChat = createAsyncThunk(
    'messages/createGroupChat',
    async (groupData: {
        name: string;
        members: string[];
        description?: string;
    }, { rejectWithValue }) => {
        try {
            const response = await requestApi({
                route: "/familyChats/messages/chats/group",
                method: requestMethods.POST,
                body: groupData
            });
            return response.chat;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create group chat');
        }
    }
);

export const createDirectChat = createAsyncThunk(
    'messages/createDirectChat',
    async (memberId: string, { rejectWithValue }) => {
        try {
            const response = await requestApi({
                route: "/familyChats/messages/chats/direct",
                method: requestMethods.POST,
                body: { memberId }
            });
            return response.chat;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create direct chat');
        }
    }
);

export const fetchFamilyMembers = createAsyncThunk(
    'messages/fetchFamilyMembers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await requestApi({
                route: "/family/FamilyMembers",
                method: requestMethods.GET
            });
            return response.members;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch family members');
        }
    }
);

export const markMessagesAsRead = createAsyncThunk(
    'messages/markAsRead',
    async (chatId: string, { rejectWithValue }) => {
        try {
            await requestApi({
                route: `/familyChats/messages/chats/${chatId}/read`,
                method: requestMethods.PUT
            });
            return chatId;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to mark messages as read');
        }
    }
);

const messageSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        setActiveChat: (state, action: PayloadAction<Chat | null>) => {
            state.activeChat = action.payload;
        },
        addMessage: (state, action: PayloadAction<Message>) => {
            const message = action.payload;
            if (!state.messages[message.chatId]) {
                state.messages[message.chatId] = [];
            }
            state.messages[message.chatId].push(message);
            
            // Update chat's last message and move to top
            const chatIndex = state.chats.findIndex(chat => chat._id === message.chatId);
            if (chatIndex !== -1) {
                const chat = state.chats[chatIndex];
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
                    const otherMember = chat.members.find(member => member._id !== userId);
                    if (otherMember && otherMember._id === userId) {
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
            }
        },
        updateChatUnreadCount: (state, action: PayloadAction<{ chatId: string; count: number }>) => {
            const { chatId, count } = action.payload;
            const chat = state.chats.find(c => c._id === chatId);
            if (chat) {
                chat.unreadCount = count;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch chats
            .addCase(fetchChats.pending, (state) => {
                state.loading.chats = true;
                state.error = null;
            })
            .addCase(fetchChats.fulfilled, (state, action) => {
                state.loading.chats = false;
                state.chats = action.payload;
            })
            .addCase(fetchChats.rejected, (state, action) => {
                state.loading.chats = false;
                state.error = action.payload as string;
            })
            
            // Fetch messages
            .addCase(fetchMessages.pending, (state) => {
                state.loading.messages = true;
                state.error = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loading.messages = false;
                const { chatId, messages, hasMore, page } = action.payload;
                
                if (page === 1) {
                    state.messages[chatId] = messages;
                } else {
                    // Prepend older messages
                    state.messages[chatId] = [...messages, ...(state.messages[chatId] || [])];
                }
                
                state.hasMoreMessages[chatId] = hasMore;
                state.messagePages[chatId] = page;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.loading.messages = false;
                state.error = action.payload as string;
            })
            
            // Send message
            .addCase(sendMessage.pending, (state) => {
                state.loading.sending = true;
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.loading.sending = false;
                // Message will be added via socket event
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.loading.sending = false;
                state.error = action.payload as string;
            })
            
            // Create group chat
            .addCase(createGroupChat.fulfilled, (state, action) => {
                state.chats.unshift(action.payload);
            })
            
            // Create direct chat
            .addCase(createDirectChat.fulfilled, (state, action) => {
                const existingChat = state.chats.find(chat => chat._id === action.payload._id);
                if (!existingChat) {
                    state.chats.unshift(action.payload);
                }
            })
            
            // Fetch family members
            .addCase(fetchFamilyMembers.pending, (state) => {
                state.loading.familyMembers = true;
            })
            .addCase(fetchFamilyMembers.fulfilled, (state, action) => {
                state.loading.familyMembers = false;
                state.familyMembers = action.payload;
            })
            .addCase(fetchFamilyMembers.rejected, (state, action) => {
                state.loading.familyMembers = false;
                state.error = action.payload as string;
            })
            
            // Mark messages as read
            .addCase(markMessagesAsRead.fulfilled, (state, action) => {
                const chatId = action.payload;
                const chat = state.chats.find(c => c._id === chatId);
                if (chat) {
                    chat.unreadCount = 0;
                }
            });
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
    updateChatUnreadCount
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