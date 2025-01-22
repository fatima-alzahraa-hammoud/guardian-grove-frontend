import { Chat } from "./types/chat.types";

export const organizeChatsByPeriod = (chats: Chat[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  
    const chatsByPeriod: { [key: string]: Chat[] } = {
        today: [],
        previous7days: [],
        previous30days: [],
    };
  
    chats.forEach(chat => {
        const chatDate = new Date(chat.updatedAt);
        
        if (chatDate >= today) {
                chatsByPeriod.today.push(chat);
        } else if (chatDate >= sevenDaysAgo) {
                chatsByPeriod.previous7days.push(chat);
        } else if (chatDate >= thirtyDaysAgo) {
                chatsByPeriod.previous30days.push(chat);
        } else {
            const monthYear = chatDate.toLocaleString('default', { month: 'long', year: 'numeric' });
            if (!chatsByPeriod[monthYear]) {
                chatsByPeriod[monthYear] = [];
            }
            chatsByPeriod[monthYear].push(chat);
        }
    });
  
    // Sort chats within each period
    Object.keys(chatsByPeriod).forEach(period => {
        chatsByPeriod[period].sort((a, b) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    });
  
    return chatsByPeriod;
};