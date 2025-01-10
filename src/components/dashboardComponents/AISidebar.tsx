import React from "react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, useSidebar } from "../ui/sidebar";
import { Button } from "../ui/button";
import { Bot, Calendar, ChevronLeft, ChevronRight, Layout, List, MessageCircle, MessageSquarePlus, Search, Timer } from "lucide-react";
import AIFriend from "/assets/images/ai-friend.png";

const AISidebar : React.FC = () => {

    const { toggleSidebar, state } = useSidebar();
    const isCollapsed = state === "collapsed";

    const features = [
        { title: "Generate plans", icon: Calendar, url: "#" },
        { title: "Learning Zone", icon: Bot, url: "#" },
        { title: "Track My Day", icon: Timer, url: "#" },
        { title: "Tell Me a Story", icon: MessageCircle, url: "#" },
        { title: "View Tasks", icon: List, url: "#" },
        { title: "Progress Tracker", icon: Layout, url: "#" },
    ];
  
    return(

        <Sidebar collapsible="icon" className="h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out border-r bg-[#B2D1F1] flex flex-col justify-between fixed top-16 left-0">
            <SidebarHeader className="h-20 px-4 flex flex-col justify-center bg-[#B2D1F1] border-[#B2D1F1]">
                <div className="flex items-center justify-between w-full">
                    <Button variant="ghost" size="icon" className="w-8 h-8" onClick={toggleSidebar}>
                        {isCollapsed ? <ChevronRight className="w-6 h-6 text-sky-600" /> : <ChevronLeft className="w-5 h-5 text-sky-600" />}
                    </Button>
                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" className="w-8 h-8 group-data-[collapsible=icon]:hidden">
                            <MessageSquarePlus className="w-5 h-5 text-sky-600" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8 group-data-[collapsible=icon]:hidden">
                            <Search className="w-5 h-5 text-sky-600" />
                        </Button>
                    </div>
                </div>
                <div className="flex items-center gap-3 group-data-[collapsible=icon]:hidden pl-2 text-xl font-comic font-extrabold pt-2">
                    <img src={AIFriend} alt="ai friend" className="w-7 h-7" />
                    <span className=" text-sky-800">my friend</span>
                </div>
            </SidebarHeader>
            <SidebarContent className="bg-[#B2D1F1]">
            </SidebarContent>
            <SidebarFooter className="bg-[#B2D1F1]">
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
};

export default AISidebar;