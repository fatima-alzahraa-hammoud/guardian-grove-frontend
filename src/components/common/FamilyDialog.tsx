import React, { useEffect, useState } from "react";
import { Dialog, DialogHeader, DialogContent, DialogTitle } from "../ui/dialog";
import { requestApi } from "../../libs/requestApi";
import { requestMethods } from "../../libs/enum/requestMethods";
import ProgressBar from "./ProgressBar";

export interface FamilyDialogProps {
    familyName: string;
    rank: number | null;
    totalStars: number;
    wonChallenges: number;
    familyId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const FamilyDialog : React.FC<FamilyDialogProps> = ({open, onOpenChange, familyName, rank, totalStars, wonChallenges, familyId}) => {

    const [lastUnlocked, setLastUnlocked] = useState<{title: string, photo: string, description: string, unlockedAt: Date}> ();
    
    useEffect(() => {
        const fetchLastUnlockedAchievement = async () => {
            try {
                const response = await requestApi({
                    route: "/achievements/lastFamilyUnlocked",
                    method: requestMethods.POST,
                    body: {familyId}
                });

                if (response){
                    if (response.message !== "No achievements"){
                        setLastUnlocked(response.lastUnlockedAchievement);
                    }
                }
                else{
                    console.log(response.message)
                }
            } catch (error) {
                console.log("something wents wrong in getting achievements", error);
            }
        }
        fetchLastUnlockedAchievement();
    }, [familyId]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl p-10 font-poppins">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between font-comic text-lg">
                        <div>
                            <span className=" font-bold">Family Name: </span>
                            <span className="font-semibold">{familyName}</span>
                        </div>

                        <div>
                            <span className="font-semibold">Rank: </span>
                            <span className="font-medium">{rank}</span>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="mt-2 space-y-6">
                    {/* winning section */}
                    <div className="mb-6 font-comic">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">Total Stars:</span>
                                <span>{totalStars}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">Challenges Won:</span>
                                <span>{wonChallenges}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-start justify-between  w-full">
                        <div className="space-y-5 w-[60%]">
                            {/* Last Unlocked Achievements Section */}
                            <div className="pt-10">
                                <p className="font-semibold text-sm">Last Unlocked Achievement:</p>
                                <p className="pt-4 text-xs">{lastUnlocked?.title || "No achievements yet 😮‍💨"}</p>
                            </div>

                            {/* Adventure of the day */}
                            <div className="pt-5">
                                <p className="font-semibold text-sm">Adventure of the day:</p>
                                <p className="pt-4 text-xs">4 challenges solved out of 10!</p>
                            </div>

                            {/* Send feedback to family */}
                        </div>

                        {/* Family Progress section */}
                        <div className="pt-10 w-[40%]">
                            <p className="font-semibold text-sm">Progress Summary</p>
                            <div className="space-y-2 w-full">
                                <ProgressBar label="Tasks" completed={4} total={5}/>
                                <ProgressBar label="Goals" completed={6} total={10}/>
                                <ProgressBar label="Achievements" completed={3} total={20}/>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FamilyDialog;