
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