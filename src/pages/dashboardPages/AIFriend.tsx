import React, { useEffect, useState } from "react";
import AISidebar from "../../components/dashboardComponents/AISidebar";
import { SidebarProvider } from "../../components/ui/sidebar";
import AIChatbot from "../../components/dashboardComponents/AIChatbot";
import { requestApi } from "../../libs/requestApi";
import { requestMethods } from "../../libs/enum/requestMethods";
import { useDispatch } from "react-redux";
import { addChat, setActiveChat } from "../../redux/slices/chatSlice";
import { Chat } from "../../libs/types/chat.types";

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

                    if (fetchedChats.length === 1 && fetchedChats[0].title === "Welcome Chat") {
                        dispatch(setActiveChat(fetchedChats[0]._id));
                    }
    
                }
                else{
                    console.log("failed to load data", response.message);
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
                <div className="flex justify-center w-full">
                    <div className="pt-28 w-full transition-all duration-300">
                        <AIChatbot collapsed={collapsed}/>
                    </div>
                </div>
            </SidebarProvider>
        </div>
    );
}
export default AIFriend;