import React, { useState } from "react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarRail, useSidebar } from "../ui/sidebar";
import { Button } from "../ui/button";
import { Bot, Calendar, ChevronLeft, ChevronRight, History, Home, Layout, List, MessageCircle, MessageSquarePlus, MoreHorizontal, Search, Settings, Timer } from "lucide-react";
import AIFriend from "/assets/images/ai-friend.png";
import infoImage from '/assets/images/dashboard/badge-info-ai.svg';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

const AISidebar : React.FC = () => {

    const { toggleSidebar, state } = useSidebar();
    const isCollapsed = state === "collapsed";

    const [activeItem, setActiveItem] = useState<string | null>(null);
    const [activeChat, setActiveChat] = React.useState<string | null>(null);
    const [hoveredChat, setHoveredChat] = React.useState<string | null>(null);

    const features = [
        { title: "Generate plans", icon: Calendar, url: "#" },
        { title: "Learning Zone", icon: Bot, url: "#" },
        { title: "Track My Day", icon: Timer, url: "#" },
        { title: "Tell Me a Story", icon: MessageCircle, url: "#" },
        { title: "View Tasks", icon: List, url: "#" },
        { title: "Progress Tracker", icon: Layout, url: "#" },
    ];

    const chatHistory = {
        today: [
          { id: "chat1", title: "Second chat", url: "#" },
          { id: "chat2", title: "First chat", url: "#" },
        ],
        previous7days: [
          { id: "chat3", title: "Second chat", url: "#" },
          { id: "chat4", title: "First chat", url: "#" },
        ],
        previous30days: [
          { id: "chat5", title: "First chat", url: "#" },
        ],
    };    
  
    return(

        <Sidebar collapsible="icon" className="h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out border-r bg-[#B2D1F1] flex flex-col justify-between fixed top-16 left-0">
            
            {/* Sidebar header */}
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

            {/* Sidebar Content */}
            <SidebarContent className="bg-[#B2D1F1] pt-3 pl-3">

                {/* features */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-sky-700 group-data-[collapsible=icon]:hidden font-comic font-bold">
                        Features
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {features.map((feature) => (
                                <SidebarMenuItem key={feature.title}>
                                    <SidebarMenuButton
                                        asChild
                                        className={`${
                                            activeItem === feature.title
                                                ? "bg-white text-sky-800 hover:text-sky-800"
                                                : "text-sky-800 hover:bg-[#3A8EBA] hover:text-white"
                                        } transition-colors duration-200 font-poppins text-xs`}
                                        onClick={() => setActiveItem(feature.title)}
                                    >
                                        <a href={feature.url}>
                                            <feature.icon className="w-4 h-4" />
                                            <span className="group-data-[collapsible=icon]:hidden pl-1">
                                                {feature.title}
                                            </span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Chat History */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-sky-700 group-data-[collapsible=icon]:hidden font-comic font-extrabold">Chat History</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {Object.entries(chatHistory).map(([period, chats]) => (
                                <Collapsible key={period} className="group/collapsible">
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton className="text-sky-800 hover:bg-[#3A8EBA] hover:text-white transition-colors duration-200">
                                                <History className="w-4 h-4" />
                                                <span className="group-data-[collapsible=icon]:hidden font-poppins text-xs">
                                                    {period === 'today'
                                                        ? 'Today'
                                                        : period === 'previous7days'
                                                        ? 'Previous 7 days'
                                                        : 'Previous 30 days'}
                                                </span>
                                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {chats.map((chat) => (
                                                    <SidebarMenuSubItem key={chat.id}>
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            className={`group ${activeChat === chat.id ? "bg-white text-sky-800 hover:text-sky-800" : "text-sky-800 hover:bg-[#3A8EBA] hover:text-white"} transition-colors duration-200 font-poppins text-xs`}
                                                        >
                                                        <a
                                                            href={chat.url}
                                                            className={`text-sky-800 font-poppins text-xs ${activeChat === chat.id ? 'bg-white text-[#3A8EBA] hover:text-[#3A8EBA]' : ''}`}
                                                            onClick={(e) => {
                                                            e.preventDefault();
                                                            setActiveChat(chat.id);
                                                            }}
                                                            onMouseEnter={() => setHoveredChat(chat.id)}
                                                            onMouseLeave={() => setHoveredChat(null)} 
                                                        >
                                                            <span className="group-data-[collapsible=icon]:hidden">{chat.title}</span>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className={`h-6 w-6 ml-auto ${hoveredChat === chat.id ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="w-40">
                                                                    <DropdownMenuItem>Rename</DropdownMenuItem>
                                                                    <DropdownMenuItem>Share</DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem className="text-red-600">
                                                                        Delete
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </a>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>

            {/* Sidebar footer */}
            <SidebarFooter className="bg-[#B2D1F1] p-4 pt-6">
                <div className="flex flex-col gap-4 group-data-[collapsible=icon]:hidden">
                    <Button variant="secondary" className="w-full bg-[#3A8EBA] hover:bg-[#326E9F] text-white transition-colors duration-200">
                        Quick Tip
                    </Button>
                </div>
                <div className="flex items-center justify-around mt-4">
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                        <Home className="w-4 h-4 text-[#0284c7]" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8 group-data-[collapsible=icon]:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-badge-info text-[#0284c7]">
                            <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/>
                            <line x1="12" x2="12" y1="16" y2="12"/>
                            <line x1="12" x2="12.01" y1="8" y2="8"/>
                        </svg>
                        </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                        <Settings className="w-4 h-4 text-[#0284c7]" />
                    </Button>
                </div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
};

export default AISidebar;