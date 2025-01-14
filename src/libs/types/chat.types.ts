export interface Message {
    sender: "user" | "ai";
    message: string; 
    timestamp: Date;
}

export interface Chat {
    id: string;
    title: string;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ChatState {
    chats: Chat[];
    activeChatId: string | null;
}