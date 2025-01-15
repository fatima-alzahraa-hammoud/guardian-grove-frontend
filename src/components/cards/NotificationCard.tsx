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
        <div
            className={`p-4 rounded-lg shadow-md ${categoryColors[notification.category]} w-48 max-w-sm`}
        >
            <h3 className="font-bold text-lg">{notification.title}</h3>
            <p className="text-sm mt-2">{notification.message}</p>
            <p className="text-xs mt-4 text-gray-600">
                {new Date(notification.timestamp).toLocaleString()}
            </p>
        </div>
    );
};

export default NotificationCard;