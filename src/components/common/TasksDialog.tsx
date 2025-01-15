import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Coins, Star } from "lucide-react";

interface Task {
    _id: string;
    title: string;
    completed: boolean;
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
                                    <span>{task.title}</span>
                                </div>
                                <div className="flex items-center gap-5">
                                    <div className="flex items-center gap-2">
                                        <Star className="w-4 h-4 text-yellow-500" />
                                        <span>5</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Coins className="w-4 h-4 text-yellow-500" />
                                        <span>1</span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="text-xs"
                                        disabled={task.completed}
                                    >
                                        {task.completed ? "Done!" : "Do it"}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default TasksDialog;