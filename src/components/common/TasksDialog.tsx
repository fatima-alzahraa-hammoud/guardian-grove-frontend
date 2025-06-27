import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Coins, Star } from "lucide-react";
import { requestApi } from "../../libs/requestApi";
import { requestMethods } from "../../libs/enum/requestMethods";
import { useDispatch, useSelector } from "react-redux";
import { selectUserId, setCoins, setStars } from "../../redux/slices/userSlice";

interface Task {
    _id: string;
    title: string;
    isCompleted: boolean;
    description: string;
    rewards: {
        stars: number;
        coins: number;
    };
}

interface Goal {
    _id: string;
    title: string;
    type: string;
    description: string;
    nbOfTasksCompleted: number;
    tasks: Task[];
    dueDate: Date;
    rewards: {
        stars: number;
        coins: number;
        achievementName?: string;
    };
    isCompleted: boolean;
}

interface TasksDialogProps {
    goal: Goal | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const TasksDialog : React.FC<TasksDialogProps> = ({goal, open, onOpenChange}) => {
    const userId = useSelector(selectUserId);
    const dispatch = useDispatch();

    const [showAiPopup, setShowAiPopup] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
    const [aiQuestion, setAiQuestion] = useState<string>("What did you learn from completing this task?");
    const [userAnswer, setUserAnswer] = useState<string>("");
    const [aiResponse, setAiResponse] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset AI popup state when it closes
    useEffect(() => {
        if (!showAiPopup) {
            setUserAnswer("");
            setAiResponse("");
            setAiQuestion("What did you learn from completing this task?");
            setSelectedTask(null);
            setSelectedGoal(null);
            setIsSubmitting(false);
        }
    }, [showAiPopup]);

    // Reset states when main dialog closes
    useEffect(() => {
        if (!open) {
            setShowAiPopup(false);
            setUserAnswer("");
            setAiResponse("");
            setAiQuestion("What did you learn from completing this task?");
            setSelectedTask(null);
            setSelectedGoal(null);
            setIsSubmitting(false);
        }
    }, [open]);

    if (!goal) return null;

    const handleDoItClick = async (task: Task, goal: Goal) => {
        // Reset previous state
        setUserAnswer("");
        setAiResponse("");
        setIsSubmitting(false);
        
        setSelectedTask(task);
        setSelectedGoal(goal);
        
        try {
            const response = await requestApi({
                route: "/users/generateQusetion",
                method: requestMethods.POST,
                body: {userId, taskDescription: task.description}
            });

            if (response && response.question){
                setAiQuestion(response.question);
                setShowAiPopup(true);
            } else {
                console.log("something went wrong", response.message);
            }
        } catch (error) {
            console.log("something went wrong", error);
        }
    };

    const handleAiSubmit = async() => {
        if (!userAnswer.trim() || isSubmitting) return;
        
        setIsSubmitting(true);
        setAiResponse(""); // Clear previous response
        
        try {
            const response = await requestApi({
                route: "/users/checkAnswer",
                method: requestMethods.POST,
                body: {
                    userId, 
                    question: aiQuestion, 
                    userAnswer: userAnswer.trim()
                }
            });
            
            if (response && response.questionAnswered){
                setAiResponse("Good Job! 😊");

                const result = await requestApi({
                    route: "/userGoals/taskDone",
                    method: requestMethods.POST,
                    body: {userId, goalId: selectedGoal?._id, taskId: selectedTask?._id}
                });
                
                if(result && result.task && result.goal){
                    dispatch(setStars(result.task.rewards.stars));
                    dispatch(setCoins(result.task.rewards.coins));
                    
                    if (selectedTask) {
                        selectedTask.isCompleted = true;
                    }
                    
                    if (result.goal.isCompleted){
                        if (selectedGoal) {
                            selectedGoal.isCompleted = true;
                        }
                        dispatch(setStars(result.goal.rewards.stars));
                        dispatch(setCoins(result.goal.rewards.coins));
                    }
                    
                    // Close AI popup after successful completion
                    setTimeout(() => {
                        setShowAiPopup(false);
                    }, 2000);
                }
            } else {
                setAiResponse("Oops! Try again.. 😮‍💨");
                console.log("wrong answer", response.message);
            }
        } catch (error) {
            console.log("something went wrong", error);
            setAiResponse("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAiPopupClose = (open: boolean) => {
        setShowAiPopup(open);
        if (!open) {
            // Reset all AI-related state when closing
            setUserAnswer("");
            setAiResponse("");
            setSelectedTask(null);
            setSelectedGoal(null);
            setIsSubmitting(false);
        }
    };

    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl p-10">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between font-comic text-lg">
                        <div>
                            <span className=" font-bold">Goal: </span>
                            <span className="font-semibold">{goal.title}</span>
                        </div>

                        <div>
                            <span className="font-semibold">Total Tasks: </span>
                            <span className="font-medium">{goal.tasks.length}</span>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="mt-2">
                    {/* Rewards section */}
                    <div className="mb-6 font-comic">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">Total Stars:</span>
                                    <span>{goal.rewards.stars}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">Total Coins:</span>
                                    <span>{goal.rewards.coins}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">Badge Reward:</span>
                                <span>{goal.rewards.achievementName}</span>
                            </div>
                        </div>
                    </div>

                    {/*Tasks section*/}
                    <div className="space-y-4 font-poppins">
                        <h3 className="font-semibold text-lg font-comic">Tasks</h3>
                        {goal.tasks.map((task, index) => (
                            <div
                                key={task._id}
                                className="flex items-center justify-between p-4 bg-[#CDE7FE] rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 flex items-center justify-center bg-[#3A8EBA] text-white rounded-full">
                                        {index + 1}
                                    </span>
                                    <p className="flex flex-col">
                                        <span>{task.title}</span>
                                        <span className="text-xs">{task.description}</span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-5">
                                    <div className="flex items-center gap-2">
                                        <Star className="w-4 h-4 text-yellow-500" />
                                        <span>{task.rewards.stars}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Coins className="w-4 h-4 text-yellow-500" />
                                        <span>{task.rewards.coins}</span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="text-xs"
                                        disabled={task.isCompleted}
                                        onClick={() => handleDoItClick(task, goal)}
                                    >
                                        {task.isCompleted ? "Done!" : "Do it"}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
            
            {/* AI Popup for Task Completion */}
            {showAiPopup && selectedTask && (
                <Dialog open={showAiPopup} onOpenChange={handleAiPopupClose}>
                    <DialogContent className="max-w-md p-6 text-center">
                        <DialogHeader className="text-center">
                            <DialogTitle className="text-center">
                                <h2 className="font-comic text-xl mb-4">AI Assistant</h2>
                            </DialogTitle>
                        </DialogHeader>

                        <p className="font-poppins mb-4">{aiQuestion}</p>

                        {/* Input for the user's answer */}
                        <input
                            type="text"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            className="border p-2 w-full rounded-lg mb-4"
                            placeholder="Your answer..."
                            disabled={isSubmitting}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !isSubmitting) {
                                    handleAiSubmit();
                                }
                            }}
                        />

                        <Button
                            variant="outline"
                            className="w-full mb-4"
                            onClick={handleAiSubmit}
                            disabled={isSubmitting || !userAnswer.trim()}
                        >
                            {isSubmitting ? "Submitting..." : "Submit Answer"}
                        </Button>

                        {/* AI response */}
                        {aiResponse && (
                            <div className={`font-poppins text-sm p-3 rounded-lg ${
                                aiResponse.includes('Good Job') 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {aiResponse}
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            )}
        </Dialog>
    );
}

export default TasksDialog;