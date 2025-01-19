import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import Task from "/assets/images/task.png";
import Star from "/assets/images/stars.png";

interface LeaderboardItemProps {
    rank: number;
    familyName: string;
    stars: number;
    tasks: number;
    familyId: string;
    familyAvatar: string;
    isFamily: boolean;
    rankStyle: string;
    onView: () => void;
}

const LeaderboardItem: React.FC<LeaderboardItemProps> = ({ rank, familyName, stars, tasks, familyId, familyAvatar, isFamily, rankStyle, onView }) => {

    return(
        <div
            className={cn(
                "mx-auto px-4 flex items-center justify-between bg-[#301DAD21] rounded-lg mb-4 p-4 h-20",
                isFamily ? "border-2 border-dashed border-[#3A8EBA] bg-[#E3F2FD]" : ""
            )}
        >
            {/* Rank Section */}
            <div className="w-12 flex items-center justify-center">
                {rank <= 3 ? (
                    <span className="text-2xl">
                        {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
                    </span>
                ) : (
                    <span className={rankStyle}>{rank}</span>
                )}
            </div>

            {/* Avatar and Name Section */}
            <div className="flex items-center min-w-[200px]">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
                    <img
                        src={familyAvatar || "/assets/images/avatars/family/avatar1.png"}
                        alt={`${familyName} Avatar`}
                        className="w-full h-full object-cover"
                    />
                </div>
                <span className="truncate text-base font-medium max-w-[150px]">{familyName}</span>
            </div>

            {/* Stars, Tasks, and View Button */}
            <div className="flex items-center gap-16">
                <div className="flex items-center gap-3 w-[50px] justify-between">
                    <img src={Star} className="w-5 h-5" />
                    <span className="font-semibold text-center">{stars}</span>
                </div>
                <div className="flex items-center gap-3 w-[50px] justify-between">
                    <img src={Task} className="w-5 h-5" />
                    <span className="font-semibold text-center">{tasks}</span>
                </div>
                <Button onClick={onView} className="bg-[#179447] hover:bg-[#158640] text-white px-6 rounded-2xl">
                    View
                </Button>
            </div>
        </div>
    );
};

export default LeaderboardItem;
