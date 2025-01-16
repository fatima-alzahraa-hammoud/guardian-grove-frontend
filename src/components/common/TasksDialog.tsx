import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Coins, Star } from "lucide-react";

interface Task {
    _id: string;
    title: string;
    completed: boolean;
    description: string;
    rewards: {
        stars: number;
        coins: number;
    };
}

interface Goal {
    _id: string;
    title: string;
    tasks: Task[];
    rewards: {
        stars: number;
        coins: number;
        achievementName?: string;
    };
}

interface TasksDialogProps {
    goal: Goal | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const TasksDialog : React.FC<TasksDialogProps> = ({goal, open, onOpenChange}) => {
    if (!goal) return null;

    const [showAiPopup, setShowAiPopup] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [aiQuestion, setAiQuestion] = useState<string>("What did you learn from completing this task?");
    const [userAnswer, setUserAnswer] = useState<string>("");
    const [aiResponse, setAiResponse] = useState<string>("");

    const handleDoItClick = (task: Task) => {
        setSelectedTask(task);
        setShowAiPopup(true); // Show the AI pop-up when the "Do it" button is clicked
    };

    const handleAiSubmit = () => {
        if (userAnswer.trim() !== "") {
            setAiResponse(`Great job! You said: "${userAnswer}". Now, you've completed the task!`);
            selectedTask && (selectedTask.completed = true);
        } else {
            setAiResponse("Please provide a response before submitting.");
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
                                        disabled={task.completed}
                                        onClick={() => handleDoItClick(task)}
                                    >
                                        {task.completed ? "Done!" : "Do it"}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
            {/* AI Popup for Task Completion */}
            {showAiPopup && selectedTask && (
                <Dialog open={showAiPopup} onOpenChange={(open) => setShowAiPopup(open)}>
                    <DialogContent className="max-w-xs p-6 text-center">
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
                        />

                        <Button
                            variant="outline"
                            className="w-full mb-4"
                            onClick={handleAiSubmit}
                        >
                            Submit Answer
                        </Button>

                        {/* AI response */}
                        {aiResponse && <p className="font-poppins text-sm">{aiResponse}</p>}
                    </DialogContent>
                </Dialog>
            )}
        </Dialog>
    );
}

export default TasksDialog;