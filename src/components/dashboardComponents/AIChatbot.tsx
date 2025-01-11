import React, { useEffect, useRef, useState } from "react";
import AIFriend from "/assets/images/ai-friend.png";
import { Card } from "../ui/card";

const AIChatbot : React.FC  = () => {

    const [input, setInput] = useState<string>("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
        }
    }, [input]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            setMessages([...messages, input.trim()]);
            setInput("");
        }
    };

    return(
        <div className="max-w-5xl flex flex-col font-poppins">
            <div className="flex gap-3 w-full">
                <div className="flex h-24 w-24 items-center justify-center rounded-full ">
                    <img src={AIFriend} alt="AI Avatar" className="h-22 w-22" />
                </div>

                {/* Chatbot */}
                <div className="flex flex-col w-full items-center relative">

                    {/* Chatbot Container */}
                    <Card className="h-[calc(100vh-10rem)] bg-[#CDE7FE] border-none shadow-none w-[98%] mt-10">
                        <div className="h-full overflow-y-auto p-4 space-y-6"></div>
                    </Card>

                    {/* Messaging container */}

                </div>
            </div>
        </div>
    );
};

export default AIChatbot;