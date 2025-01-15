import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { CircleDollarSign, Stars } from "lucide-react";
import ProgressBar from "../common/ProgressBar";

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
}

interface GoalCardProps {
    goal: Goal;
    onViewTasks: () => void;
}

const GoalCard : React.FC<GoalCardProps> = ({goal, onViewTasks }) => {
    return (
        <Card className="bg-pink-50">
            <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">{goal.title}</h3>
                <p className="text-sm text-gray-600 mb-1">{goal.type}</p>
                <p className="text-sm mb-4">{goal.description}</p>
                
                <div className="mb-4">
                    <ProgressBar label="Tasks" completed={goal.nbOfTasksCompleted} total={goal.tasks.length} />
                </div>
        
                <p className="text-sm mb-4">Complete by: {goal.dueDate.toLocaleDateString()}</p>
                
                <div className="flex justify-between items-center mb-4">
                    <div className="text-sm">
                        Rewards: 
                    <span className="ml-1">
                        <Stars className="inline w-4 h-4 text-yellow-500" /> {goal.rewards.stars}
                        <CircleDollarSign className="inline w-4 h-4 text-yellow-500 ml-2" /> {goal.rewards.coins}
                    </span>
                    </div>
                    <div className="text-sm">
                        Badge: {goal.rewards.achievementName}
                    </div>
                </div>
        
                <Button
                    className="w-full bg-blue-500 text-white hover:bg-blue-600"
                    onClick={onViewTasks}
                >
                    View Tasks
                </Button>
            </CardContent>
        </Card>  
    );
};

export default GoalCard;