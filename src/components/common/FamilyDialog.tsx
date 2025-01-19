import React from "react";
import { Dialog, DialogHeader } from "../ui/dialog";
import { DialogContent, DialogTitle } from "@mui/material";

interface FamilyDialogProps {
    familyName: string;
    rank: number;
    totalStars: number;
    wonChallenges: number;
}

const FamilyDialog : React.FC<FamilyDialogProps> = ({familyName, rank, totalStars, wonChallenges}) => {

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

                <div className="mt-2">
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
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FamilyDialog;