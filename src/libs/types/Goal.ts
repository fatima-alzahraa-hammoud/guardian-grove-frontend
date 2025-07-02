import { Task } from "./Task";

export interface Goal {
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