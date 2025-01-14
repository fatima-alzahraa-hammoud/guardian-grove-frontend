import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Chat {
    id: string;
    title: string;
    messages: string[];
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
        addMessageToChat: (state, action: PayloadAction<{ chatId: string; message: string }>) => {
            const chat = state.chats.find(chat => chat.id === action.payload.chatId);
            if (chat) chat.messages.push(action.payload.message);
        },
    },
});
  