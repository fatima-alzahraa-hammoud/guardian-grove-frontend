import React, { useEffect, useRef, useState } from "react";
import AIFriend from "/assets/images/ai-friend.png";
import { Card } from "../ui/card";
import { Mic, Paperclip, Plus, Send, Share } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface Message {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}
  
interface TabMessages {
    [key: string]: Message[];
}

const AIChatbot : React.FC  = () => {

    const [input, setInput] = useState<string>("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<TabMessages>({
        "Tab 1": [
            {
                id: "1",
                content: "Hello! How can I help you today?",
                sender: 'ai',
                timestamp: new Date()
            },
            {
                id: "2",
                content: "I am your friendly assistant.",
                sender: 'ai',
                timestamp: new Date()
            }
        ],
        "Tab 2": [
            {
                id: "3",
                content: "Welcome to the second tab.",
                sender: 'ai',
                timestamp: new Date()
            }
        ]
    });
      
    const [activeTab, setActiveTab] = useState<string>("Tab 1");
    
    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
     

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
        }
    }, [input]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            const newMessage: Message = {
                id: Date.now().toString(),
                content: input.trim(),
                sender: 'user',
                timestamp: new Date()
            };
    
            setMessages((prevMessages) => ({
                ...prevMessages,
                [activeTab]: [...(prevMessages[activeTab] || []), newMessage]
            }));
            setInput("");
        }
    };

    const addNewTab = () => {
        const newTabName = `Tab ${Object.keys(messages).length + 1}`;
        setMessages((prevMessages) => ({
          ...prevMessages,
          [newTabName]: [{
            id: Date.now().toString(),
            content: `Welcome to ${newTabName}!`,
            sender: 'ai',
            timestamp: new Date()
          }]
        }));
        setActiveTab(newTabName);
    };
    
    const formatTimestamp = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleVoiceMode = () => {
        // Handle the voice mode action here
        console.log("Voice mode activated");
    };

    return(
        <div className="max-w-5xl flex flex-col font-poppins">
            <div className="flex gap-3 w-full">
                <div className="flex h-24 w-24 items-center justify-center rounded-full ">
                    <img src={AIFriend} alt="AI Avatar" className="h-22 w-22" />
                </div>

                {/* Chatbot */}
                <div className="flex flex-col w-full items-center relative">
                   
                    {/* Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[98%] h-full flex flex-col">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center w-[30%] overflow-x-auto">
                                <TabsList className="flex-grow ">
                                    {Object.keys(messages).map((tab) => (
                                        <TabsTrigger key={tab} value={tab} className="flex-1">
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
                        
                        {/* Chatbot Container */}
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
                                        ? 'bg-[#0D358C] text-white'
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
                    
                    {/* Messaging container */}
                    <form onSubmit={handleSubmit} className="absolute bottom-0 w-full bg-[#0D358C] rounded-3xl z-10 p-3 text-white">
                        <div className="relative flex [&_textarea]:relative [&_textarea]:z-10 [&_textarea]:bg-transparent rounded-xl border-0">
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask a follow up…"
                                spellCheck="false"
                                className="resize-none overflow-auto w-full flex-1 bg-transparent p-3 pb-0 text-sm outline-none ring-0 placeholder:text-[#ffffff76]"
                                style={{
                                    height: '58px',
                                    minHeight: '42px',
                                    maxHeight: '384px'
                                }}
                            />
                            <div className="absolute inset-0 inline overflow-auto whitespace-pre-wrap break-words border border-transparent text-sm pointer-events-none -translate-x-px -translate-y-px p-3 pb-1.5" aria-hidden="true">
                                <span className="data-[slot=mention]:*:bg-teal-100"></span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 p-3 pt-0 pb-0">
                            <div className="flex gap-2">
                                <label htmlFor="fileUpload" className="inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap text-nowrap border font-medium outline-none transition-all focus-visible:ring-2 focus-visible:ring-offset-1 [&>svg]:pointer-events-none [&>svg]:size-4 [&_svg]:shrink-0 px-3 text-sm has-[>kbd]:gap-2 has-[>svg]:px-2 has-[>kbd]:pr-[6px] rounded-full focus:bg-muted size-7 hover:bg-gray-100  hover:text-black">
                                    <input className="sr-only" id="fileUpload" multiple type="file" />
                                    <Paperclip className="h-5 w-5" />
                                    <span className="sr-only">Attach Files</span>
                                </label>
                            </div>
                            <div className="ml-auto flex items-center gap-2">
                                <button
                                    className="inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap text-nowrap border font-medium outline-none transition-all focus-visible:ring-2 focus-visible:ring-offset-1 has-[:focus-visible]:ring-2 [&>svg]:pointer-events-none [&>svg]:size-5 [&_svg]:shrink-0 text-background border-white bg-white hover:border-[#eae9e9] focus:border-[#eae9e9] focus:bg-[#eae9e9] focus-visible:border-[#eae9e9] focus-visible:bg-[#eae9e9] px-3 text-sm rounded-full size-9 text-black hover:bg-[#eae9e9]"
                                    type="submit"
                                >
                                {input.trim() ? (
                                    <Send className="h-5 w-5 text-black" />
                                ) : (
                                    <Mic className="h-5 w-5 text-black" onClick={handleVoiceMode} />
                                )}
                                <span className="sr-only">{input.trim() ? "Send Message" : "Voice Mode"}</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AIChatbot;