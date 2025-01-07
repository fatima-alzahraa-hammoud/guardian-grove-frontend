import React from "react";

interface AchievementCardProps {
    title: string;
    description: string;
    photo: string;
    criteria: string;
    starsReward: number;
    coinsReward: number;
    isLocked?: boolean;
    unlockedAt?: Date;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ title, description, photo, criteria, starsReward, coinsReward, isLocked, unlockedAt, }) => {
    return (
        <div className="h-[200px] border border-[#3A8EBA] rounded-lg hover:shadow-md transition-all duration-300 font-poppins relative overflow-hidden cursor-pointer">
            <div className="p-6 flex flex-col items-center justify-around gap-4">
                {/* Achievement Image */}
                <div className="w-20 h-20 flex justify-center items-center bg-white rounded-full">
                    <img
                        src={photo}
                        alt={title}
                        className="w-14 h-14 object-contain"
                    />
                </div>

                {/* Item Name */}
                <h4 className="text-md font-extrabold text-center font-comic">{title}</h4>

                {/* Hover Effect Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 text-white text-center opacity-0 hover:opacity-100 transition-opacity duration-300 p-4 rounded-lg">
                    {!isLocked ? (
                        <>
                            <p className="text-sm font-semibold">
                                Unlocked on:{" "}
                                {unlockedAt?.toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </p>
                            <p className="text-xs mt-4">{description}</p>
                        </>
                    ) : (
                        <>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AchievementCard;
