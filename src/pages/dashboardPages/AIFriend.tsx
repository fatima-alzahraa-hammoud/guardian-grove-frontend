import React from "react";
import AISidebar from "../../components/dashboardComponents/AISidebar";
import { SidebarProvider } from "../../components/ui/sidebar";

const AIFriend : React.FC = () => {

    return(
        <div>
            <SidebarProvider>
                <AISidebar />
            </SidebarProvider>
        </div>
    );
}
export default AIFriend;