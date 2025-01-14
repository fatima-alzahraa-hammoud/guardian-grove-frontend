import { Chat } from "./types/chat.types";

// Helper function to categorize chats by time period
export const categorizeChatsByDate = (chats: Chat[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
  
    return chats.reduce((acc: { [key: string]: Chat[] }, chat) => {
        const chatDate = new Date(chat.updatedAt);
        
        if (chatDate >= today) {
            acc.today = [...(acc.today || []), chat];
        } else if (chatDate >= sevenDaysAgo) {
            acc.previous7days = [...(acc.previous7days || []), chat];
        } else if (chatDate >= thirtyDaysAgo) {
            acc.previous30days = [...(acc.previous30days || []), chat];
        } else {
            const monthYear = chatDate.toLocaleString('default', { month: 'long', year: 'numeric' });
            acc[monthYear] = [...(acc[monthYear] || []), chat];
        }
    
        return acc;
    }, {});
};