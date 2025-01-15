import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import sortImage from "/assets/images/sort.png";
import magicImage from "/assets/images/magic-wand.png";
import { requestApi } from "../../libs/requestApi";
import { requestMethods } from "../../libs/enum/requestMethods";
import { useSelector } from "react-redux";
import { selectUserId } from "../../redux/slices/userSlice";
import { toast } from "react-toastify";
import GoalCard from "../cards/GoalCard";
import TasksDialog from "../common/TasksDialog";
import Adventures from "./Adventures";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../styles/calendar.css";
import { Value } from "react-calendar/dist/esm/shared/types.js";

interface FamilyTreeProps {
    collapsed: boolean;
}

interface Goal {
    _id: string;
    title: string;
    type: string;
    description: string;
    nbOfTasksCompleted: number;
    tasks: { _id: string; title: string; completed: boolean }[];
    dueDate: Date;
    rewards: {
      stars: number;
      coins: number;
      achievementName?: string;
    };
    isCompleted: boolean;
}

interface Adventure {
    date: string;
    title: string;
    description: string;
    challenges: string[];
}

const GoalsAndAdventures : React.FC<FamilyTreeProps> = ({collapsed}) => {

    const filters = ["Goals", "Adventures"];
    const [activeFilter, setActiveFilter] = useState<string>("Goals");

    const userId = useSelector(selectUserId);

    const [goals, setGoals] = useState<Goal[]>([]);
    const [adventures, setAdventures] = useState<Adventure[]>([]);
    const [selectedAdventures, setSelectedAdventures] = useState<Adventure | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // Default to today's date

    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleViewTasks = (goal: Goal) => {
        setSelectedGoal(goal); // Set the selected goal
        setDialogOpen(true); // Open the dialog
    };

    useEffect(() => {
        fetchgoals();
    }, []);

    useEffect(() => {
        fetchAdventures();
    }, []);

    const fetchgoals = async () => {
        try {
            const response = await requestApi({
                route: "/userGoals/goals",
                method: requestMethods.POST,
                body: {userId}
            });

            if (response && response.goals){
                setGoals(response.goals);
                console.log(response.goals);
            }else{
                toast.error("Failed to get goals", response.message)
            }
        } catch (error) {
            console.log("Something wents wrong", error);
        }
    };

    const fetchAdventures = async() => {
        try {
            const response = await requestApi({
                route: "/adventures/",
                method: requestMethods.GET
            });

            if (response && response.adventures){
                setAdventures(response.adventures);
                console.log(response.adventures);
            }
            else{
                toast.error("Failed to retrieve adventures", response.message);
            }
        } catch (error) {
            console.log("Something wents wrong", error);
        }
    };

    const handleDateChange = (date: Value) => {
        if (date instanceof Date) {
            console.log("Selected Date:", date);
            setSelectedDate(date); 
        } else {
            console.error("Invalid date selected:", date)
        }
    };

    return(
        <div className={`pt-24 min-h-screen flex flex-col items-center`}>
            <div className={`w-full flex-grow font-poppins ${ collapsed ? "mx-auto max-w-6xl" : "max-w-5xl" }`} >
                <div className="flex justify-between w-full">
                    <div className="w-full">
                        {/* Header */}
                        <div className="text-left">
                            <h2 className="text-xl font-bold font-comic">
                                {activeFilter === "Goals"?  "Conquer Goals, Embark on Adventures" : "Adventure Awaits!"}
                            </h2>
                            <p className="text-gray-600 mt-2 text-base">
                                {activeFilter === "Goals"?  "Experience exciting adventures, accomplish meaningful goals, and rise to thrilling challenges together!" : "Take on exciting challenges and achieve your dreams together!"}
                            </p>
                        </div>

                        {/* Filters and Buttons */}
                        <div className="flex items-center justify-between mt-10">
                            {/* Filters Section */}
                            <div className="flex flex-wrap gap-3">
                                {filters.map((filter) => (
                                    <Button
                                        key={filter}
                                        onClick={() => setActiveFilter(filter)}
                                        variant="secondary"
                                        className={cn(
                                            "bg-[#E3F2FD] hover:bg-[#d7edfd] w-36 text-black",
                                            activeFilter === filter && "bg-[#3A8EBA] text-white hover:bg-[#347ea5]"
                                        )}
                                    >
                                        {filter}
                                    </Button>
                                ))}
                            </div>

                            {activeFilter === "Goals" ? (
                                /* Sort Button */
                                <div className="flex items-center space-x-3">
                                    <Button className="flex items-center bg-[#F09C14] px-3 py-2 rounded-full hover:bg-[#EB9915] transition">
                                        <img src={sortImage} alt="Sort" className="w-4 h-4 mr-1" />
                                        <span className="text-sm font-semibold text-white">Sort</span>
                                    </Button>
                                    <Button className="flex items-center bg-[#179447] px-3 py-2 rounded-full hover:bg-[#158C43] transition">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus text-white">
                                            <path d="M5 12h14"/><path d="M12 5v14"/>
                                        </svg>                            
                                        <span className="text-sm font-semibold text-white">Add Goal</span>
                                    </Button>
                                    <Button className="flex items-center bg-[#3A8EBA] px-3 py-2 rounded-full hover:bg-[#326E9F] transition">
                                        <img src={magicImage} alt="Sort" className="w-4 h-4 mr-1" />
                                        <span className="text-sm font-semibold text-white">Generate Goal</span>
                                    </Button>
                                </div>
                            ) : (
                                <div></div>
                            )}
                        </div>
                    </div>
                    {activeFilter === "Adventures" && (
                        <div className="flex justify-center mb-6">
                        <Calendar
                            onChange={(date) => handleDateChange(date)}
                            value={selectedDate}
                            className=" shadow-lg rounded-lg bg-white p-4 border border-gray-200 custom-calendar"
                        />
                        </div>
                    )}
                </div>

                {activeFilter === "Goals" ? (
                    <div className="mt-8">
                        {/* In Progress Goals */}
                        {goals.some(goal => !goal.isCompleted) && (
                            <div className="mt-10">
                                <h2 className="text-lg font-semibold mb-4">In Progress</h2>
                                <div className="flex overflow-x-auto gap-6 scroll-smooth hide-scrollbar relative px-12">
                                    {goals.filter(goal => !goal.isCompleted).map((goal) => (
                                        <GoalCard key={goal._id} goal={goal} onViewTasks={() => {handleViewTasks(goal)}} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Completed Goals */}
                        {goals.some(goal => goal.isCompleted) && (
                            <div className="mt-10 mb-3">
                                <h2 className="text-lg font-semibold mb-4">Completed</h2>
                                <div className="flex overflow-x-auto gap-6 scroll-smooth hide-scrollbar relative px-12">
                                    {goals.filter(goal => goal.isCompleted).map((goal) => (
                                        <GoalCard key={goal._id} goal={goal} onViewTasks={() => {handleViewTasks(goal)}} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* If no goals */}
                        {goals.length === 0 && (
                            <div className="text-center text-gray-600 mt-8">No goals available</div>
                        )}

                        {/* Dialog for Viewing Tasks */}
                        <TasksDialog
                            goal={selectedGoal}
                            open={dialogOpen}
                            onOpenChange={setDialogOpen}
                        />
                    </div>
                ) : (
                    <Adventures />
                )}
            </div>
        </div>
    );
};

export default GoalsAndAdventures;