import React, { useEffect, useState } from "react";
import AISidebar from "../../components/dashboardComponents/AISidebar";
import { SidebarProvider } from "../../components/ui/sidebar";
import AIChatbot from "../../components/dashboardComponents/AIChatbot";
import { requestApi } from "../../libs/requestApi";
import { requestMethods } from "../../libs/enum/requestMethods";
import { useDispatch } from "react-redux";
import { addChat } from "../../redux/slices/chatSlice";

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

const AIFriend : React.FC = () => {

    const dispatch = useDispatch();

    const [collapsed] = useState<boolean>(false);
    
    useEffect(() => {
        loadChats();
    }, []);

    const loadChats = async () =>{
        try {
            const response = await requestApi({
                route: "/chats/getChats",
                method: requestMethods.GET
            });

            if (response){
                if (response.chats){
                    const fetchedChats = response.chats;
                    // Add all fetched chats to the Redux store
                    fetchedChats.forEach((chat: Chat) => {
                        dispatch(addChat(chat));
                    });
                }
                else{
                    console.log("failed to loa data", response.message);
                }
            }
        } catch (error) {
            console.error("Error loading chats", error);
        }
    }

    return(
        <div>
            <SidebarProvider>
                <AISidebar collapsed={collapsed} />

                {/* AI Chatbot Area */}
                <div className={`pt-28 max-w-[1200px] w-full transition-all duration-300 text-left ml-10 `}>
                    <AIChatbot />
                </div>
            </SidebarProvider>
        </div>
    );
}
export default AIFriend;