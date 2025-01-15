import React from 'react';
import { Coins, Star } from "lucide-react";

interface IChallenge {
    title: string;
    content: string;
    starsReward: number;
    coinsReward: number;
}

interface Adventure {
    startDate: string;
    title: string;
    description: string;
    challenges: IChallenge[];
    starsReward: number;
    coinsReward: number;
}

interface AdventureProps {
    adventure: Adventure | null;
}

const Adventures: React.FC<AdventureProps> = ({ adventure }) => {

    if (!adventure) {
        return (
            <div className="mt-8 text-center text-gray-600">
                No adventures available for this date
            </div>
        );
    }

    const formattedDate = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(adventure.startDate));

    return (
        <div className="-mt-32">
            <div className="mb-4">
                <div className='-mt-20 mb-10'>
                    <p className="text-base font-poppins font-semibold mb-6">{formattedDate}</p>
                    <h3 className="text-xl font-semibold mb-2 font-comic">{adventure.title}</h3>
                </div>

                {/* Rewards */}
                <div className="flex items-start justify-between w-2/3">
                    <p className="text-sm w-2/3">{adventure.description}</p>
                    <div className='flex justify-between gap-6'>
                        <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                            <span className="font-medium">{adventure.starsReward}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Coins className="w-5 h-5 text-gray-600" />
                            <span className="font-medium">{adventure.coinsReward}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Adventures;