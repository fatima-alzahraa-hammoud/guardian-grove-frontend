import React from "react";

interface Notification {
    title: string;
    type: 'personal' | 'family';
    category: 'tip' | 'alert' | 'suggestion' | 'notification';
    message: string;
    timestamp: Date;
}

interface NotificationProp{
    notification : Notification;
}

const NotificationCard : React.FC<NotificationProp> = ({notification}) => {

    // Color mapping based on category
    const categoryColors: Record<string, string> = {
        tip: "bg-[#E3F2FD] text-blue-800",
        alert: "bg-red-100 text-red-800",
        suggestion: "bg-[#FDE3EC] text-pink-800",
        notification: "bg-[#D0F4F0] text-green-800",
    };

    return(
        <div className={`p-4 rounded-lg shadow-md font-poppins h-[200px] flex flex-col justify-between ${categoryColors[notification.category]} w-full max-w-sm`}>
            <div>
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-base">{notification.title}</h3>
                    <p className="text-xs text-gray-500">{notification.category}</p>
                </div>
                <p className="text-sm pt-8 line-clamp-4">{notification.message}</p>
            </div>
            <p className="text-xs text-gray-600 mt-auto">
                {new Date(notification.timestamp).toLocaleString()}
            </p>
        </div>
    );
};

export default NotificationCard;