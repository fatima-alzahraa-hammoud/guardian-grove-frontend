import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectRole } from "../../redux/slices/userSlice";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { requestApi } from "../../libs/requestApi";
import { requestMethods } from "../../libs/enum/requestMethods";
import { toast } from "react-toastify";
import NotificationCard from "../cards/NotificationCard";

interface AINotificationsProps {
    collapsed: boolean;
}

interface Notification {
    title: string;
    type: "personal" | "family";
    category: "tip" | "alert" | "suggestion" | "notification";
    message: string;
    timestamp: Date;
}

const AINotifications: React.FC<AINotificationsProps> = ({ collapsed }) => {
    const role = useSelector(selectRole);
    const filters = role === "parent" ? ["Tips & Suggestions", "Alerts & Notifications", "Children’s Notify & Tips"] : ["Tips & Suggestions", "Alerts & Notifications"];
    const [activeFilter, setActiveFilter] = useState<string>("Tips & Suggestions");
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await requestApi({
                route: "/userNotifications/",
                method: requestMethods.GET,
            });

            if (response && response.notifications) {
                setNotifications(response.notifications);
                console.log(response.notifications);
            } else {
                toast.error("Failed to retrieve notifications", response.message);
            }
        } catch (error) {
            console.log("Something went wrong", error);
        }
    };

    // Group notifications by time range
    const today = new Date();
    const oneDayAgo = new Date(today);
    oneDayAgo.setDate(today.getDate() - 1);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const groupedNotifications = {
        today: notifications.filter((n) => new Date(n.timestamp) >= oneDayAgo),
        last7Days: notifications.filter(
            (n) =>
                new Date(n.timestamp) < oneDayAgo &&
                new Date(n.timestamp) >= sevenDaysAgo
        ),
        old: notifications.filter((n) => new Date(n.timestamp) < sevenDaysAgo),
    };

    // Filter notifications based on active filter
    const filteredNotifications = (category: "today" | "last7Days" | "old") => {
        const filtered = groupedNotifications[category].filter((notification) => {
            if (activeFilter === "Tips & Suggestions") {
                return (
                    notification.category === "tip" ||
                    notification.category === "suggestion"
                );
            }
            if (activeFilter === "Alerts & Notifications") {
                return (
                    notification.category === "alert" ||
                    notification.category === "notification"
                );
            }
            return true;
        });

        return filtered;
    };

    return (
        <div className={`pt-24 min-h-screen flex flex-col items-center`}>
            <div
                className={`w-full flex-grow font-poppins ${
                    collapsed ? "mx-auto max-w-6xl" : "max-w-5xl"
                }`}
            >
                {/* Header */}
                <div className="text-left">
                    <h2 className="text-xl font-bold font-comic">
                        Stay Informed with Smart AI Insights
                    </h2>
                    <p className="text-gray-600 mt-2 text-base w-[75%]">
                        Your AI companion provides personalized tips and timely alerts to
                        help you and your family stay safe, motivated, and connected.
                    </p>
                </div>

                {/* Filters Section */}
                <div className="flex flex-wrap gap-3 mt-10">
                    {filters.map((filter) => (
                        <Button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            variant="secondary"
                            className={cn(
                                "bg-[#E3F2FD] hover:bg-[#d7edfd] w-52 text-black",
                                activeFilter === filter &&
                                    "bg-[#3A8EBA] text-white hover:bg-[#347ea5]"
                            )}
                        >
                            {filter}
                        </Button>
                    ))}
                </div>

                {/* Notifications Sections */}
                {(["today", "last7Days", "old"] as const).map((category) => {
                    const notificationsList = filteredNotifications(category);
                    if (notificationsList.length === 0) {
                        return null; // Skip if no notifications in this category
                    }

                    return (
                        <div key={category} className="mt-10">
                            <h3 className="text-lg font-bold font-comic capitalize">
                                {category === "today"
                                    ? "Today"
                                    : category === "last7Days"
                                    ? "Previous 7 Days"
                                    : "Old"}
                            </h3>
                            <div className="flex flex-wrap gap-5 mt-5">
                                {notificationsList.map((notification, idx) => (
                                    <NotificationCard key={idx} notification={notification}/>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AINotifications;
