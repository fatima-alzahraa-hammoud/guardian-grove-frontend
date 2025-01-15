import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Coins, Star, X } from "lucide-react";

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
                                <span>Bookworm</span>
                            </div>
                        </div>
                    </div>

                    
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default TasksDialog;