import React from "react";

interface AINotificationsProps {
    collapsed: boolean;
}

const AINotifications : React.FC <AINotificationsProps> = ({collapsed}) => {
    return(
        <div className={`pt-24 min-h-screen flex flex-col items-center`}>
            <div className={`w-full flex-grow font-poppins ${ collapsed ? "mx-auto max-w-6xl" : "max-w-5xl" }`} >
                {/* Header */}
                <div className="text-left">
                    <h2 className="text-xl font-bold font-comic">
                        Stay Informed with Smart AI Insights
                    </h2>
                    <p className="text-gray-600 mt-2 text-base w-[75%]">
                        Your AI companion provides personalized tips and timely alerts to help you and your family stay safe, motivated, and connected.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AINotifications;