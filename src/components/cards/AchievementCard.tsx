import React from "react";
import coinImage from "/assets/images/coins.png";
import starsImage from "/assets/images/stars.png";

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
        <div className="h-[180px] border border-[#3A8EBA] justify-center rounded-lg hover:shadow-md transition-all duration-300 font-poppins relative overflow-hidden cursor-pointer">
            <div className="p-6 flex flex-col items-center justify-center gap-4">
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
                            <p className="text-sm font-medium">{criteria}</p>
                            {(starsReward > 0 || coinsReward > 0) && (
                                <div className="flex gap-7 justify-center items-center text-xs mt-4">
                                    {starsReward > 0 && (
                                        <span className="flex items-center gap-2 text-md">
                                            <img
                                                src={starsImage}
                                                alt="Stars"
                                                className="w-5 h-5"
                                            />
                                            {starsReward}
                                        </span>
                                    )}
                                    {coinsReward > 0 && (
                                        <span className="flex items-center gap-2 text-md">
                                            <img
                                                src={coinImage}
                                                alt="Coins"
                                                className="w-5 h-5"
                                            />
                                            {coinsReward}
                                        </span>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AchievementCard;
