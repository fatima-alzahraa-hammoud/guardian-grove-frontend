import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
    sender: "user" | "ai";
    message: string; 
    timestamp: string;
}

interface Chat {
    id: string;
    title: string;
    messages: Message[];
}

interface ChatState {
    chats: Chat[];
    activeChatId: string | null;
}

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
            const chat = state.chats.find(chat => chat.id === action.payload.id);
            if (chat) chat.title = action.payload.title;
        },
        deleteChat: (state, action: PayloadAction<string>) => {
            state.chats = state.chats.filter(chat => chat.id !== action.payload);
        },
        setActiveChat: (state, action: PayloadAction<string | null>) => {
            state.activeChatId = action.payload;
        },
        addMessageToChat: (
            state, 
            action: PayloadAction<{ chatId: string; sender: "user" | "ai"; message: string }>
        ) => {
            const { chatId, sender, message } = action.payload;
            const chat = state.chats.find(chat => chat.id === chatId);
            if (chat) {
                const timestamp = new Date().toLocaleTimeString();
                chat.messages.push({ sender, message, timestamp });
            }
        },
    },
});
  
export const { addChat, renameChat, deleteChat, setActiveChat, addMessageToChat } = chatSlice.actions;

export const selectChats = (state: { chat: ChatState }) => state.chat.chats;

export default chatSlice.reducer;