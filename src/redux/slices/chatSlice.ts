
interface Chat {
    id: string;
    title: string;
    messages: string[];
}

interface ChatState {
    chats: Chat[];
    activeChatId: string | null;
}