import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Coins, Star } from "lucide-react";
import ChallengeDialog from '../common/ChallengeDialog';

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
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [selectedChallenge, setSelectedChallenge] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 200;
            const newScrollPosition = scrollContainerRef.current.scrollLeft + 
                (direction === 'left' ? -scrollAmount : scrollAmount);
            scrollContainerRef.current.scrollTo({
                left: newScrollPosition,
                behavior: 'smooth'
            });
        }
    };

    const handleChallengeClick = (index: number) => {
        setSelectedChallenge(selectedChallenge === index ? null : index);
        setIsDialogOpen(true);
    };

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

            {/* Challenges Section */}
            <div className="relative mt-10 flex justify-center items-center">
                <button 
                    onClick={() => scroll('left')} 
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-lg p-1 hover:bg-gray-50 border-[2px]"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div 
                    ref={scrollContainerRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide px-8 snap-x snap-mandatory mx-auto w-[87%]"
                    style={{ 
                        scrollbarWidth: 'none', 
                        msOverflowStyle: 'none',
                        margin: '0 auto'
                    }}
                >
                    <div className="flex items-center justify-center gap-4 min-w-min mx-auto h-52">
                        {adventure.challenges.map((challenge, index) => (
                            <div 
                                key={index}
                                className="flex-shrink-0 snap-center text-center"
                                onClick={() => handleChallengeClick(index)}
                            >
                                <div 
                                    className={`w-32 h-32 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105
                                        ${index % 5 === 0 ? 'bg-blue-100' : 
                                        index % 5 === 1 ? 'bg-purple-100' : 
                                        index % 5 === 2 ? 'bg-pink-100' : 
                                        index % 5 === 3 ? 'bg-blue-100' : 'bg-red-100'}
                                        ${selectedChallenge === index ? 'ring-2 ring-[#3A8EBA]' : ''}`}
                                >
                                    <div className='flex flex-col items-center justify-center space-y-2'>
                                        <p className="font-medium text-sm mb-1">{challenge.title}</p>
                                        <div className="flex gap-3 justify-center">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                <span className="text-xs font-medium">{challenge.starsReward}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Coins className="w-4 h-4 text-gray-600" />
                                                <span className="text-xs font-medium">{challenge.coinsReward}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button 
                    onClick={() => scroll('right')} 
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-lg p-1 hover:bg-gray-50 border-[2px]"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            <ChallengeDialog
                isOpen={isDialogOpen}
                onClose={() => {
                    setIsDialogOpen(false);
                    setSelectedChallenge(null);
                }}
                challenge={selectedChallenge !== null ? adventure.challenges[selectedChallenge] : null}
                adventureTitle={adventure.title}
                challengeNumber={selectedChallenge !== null ? selectedChallenge + 1 : 0}
                totalChallenges={adventure.challenges.length}
            />
        </div>
    );
};

export default Adventures;