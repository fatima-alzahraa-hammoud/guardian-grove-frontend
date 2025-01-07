import React from "react";

interface AchievementCardProps {
    title: string;
    description: string;
    photo: string;
    criteria: string;
    starsReward: number;
    coinsReward: number;
    isLocked?:boolean;
}

const AchievementCard : React.FC<AchievementCardProps> = ({title, description, photo, criteria, starsReward, coinsReward, isLocked}) => {
    return(
        <div className="border border-[#3A8EBA] rounded-md hover:shadow-md transition font-poppins">
            <div className="p-5 flex flex-col items-center gap-4">
                {/* Achievement Image */}
                <div className="w-20 h-20 flex justify-center items-center">
                    <img 
                        src={photo}
                        alt={title}
                        className="w-16 h-16 object-contain"
                    />
                </div>
            </div>
        </div>
    );
};

export default AchievementCard;