import React, { useCallback, useEffect, useState } from "react";
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
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import AddGoalDialog from "../common/AddGoalDialog";
import { Goal } from "../../libs/types/Goal";
import { Adventure } from "../../libs/types/Adventure";

interface GoalsAndAdventuresProps {
    collapsed: boolean;
}

const GoalsAndAdventures : React.FC<GoalsAndAdventuresProps> = ({collapsed}) => {

    const filters = ["Goals", "Adventures"];
    const [activeFilter, setActiveFilter] = useState<string>("Goals");

    const userId = useSelector(selectUserId);

    const [goals, setGoals] = useState<Goal[]>([]);
    const [adventures, setAdventures] = useState<Adventure[]>([]);
    const [selectedAdventure, setSelectedAdventure] = useState<Adventure | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // Default to today's date

    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [addGoalDialogOpen, setAddGoalDialogOpen] = useState(false);

    // Add this function to handle new goal creation
    const handleGoalCreated = (newGoal: Goal) => {
        setGoals(prevGoals => [...prevGoals, newGoal]);
    };


    const handleViewTasks = (goal: Goal) => {
        setSelectedGoal(goal); // Set the selected goal
        setDialogOpen(true); // Open the dialog
    };

    // Add this function to handle goal updates
    const handleGoalUpdate = (updatedGoal: Goal) => {
        setGoals(prevGoals => 
            prevGoals.map(goal => 
                goal._id === updatedGoal._id ? updatedGoal : goal
            )
        );
        // Also update the selected goal to reflect changes in the dialog
        setSelectedGoal(updatedGoal);
    };

    const fetchgoals = useCallback(async () => {
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
    }, [userId]); 

    const fetchAdventures = useCallback(async() => {
        try {
            const response = await requestApi({
                route: "/adventures/",
                method: requestMethods.GET
            });

            if (response && response.adventures){
                setAdventures(response.adventures);
                const todaysAdventure = findTodaysAdventure(response.adventures);
                setSelectedAdventure(todaysAdventure);
            }
            else{
                toast.error("Failed to retrieve adventures", response.message);
            }
        } catch (error) {
            console.log("Something wents wrong", error);
        }
    }, []);

    useEffect(() => {
        fetchgoals();
    }, [fetchgoals]);

    useEffect(() => {
        fetchAdventures();
    }, [fetchAdventures]);


    const findTodaysAdventure = (adventuresList: Adventure[]) => {
        const today = new Date();
        return adventuresList.find((adventure) => {
            const adventureDate = new Date(adventure.startDate);
            return adventureDate.toDateString() === today.toDateString();
        }) || null;
    };

    const handleDateChange = (date: Value) => {
        if (date instanceof Date) {
            setSelectedDate(date); 

            // Filter adventures based on the selected date
            const filteredAdventures = adventures.filter((adventure) => {
                const adventureDate = new Date(adventure.startDate);
                return adventureDate.toDateString() === date.toDateString(); // Match by date
            });

            // Set the first adventure if there's a match, otherwise null
            if (filteredAdventures.length > 0) {
                setSelectedAdventure(filteredAdventures[0]);
            } else {
                setSelectedAdventure(null);
            }
        } else {
            console.error("Invalid date selected:", date)
        }
    };

    const handleGenerateTasks = async () => {
        try {
            console.log("hello");

            const response = await requestApi({
                route: "/users/generateGoals",
                method: requestMethods.POST,
                body: {userId}
            });

            if (response && response.goal){
                setGoals((prevGoals) => [...prevGoals, response.goal]);
            }
            else{
                toast.error("Failed to generate goal", response.message);
            }
        } catch (error) {
            console.log("Something wents wrong", error);
        }
    }

    return(
        <div className={`pt-24 min-h-screen flex flex-col items-center`}>
            <div className={`w-full flex-grow font-poppins mx-auto ${ collapsed ? " max-w-6xl" : "max-w-5xl" }`} >
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
                                    <Button 
                                        onClick={() => setAddGoalDialogOpen(true)}
                                        className="flex items-center bg-[#179447] px-3 py-2 rounded-full hover:bg-[#158C43] transition"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus text-white">
                                            <path d="M5 12h14"/><path d="M12 5v14"/>
                                        </svg>                            
                                        <span className="text-sm font-semibold text-white">Add Goal</span>
                                    </Button>
                                    <Button
                                        onClick={handleGenerateTasks}
                                        className="flex items-center bg-[#3A8EBA] px-3 py-2 rounded-full hover:bg-[#326E9F] transition"
                                    >
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
                        <div className="flex justify-center mb-6 border-[1px] border-[#3A8EBA]">
                        <Calendar
                            onChange={(date) => handleDateChange(date)}
                            value={selectedDate}
                            className="rounded-lg bg-white p-4  border-gray-200 custom-calendar border-[2px]"
                        />
                        </div>
                    )}
                </div>


                {activeFilter === "Goals" ? (
                    <div className="mt-8 mb-5">
                        {/* In Progress Goals */}
                        {goals.some(goal => !goal.isCompleted) && (
                            <div className="mt-10">
                                <h2 className="text-lg font-semibold mb-4">In Progress</h2>
                                <div className="flex overflow-x-auto gap-6 scroll-smooth hide-scrollbar relative px-12">
                                    <Carousel className="w-full mt-5">
                                        <CarouselContent className="flex gap-5">
                                            {goals.filter(goal => !goal.isCompleted).map((goal) => (
                                                <CarouselItem key={goal._id} className="basis-[300px] h-[400px]">
                                                    <GoalCard key={goal._id} goal={goal} onViewTasks={() => {handleViewTasks(goal)}} classname="h-full" />
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                        <CarouselPrevious className="w-5 h-5" />
                                        <CarouselNext className="w-5 h-5" />
                                    </Carousel>
                                </div>
                            </div>
                        )}

                        {/* Completed Goals */}
                        {goals.some(goal => goal.isCompleted) && (
                            <div className="mt-10 mb-3">
                                <h2 className="text-lg font-semibold mb-4">Completed</h2>
                                <div className="flex relative px-12">
                                    <Carousel className="w-full mt-5">
                                        <CarouselContent className="flex gap-5">
                                            {goals.filter(goal => goal.isCompleted).map((goal, index) => (
                                                <CarouselItem key={goal._id} className="basis-[300px] h-[400px]">
                                                    <GoalCard key={goal._id || index} goal={goal} onViewTasks={() => {handleViewTasks(goal)}} classname="h-full"/>
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                        <CarouselPrevious className="w-5 h-5" />
                                        <CarouselNext className="w-5 h-5" />
                                    </Carousel>
                                </div>
                            </div>
                        )}

                        {/* If no goals */}
                        {goals.length === 0 && (
                            <div className="text-center text-gray-600 mt-8">No goals available</div>
                        )}

                        {/* Dialog for Viewing Tasks - Add onGoalUpdate prop */}
                        <TasksDialog
                            goal={selectedGoal}
                            open={dialogOpen}
                            onOpenChange={setDialogOpen}
                            onGoalUpdate={handleGoalUpdate}
                        />
                    </div>
                ) : (
                    <Adventures adventure={selectedAdventure}/>
                )}
            </div>

            <AddGoalDialog
                open={addGoalDialogOpen}
                onOpenChange={setAddGoalDialogOpen}
                onGoalCreated={handleGoalCreated}
            />
        </div>
    );
};

export default GoalsAndAdventures;