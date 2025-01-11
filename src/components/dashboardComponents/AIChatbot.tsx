import React from "react";
import AIFriend from "/assets/images/ai-friend.png";
import { Card } from "../ui/card";

const AIChatbot : React.FC  = () => {

    return(
        <div className="max-w-5xl flex flex-col font-poppins">
            <div className="flex gap-3 w-full">
                <div className="flex h-24 w-24 items-center justify-center rounded-full ">
                <img src={AIFriend} alt="AI Avatar" className="h-22 w-22" />
                </div>

                <Card className="h-[calc(100vh-16rem)] bg-[#CDE7FE] border-none shadow-none w-full mt-10">
                    <div
                        className="h-full overflow-y-auto p-4 space-y-6"
                    > 
                </div>
                </Card>
            </div>
        </div>
    );
};

export default AIChatbot;