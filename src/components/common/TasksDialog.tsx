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
                    <DialogTitle className="flex items-center justify-between font-comic">
                        <div>
                            <span className="text-xl font-bold">Goal: </span>
                            <span className="font-semibold">{goal.title}</span>
                        </div>

                        <div>
                            <span className="font-semibold">Total Tasks: </span>
                            <span className="font-medium">{goal.tasks.length}</span>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                
            </DialogContent>
        </Dialog>
    );
}

export default TasksDialog;