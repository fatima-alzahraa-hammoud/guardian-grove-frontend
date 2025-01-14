import { Chat } from "./types/chat.types";

const organizeChatsByPeriod = (chats: Chat[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  
    const organized: {
        today: Chat[];
        previous7days: Chat[];
        previous30days: Chat[];
        byMonth: { [key: string]: Chat[] };
    } = {
        today: [],
        previous7days: [],
        previous30days: [],
        byMonth: {},
    };
  
    chats.forEach(chat => {
        const chatDate = new Date(chat.updatedAt);
        
        if (chatDate >= today) {
            organized.today.push(chat);
        } else if (chatDate >= sevenDaysAgo) {
            organized.previous7days.push(chat);
        } else if (chatDate >= thirtyDaysAgo) {
            organized.previous30days.push(chat);
        } else {
            const monthYear = chatDate.toLocaleString('default', { month: 'long', year: 'numeric' });
            if (!organized.byMonth[monthYear]) {
                organized.byMonth[monthYear] = [];
            }
            organized.byMonth[monthYear].push(chat);
        }
    });
  
    // Sort chats within each category by updatedAt
    const sortChats = (chats: Chat[]) => 
        chats.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  
    organized.today = sortChats(organized.today);
    organized.previous7days = sortChats(organized.previous7days);
    organized.previous30days = sortChats(organized.previous30days);
    Object.keys(organized.byMonth).forEach(month => {
      organized.byMonth[month] = sortChats(organized.byMonth[month]);
    });
  
    return organized;
};