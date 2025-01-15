import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectRole } from "../../redux/slices/userSlice";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { requestApi } from "../../libs/requestApi";
import { requestMethods } from "../../libs/enum/requestMethods";
import { toast } from "react-toastify";

interface AINotificationsProps {
    collapsed: boolean;
}

const AINotifications : React.FC <AINotificationsProps> = ({collapsed}) => {

    const role = useSelector(selectRole);
    const filters = role === "parent" ?  ['Tips & Suggestions', 'Alerts & Notifications', 'Children’s Notify & Tips'] : ['Tips & Suggestions', 'Alerts & Notifications'];
    const [activeFilter, setActiveFilter] = useState<string>("Tips & Suggestions");
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async() => {
        try {
            const response = await requestApi({
                route: "/userNotifications/",
                method: requestMethods.GET
            });

            if (response && response.notifications){
                setNotifications(response.notifications);
                console.log(response.notifications);
            }
            else{
                toast.error("Failed to retrieve notifications", response.message);
            }
        } catch (error) {
            console.log("Something wents wrong", error);
        }
    };

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

                {/* Filters Section */}
                <div className="flex flex-wrap gap-3 mt-10">
                    {filters.map((filter) => (
                        <Button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            variant="secondary"
                            className={cn(
                                "bg-[#E3F2FD] hover:bg-[#d7edfd] w-52 text-black",
                                activeFilter === filter && "bg-[#3A8EBA] text-white hover:bg-[#347ea5]"
                            )}
                        >
                            {filter}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AINotifications;