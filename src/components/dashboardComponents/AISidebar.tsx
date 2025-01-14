import React, { useMemo, useState } from "react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarRail, useSidebar } from "../ui/sidebar";
import { Button } from "../ui/button";
import { Bot, Calendar, ChevronLeft, ChevronRight, History, Home, Layout, List, MessageCircle, MoreHorizontal, Search, Settings, Timer } from "lucide-react";
import AIFriend from "/assets/images/ai-friend.png";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { deleteChat, renameChat, selectActiveChatId, selectChats, setActiveChat } from "../../redux/slices/chatSlice";
import { organizeChatsByPeriod } from "../../libs/categorizeChatsHelper";
import { requestApi } from "../../libs/requestApi";
import { requestMethods } from "../../libs/enum/requestMethods";
import { toast, ToastContainer } from "react-toastify";

interface SidebarProps {
  collapsed: boolean;
}

const AISidebar : React.FC<SidebarProps> = ({collapsed}) => {

    const { toggleSidebar, state } = useSidebar();
    collapsed = state === "collapsed";

    const dispatch = useDispatch();
    const chats = useSelector(selectChats);
    const activeChatId = useSelector(selectActiveChatId);
    const chatHistory = useMemo(() => organizeChatsByPeriod(chats), [chats]);

    const [activeItem, setActiveItem] = useState<string | null>(null);
    const [hoveredChat, setHoveredChat] = React.useState<string | null>(null);

    const handleClickChat = (chatId: string) => {
        dispatch(setActiveChat(chatId));
    };

    const handleDeleteChat = async (chatId: string) => {
        try {
            const response = await requestApi({
                route: "/chats/",
                method: requestMethods.DELETE,
                body: {chatId}
            });
            if (response){
                dispatch(deleteChat(chatId));
            }
            else{
                toast.error("Failed to delete chat");
            }
        } catch (error) {
            console.log("Something wrong happened", error);
        }
    };

    const handleRenameChat = async (chatId: string, title: string) => {
        try {
            const response = await requestApi({
                route: "/chats/rename",
                method: requestMethods.PUT,
                body: {chatId, title}
            });
            if (response){
                dispatch(renameChat({id: chatId, title: title}));
            }
            else{
                toast.error("Failed to rename chat");
            }
        } catch (error) {
            console.log("Something wrong happened", error);
        }
    };  

    const features = [
        { title: "Generate plans", icon: Calendar, url: "#" },
        { title: "Learning Zone", icon: Bot, url: "#" },
        { title: "Track My Day", icon: Timer, url: "#" },
        { title: "Tell Me a Story", icon: MessageCircle, url: "#" },
        { title: "View Tasks", icon: List, url: "#" },
        { title: "Progress Tracker", icon: Layout, url: "#" },
    ];  
  
    return(

        <Sidebar
            collapsible="icon"
            className={`h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out border-r bg-[#B2D1F1] flex flex-col justify-between fixed top-16 left-0`}
        >        
        <ToastContainer/>    
            {/* Sidebar header */}
            <SidebarHeader className="h-20 px-4 flex flex-col justify-center bg-[#B2D1F1] border-[#B2D1F1]">
                <div className="flex items-center justify-between w-full">
                    <Button variant="ghost" size="icon" className="w-8 h-8" onClick={toggleSidebar}>
                        {collapsed ? <ChevronRight className="w-6 h-6 text-sky-600" /> : <ChevronLeft className="w-5 h-5 text-sky-600" />}
                    </Button>
                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" className="w-8 h-8 group-data-[collapsible=icon]:hidden">
                            <Search className="w-5 h-5 text-sky-600" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8 group-data-[collapsible=icon]:hidden">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.6729 3.91324C16.8918 2.69429 18.8682 2.69429 20.0871 3.91324C21.3061 5.13219 21.3061 7.1085 20.0871 8.32745L14.1499 14.2647C13.3849 15.0297 12.3925 15.5259 11.3215 15.6789L9.14142 15.9903C8.82983 16.0348 8.51546 15.9301 8.29289 15.7075C8.07033 15.4849 7.96554 15.1705 8.01005 14.859L8.32149 12.6789C8.47449 11.6079 8.97072 10.6154 9.7357 9.85043L15.6729 3.91324ZM18.6729 5.32745C18.235 4.88955 17.525 4.88955 17.0871 5.32745L11.1499 11.2647C10.6909 11.7237 10.3932 12.3191 10.3014 12.9617L10.1785 13.8219L11.0386 13.699C11.6812 13.6072 12.2767 13.3095 12.7357 12.8505L18.6729 6.91324C19.1108 6.47534 19.1108 5.76536 18.6729 5.32745ZM11 3.99966C11.0004 4.55194 10.5531 5 10.0008 5.00044C9.00227 5.00121 8.29769 5.00864 7.74651 5.06101C7.20685 5.11228 6.88488 5.20154 6.63803 5.32732C6.07354 5.61494 5.6146 6.07388 5.32698 6.63836C5.19279 6.90172 5.10062 7.24941 5.05118 7.85457C5.00078 8.47142 5 9.26373 5 10.4004V13.6004C5 14.737 5.00078 15.5293 5.05118 16.1461C5.10062 16.7513 5.19279 17.099 5.32698 17.3623C5.6146 17.9268 6.07354 18.3858 6.63803 18.6734C6.90138 18.8076 7.24907 18.8997 7.85424 18.9492C8.47108 18.9996 9.26339 19.0004 10.4 19.0004H13.6C14.7366 19.0004 15.5289 18.9996 16.1458 18.9492C16.7509 18.8997 17.0986 18.8076 17.362 18.6734C17.9265 18.3858 18.3854 17.9268 18.673 17.3623C18.7988 17.1155 18.8881 16.7935 18.9393 16.2539C18.9917 15.7027 18.9991 14.9981 18.9999 13.9996C19.0003 13.4473 19.4484 12.9999 20.0007 13.0004C20.553 13.0008 21.0003 13.4489 20.9999 14.0011C20.9991 14.9793 20.9932 15.7812 20.9304 16.443C20.8664 17.1164 20.7385 17.714 20.455 18.2703C19.9757 19.2111 19.2108 19.976 18.27 20.4554C17.6777 20.7572 17.0375 20.883 16.3086 20.9425C15.6008 21.0004 14.7266 21.0004 13.6428 21.0004H10.3572C9.27339 21.0004 8.39925 21.0004 7.69138 20.9425C6.96253 20.883 6.32234 20.7572 5.73005 20.4554C4.78924 19.976 4.02433 19.2111 3.54497 18.2703C3.24318 17.678 3.11737 17.0378 3.05782 16.309C2.99998 15.6011 2.99999 14.727 3 13.6432V10.3576C2.99999 9.27374 2.99998 8.39959 3.05782 7.69171C3.11737 6.96286 3.24318 6.32267 3.54497 5.73038C4.02433 4.78957 4.78924 4.02467 5.73005 3.5453C6.28633 3.26186 6.88399 3.13395 7.55735 3.06998C8.21919 3.0071 9.02103 3.0012 9.99922 3.00044C10.5515 3.00001 10.9996 3.44737 11 3.99966Z" fill="#0284C7"/>
                        </svg>

                        </Button>
                    </div>
                </div>
                <div className="flex items-center gap-3 group-data-[collapsible=icon]:hidden pl-2 text-xl font-comic font-extrabold pt-2">
                    <img src={AIFriend} alt="ai friend" className="w-7 h-7" />
                    <span className=" text-sky-800">my friend</span>
                </div>
            </SidebarHeader>

            {/* Sidebar Content */}
            <SidebarContent className={`bg-[#B2D1F1] pt-3 pl-3 ${collapsed ? "items-center pl-0" : ""}`}>

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
                                chats.length > 0 && (
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
                                                            : period === 'previous30days'
                                                            ? 'Previous 30 days'
                                                            : period}
                                                    </span>
                                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {chats.map((chat) => (
                                                        <SidebarMenuSubItem key={chat._id}>
                                                            <SidebarMenuSubButton
                                                                asChild
                                                                className={`group ${chat._id === activeChatId  ? "bg-white text-sky-800 hover:text-sky-800" : "text-sky-800 hover:bg-[#3A8EBA] hover:text-white"} transition-colors duration-200 font-poppins text-xs`}
                                                            >
                                                            <a
                                                                className={`text-sky-800 font-poppins text-xs ${activeChatId === chat._id ? 'bg-white text-[#3A8EBA] hover:text-[#3A8EBA]' : ''}`}
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleClickChat(chat._id);
                                                                }}
                                                                onMouseEnter={() => setHoveredChat(chat._id)}
                                                                onMouseLeave={() => setHoveredChat(null)} 
                                                            >
                                                                <span className="group-data-[collapsible=icon]:hidden text-left">{chat.title}</span>
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className={`h-6 w-6 ml-auto ${hoveredChat === chat._id ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        >
                                                                            <MoreHorizontal className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end" className="w-40">
                                                                        <DropdownMenuItem>Rename</DropdownMenuItem>
                                                                        <DropdownMenuItem>Share</DropdownMenuItem>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem 
                                                                            className="text-red-600"
                                                                            onClick={() => handleDeleteChat(chat._id)}
                                                                        >
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
                                )
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
                <div className="flex items-center justify-around mt-4 group-data-[collapsible=icon]:flex-col">
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