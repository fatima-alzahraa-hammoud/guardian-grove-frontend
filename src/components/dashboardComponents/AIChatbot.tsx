import React, { useEffect, useRef, useState } from "react";
import AIFriend from "/assets/images/ai-friend.png";
import { Card } from "../ui/card";
import { Mic, Paperclip, Send } from "lucide-react";
import {toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addChat, addMessageToChat, selectActiveChatId, selectActiveChatTitle, selectChats, selectIsResponding, setActiveChat, setBotResponding, updateChatTitle } from "../../redux/slices/chatSlice";
import { requestApi } from "../../libs/requestApi";
import { requestMethods } from "../../libs/enum/requestMethods";
import MessageComponent from "../common/MessageComponent";
import VoiceDialog from "../common/VoiceDialog";


interface AIChatbotProps {
    collapsed: boolean;
  }
  

const AIChatbot : React.FC<AIChatbotProps>  = ({collapsed}) => {

    const [input, setInput] = useState<string>("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const chats = useSelector(selectChats);
    let activeChatId = useSelector(selectActiveChatId);
    const activeChatTitle = useSelector(selectActiveChatTitle);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [isCall, setIsCall] = useState(true);


    const isBotResponding = useSelector(selectIsResponding);

    const dispatch = useDispatch();

    const activeChat = chats.find((chat) => chat._id === activeChatId) || null;
    const messages = activeChat ? activeChat.messages : [];

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [isDialogOpen, setDialogOpen] = useState(false);
    
    const handleDialogOpen = () => {
        setDialogOpen(true);
    };
          
    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        // Ensure scroll is always at the bottom after messages change
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);
     

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
        }
    }, [input]);

    // Handle voice input from dialog
    const handleVoiceInput = async (transcript: string) => {
        try {
            if (activeChatId !== null) {
                dispatch(addMessageToChat({ chatId: activeChatId, sender: "user", message: transcript }));
            } else{
                const result = await requestApi({
                    route: "/chats/",
                    method: requestMethods.POST,
                    body: {sender: "user", message: transcript.trim()},
                });
                if (result && result.chat){
                    dispatch(addChat(result.chat));
                    dispatch(setActiveChat(result.chat._id));
                    activeChatId = result.chat._id;
                }else{
                    toast.error("something went wrong ", result.message);
                }
            }
        
            const data = { sender: "user", message: transcript.trim(), chatId: activeChatId };
            if (transcript.trim()) {
                dispatch(setBotResponding({ chatId: activeChatId, isResponding: true }));
                const response = await requestApi({
                    route: "/chats/handle",
                    method: requestMethods.POST,
                    body: data
                });
                dispatch(setBotResponding({ chatId: activeChatId, isResponding: false }));
                if (response) {
                    if (activeChatId !== null) {
                        dispatch(addMessageToChat({ chatId: activeChatId, sender: "bot", message: response.aiResponse.content }));
                        if (activeChatTitle !== response.chat.title) {
                            dispatch(updateChatTitle({ chatId: activeChatId, title: response.chat.title }));
                        }
                    } else {
                        toast.error("something went wrong ", response.message);
                    }

                    if (isCall && response.audio) {
                        setAudio(new Audio("data:audio/mp3;base64," + response.audio));
                    }
                }
            } else {
                toast.warn("Message cannot be empty!", { position: "top-center" });
            }
        } catch (error) {
            console.log("Something went wrong!",error);
        }
    };

    useEffect(() => {
        if (audio) {
            audio.play().catch((err) => console.error("Audio play failed", err));
            audio.onended = () => {
                console.log("Audio playback ended");
            };
        }
    }, [audio]);

     // Handle message submission
     const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (activeChatId !== null) {
                dispatch(addMessageToChat({ chatId: activeChatId, sender: "user", message: input.trim() }));
                setInput("");
            } else{
                const result = await requestApi({
                    route: "/chats/",
                    method: requestMethods.POST,
                    body: {sender: "user", message: input.trim()},
                });
                if (result && result.chat){
                    dispatch(addChat(result.chat));
                    await dispatch(setActiveChat(result.chat._id));
                    activeChatId = result.chat._id;
                    setInput("");
                }else{
                    toast.error("something went wrong ", result.message);
                }
            }

            const data = {sender:"user", message: input.trim(), chatId: activeChatId};
            if (input.trim()) {
                dispatch(setBotResponding({ chatId: activeChatId, isResponding: true }));
                const response = await requestApi({
                    route: "/chats/handle",
                    method: requestMethods.POST,
                    body: data
                });
                dispatch(setBotResponding({ chatId: activeChatId, isResponding: false }));
                if (response){
                    if (activeChatId !== null){
                        dispatch(addMessageToChat({ chatId: activeChatId, sender: "bot", message: response.aiResponse.content }));
                        if (activeChatTitle !== response.chat.title){
                            dispatch(updateChatTitle({chatId: activeChatId, title: response.chat.title}))
                        }
                    }
                    else{
                        toast.error("something went wrong ", response.message);
                    }
                }
                setInput("");
            }
            else{
                toast.warn("Message cannot be empty!", { position: "top-center" });
            }
        } catch (error) {
            console.log("Something went wrong!",error);
        }
    };
    
    const formatTimestamp = (timestamp: Date | string): string => {
        const date = new Date(timestamp);  // Convert to Date object
        if (isNaN(date.getTime())) {
            return ""; 
        }
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return(
        <div className={`max-w-5xl flex flex-col font-poppins mx-auto ${collapsed ? " mx-20" : ""}`}>
            <ToastContainer className="text-xs" />
            <div className="flex gap-3 w-full">
                <div className="flex h-24 w-24 items-center justify-center rounded-full ml-2">
                    <img src={AIFriend} alt="AI Avatar" className="h-22 w-22" />
                </div>

                {/* Chatbot */}
                <div className="flex flex-col w-full items-center relative">
                        
                    {/* Chatbot Container */}
                    <Card className="h-[calc(100vh-9rem)] bg-[#CDE7FE] border-none shadow-none w-full mt-4">
                        <div className="max-h-[530px]  overflow-y-auto p-4 space-y-6">
                            {messages.length > 0 ? (
                                messages.map((message, index) => (
                                    <div className={`flex ${message.sender === "user" ? "justify-end items-end" : "justify-start items-start"}`}>
                                        <div className={`max-w-[70%] rounded-2xl p-3 ${message.sender === "user" ? "bg-[#3A8EBA] text-white" : "bg-white text-black"} overflow-hidden`}>
                                            <MessageComponent key={index} message={message.message} />
                                            <div className={`text-xs mt-1 text-left ${message.sender === "user" ? "text-gray-300" : "text-gray-500"}`}>
                                                {formatTimestamp(message.timestamp)}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 font-semibold font-comic text-lg">
                                    🗨️ Hey there! Start the conversation, and I’ll be happy to chat with you! 😊
                                </p>
                            )}
                            {/* Show preloader when bot is responding */}
                            {isBotResponding && (
                                <div className="flex justify-start">
                                    <div className=" bg-white text-black p-3 rounded-2xl">
                                        <div className="flex items-center justify-center w-full">
                                            <img src="/assets/images/preloader.gif" alt="loading..." className="w-16" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* Scroll target at the bottom */}
                            <div ref={messagesEndRef} />
                        </div>
                    </Card>
                    
                    {/* Messaging container */}
                    <form className="absolute -bottom-2 w-full bg-[#3A8EBA] rounded-3xl z-10 p-3 text-white">
                        <div className="relative flex items-center justify-center rounded-xl border-0">       
                            <div className="flex gap-2">
                                <label htmlFor="fileUpload" className="inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap text-nowrap border font-medium outline-none transition-all focus-visible:ring-2 focus-visible:ring-offset-1 [&>svg]:pointer-events-none [&>svg]:size-4 [&_svg]:shrink-0 px-3 text-sm has-[>kbd]:gap-2 has-[>svg]:px-2 has-[>kbd]:pr-[6px] rounded-full focus:bg-muted size-7 hover:bg-gray-100  hover:text-black">
                                    <input className="sr-only" id="fileUpload" multiple type="file" />
                                    <Paperclip className="h-5 w-5" />
                                    <span className="sr-only">Attach Files</span>
                                </label>
                            </div>                     
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask a follow-up…"
                                spellCheck="false"
                                className="resize-none overflow-auto w-full flex-1 bg-transparent p-4 pb-0 text-sm outline-none ring-0 placeholder:text-[#ffffff76]"
                                style={{
                                    height: "auto", 
                                    minHeight: "42px", 
                                    maxHeight: "200px", 
                                }}
                            />


                            <div className="ml-auto flex items-center gap-2">
                                <button
                                    className="inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap text-nowrap border font-medium outline-none transition-all focus-visible:ring-2 focus-visible:ring-offset-1 has-[:focus-visible]:ring-2 [&>svg]:pointer-events-none [&>svg]:size-5 [&_svg]:shrink-0 text-background border-white bg-white hover:border-[#eae9e9] focus:border-[#eae9e9] focus:bg-[#eae9e9] focus-visible:border-[#eae9e9] focus-visible:bg-[#eae9e9] px-3 text-sm rounded-full size-9 text-black hover:bg-[#eae9e9]"
                                    type="button"
                                    onClick={input.trim() ? handleSubmit : handleDialogOpen}
                                >
                                    {input.trim() ? (
                                        <Send className="h-5 w-5 text-black" />
                                    ) : (
                                        <Mic className="h-5 w-5 text-black" />
                                    )}
                                    <span className="sr-only">{input.trim() ? "Send Message" : "Voice Mode"}</span>
                                </button>
                            </div>

                        </div>
                    </form>
                    <VoiceDialog open={isDialogOpen} onOpenChange={setDialogOpen} onSendMessage={handleVoiceInput}/>

                </div>
            </div>
        </div>
    );
};

export default AIChatbot;


{/*
/ Chatbot 
<div className="flex flex-col w-full items-center relative">
                   
/* Tabs *
<Tabs value={activeTab} onValueChange={setActiveTab} className="w-[98%] h-full flex flex-col">
    <div className="flex justify-between items-center">
        <div className="flex items-center overflow-x-auto">
            <TabsList className="flex flex-nowrap space-x-2 bg-[#CDE7FE]">
                {Object.keys(messages).map((tab) => (
                    <TabsTrigger key={tab} value={tab} className="shrink-0">
                        {tab}
                    </TabsTrigger>
                ))}
            </TabsList>
        </div>

        <div>
            <button
                onClick={addNewTab}
                className="ml-2 p-2 rounded-full hover:bg-gray-100"
                aria-label="Add new tab"
            >
                <Plus className="h-4 w-4" />
            </button>

            <button
                className="ml-2 p-2 rounded-full hover:bg-gray-100"
                aria-label="Share chat tab"
            >
                <Share className="h-4 w-4" />
            </button>
        </div>
    </div>
    
    {/* Chatbot Container 
    <Card className="h-[calc(100vh-11rem)] bg-[#CDE7FE] border-none shadow-none w-full mt-4">
    {Object.keys(messages).map((tab) => (
        <TabsContent key={tab} value={tab} className="h-full m-0">
            <div className="h-full overflow-y-auto p-4 space-y-6">
                {messages[tab].map((message) => (
                <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    <div
                    className={`max-w-[70%] rounded-2xl p-3 ${
                        message.sender === 'user'
                        /? 'bg-[#0D358C] text-white'
                        : 'bg-white text-black'
                    }`}
                    >
                    <div className="text-sm">{message.content}</div>
                    <div className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                        {formatTimestamp(message.timestamp)}
                    </div>
                    </div>
                </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
        </TabsContent>
    ))}
    </Card>
</Tabs>

*/}