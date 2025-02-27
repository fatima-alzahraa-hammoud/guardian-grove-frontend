import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Chat, ChatState } from "../../libs/types/chat.types";

const initialState: ChatState = {
    chats: [],
    activeChatId: null,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addChat: (state, action: PayloadAction<Chat>) => {
            state.chats.push(action.payload);
        },
        renameChat: (state, action: PayloadAction<{ id: string; title: string }>) => {
            const chat = state.chats.find(chat => chat._id === action.payload.id);
            if (chat) chat.title = action.payload.title;
        },
        deleteChat: (state, action: PayloadAction<string>) => {
            state.chats = state.chats.filter(chat => chat._id !== action.payload);
        },
        setActiveChat: (state, action: PayloadAction<string | null>) => {
            state.activeChatId = action.payload;
        },
        addMessageToChat: (
            state, 
            action: PayloadAction<{ chatId: string; sender: "user" | "bot"; message: string; }>
        ) => {
            const { chatId, sender, message} = action.payload;
            const chat = state.chats.find(chat => chat._id === chatId);
            if (chat) {
                chat.messages.push({ 
                    sender, 
                    message, 
                    timestamp: new Date().toISOString(),
                });
                chat.updatedAt = new Date().toISOString();

                if (action.payload.sender === "bot") 
                    chat.isResponding = false;
            }
        },
        setBotResponding: (state, action) => {
            const chat = state.chats.find(chat => chat._id === action.payload.chatId);
            if (chat) {
                chat.isResponding = action.payload.isResponding;
            }
        },
        updateChatTitle(state, action: PayloadAction<{ chatId: string; title: string }>) {
            const chat = state.chats.find((chat) => chat._id === action.payload.chatId);
            if (chat) {
              chat.title = action.payload.title;
            }
        },
        resetChats: (state) => {
            state.chats = [];
            state.activeChatId = null;
        },
    },
});
  
export const { addChat, renameChat, deleteChat, setActiveChat, addMessageToChat, updateChatTitle, resetChats, setBotResponding } = chatSlice.actions;

export const selectChats = (state: { chat: ChatState }) => state.chat.chats;
export const selectActiveChatId = (state: { chat: ChatState }) => state.chat.activeChatId;
export const selectActiveChatTitle = (state: { chat: ChatState }) => {
    const activeChat = state.chat.chats.find((chat) => chat._id === state.chat.activeChatId);
    return activeChat ? activeChat.title : "No active chat";
};
export const selectIsResponding = (state: { chat: ChatState }) => {
    const activeChat = state.chat.chats.find(chat => chat._id === state.chat.activeChatId);
    return activeChat ? activeChat.isResponding === true : false;
};


export default chatSlice.reducer;