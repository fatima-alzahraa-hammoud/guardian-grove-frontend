import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { CircleDollarSign, Star } from "lucide-react";
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
    isCompleted: boolean;
}

interface GoalCardProps {
    goal: Goal;
    onViewTasks: () => void;
}

const GoalCard : React.FC<GoalCardProps> = ({goal, onViewTasks }) => {

    const formattedDueDate = goal.dueDate && !isNaN(new Date(goal.dueDate).getTime())
        ? new Date(goal.dueDate).toLocaleDateString() // Format it if valid
        : 'No due date';

    return (
        <Card className="bg-[#FDE3EC] border-none shadow-none w-[250px] font-poppins">
            <CardContent className="p-6 flex flex-col justify-between h-full">
                <h3 className="text-lg font-semibold mb-2 font-comic">{goal.title}</h3>
                <p className="text-xs text-gray-600 mb-1">{goal.type} Goals</p>
                <p className="text-sm mt-3">{goal.description}</p>
                
                <div className="mb-4">
                    <ProgressBar label="Tasks" completed={goal.nbOfTasksCompleted} total={goal.tasks.length} />
                </div>
        
                <p className="text-xs mb-4">Complete by: {formattedDueDate}</p>
                
                <div className="flex flex-col mb-4">
                    <div className="text-xs">
                        <span className="font-semibold">Rewards: </span>
                        <span className="ml-1">
                            <Star className="inline w-4 h-4 text-yellow-500 mr-1" /> {goal.rewards.stars}
                            <CircleDollarSign className="inline w-4 h-4 text-yellow-500 ml-2 mr-1" /> {goal.rewards.coins}
                        </span>
                    </div>
                    <div className="text-xs pt-2">
                        <span className="font-semibold mr-2">Badge: </span> {goal.rewards.achievementName}
                    </div>
                </div>
        
                {!goal.isCompleted &&
                    <div className="flex justify-center">
                        <Button
                            className="w-1/2 rounded-full bg-[#3A8EBA] text-white hover:bg-[#326E9F] shadow-none"
                            onClick={onViewTasks}
                        >
                            View Tasks
                        </Button>
                    </div>
                }
            </CardContent>
        </Card>  
    );
};

export default GoalCard;