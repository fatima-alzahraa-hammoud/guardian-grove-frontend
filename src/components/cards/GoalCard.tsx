import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { CircleDollarSign, Stars } from "lucide-react";
import ProgressBar from "../common/ProgressBar";

interface GoalCardProps {
    title: string;
    type: string;
    description: string;
    progress: number;
    total: number;
    completionDate: Date;
    rewards: {
        stars: number;
        coins: number;
    };
    badge: string;
    onViewTasks: () => void;
}

const GoalCard : React.FC<GoalCardProps> = ({title, type, description, progress, total, completionDate, rewards, badge,onViewTasks }) => {
    return (
        <Card className="bg-pink-50">
            <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-sm text-gray-600 mb-1">{type}</p>
                <p className="text-sm mb-4">{description}</p>
                
                <div className="mb-4">
                    <ProgressBar label="Tasks" completed={progress} total={total} />
                </div>
        
                <p className="text-sm mb-4">Complete by: {completionDate.toLocaleDateString()}</p>
                
                <div className="flex justify-between items-center mb-4">
                    <div className="text-sm">
                        Rewards: 
                    <span className="ml-1">
                        <Stars className="inline w-4 h-4 text-yellow-500" /> {rewards.stars}
                        <CircleDollarSign className="inline w-4 h-4 text-yellow-500 ml-2" /> {rewards.coins}
                    </span>
                    </div>
                    <div className="text-sm">
                        Badge: {badge}
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