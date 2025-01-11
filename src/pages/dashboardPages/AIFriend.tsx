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

                {/* Main Content Area */}
                <div className={` pt-8 flex-grow max-w-[1200px] w-full mx-auto transition-all duration-300 text-left ${collapsed ? 'ml-20' : 'ml-64'}`}>
                    <AIChatbot />
                </div>
            </SidebarProvider>
        </div>
    );
}
export default AIFriend;