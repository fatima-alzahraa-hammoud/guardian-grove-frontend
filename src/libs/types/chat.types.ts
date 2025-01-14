export interface Message {
    sender: "user" | "bot";
    message: string; 
    timestamp: string;
}

export interface Chat {
    _id: string;
    title: string;
    messages: Message[];
    createdAt: Date;
    updatedAt: string;
}

export interface ChatState {
    chats: Chat[];
    activeChatId: string | null;
}