import React from "react";

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

const TasksDialog : React.FC<TasksDialogProps> = () => {
    return(
        <div></div>
    );
}

export default TasksDialog;