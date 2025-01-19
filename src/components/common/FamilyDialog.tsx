import React, { useEffect, useState } from "react";
import { Dialog, DialogHeader } from "../ui/dialog";
import { DialogContent, DialogTitle } from "@mui/material";
import { requestApi } from "../../libs/requestApi";
import { requestMethods } from "../../libs/enum/requestMethods";

interface FamilyDialogProps {
    familyName: string;
    rank: number;
    totalStars: number;
    wonChallenges: number;
    familyId: string;
}

const FamilyDialog : React.FC<FamilyDialogProps> = ({familyName, rank, totalStars, wonChallenges, familyId}) => {

    const [lastUnlocked, setLastUnlocked] = useState<{title: string, photo: string, description: string, unlockedAt: Date}> ();
        const [noAchievements, setNoAchievements] = useState<boolean> (false);
    
    useEffect(() => {
        const fetchLastUnlockedAchievement = async () => {
            try {
                const response = await requestApi({
                    route: "/achievements/lastFamilyUnlocked",
                    method: requestMethods.GET,
                    body: {familyId}
                });

                if (response){
                    if (response.message === "No achievements"){
                        setNoAchievements(true);
                    }
                    setLastUnlocked(response.lastUnlockedAchievement);
                }
            } catch (error) {
                console.log("something wents wrong in getting achievements", error);
            }
        }
        fetchLastUnlockedAchievement();
    }, []);

    return (
        <Dialog>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
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

                    {/* Last Unlocked Achievements Section */}
                    <div>
                        <p className="font-semibold">Last Unlocked Achievement:</p>
                        <p>{lastUnlocked?.title}</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FamilyDialog;