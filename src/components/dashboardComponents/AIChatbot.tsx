import React from "react";
import AIFriend from "/assets/images/ai-friend.png";

const AIChatbot : React.FC  = () => {
    
    return(
        <div className="max-w-5xl h-screen flex flex-col font-poppins">
             <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sky-100">
                <img
                    src={AIFriend}
                    alt="AI Avatar"
                    className="h-16 w-16"
                />
            </div>
        </div>
    );
};

export default AIChatbot;