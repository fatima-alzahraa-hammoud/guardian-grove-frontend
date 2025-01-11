import React, { useState } from "react";
import AISidebar from "../../components/dashboardComponents/AISidebar";
import { SidebarProvider } from "../../components/ui/sidebar";
import AIChatbot from "../../components/dashboardComponents/AIChatbot";

const AIFriend : React.FC = () => {

    const [collapsed] = useState<boolean>(false);
    
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