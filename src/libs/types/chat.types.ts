export interface Message {
    sender: "user" | "bot";
    message: string; 
    timestamp: Date;
}

export interface Chat {
    _id: string;
    title: string;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ChatState {
    chats: Chat[];
    activeChatId: string | null;
}