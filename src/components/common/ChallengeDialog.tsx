import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Coins, Star } from "lucide-react";


interface ChallengeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    challenge: {
      title: string;
      content: string;
      starsReward: number;
      coinsReward: number;
    } | null;
    adventureTitle: string;
    adventureStars: number;
    adventureCoins: number;
    challengeNumber: number;
    totalChallenges: number;
}

const ChallengeDialog : React.FC<ChallengeDialogProps> = ({isOpen, onClose, challenge, adventureTitle, adventureStars, adventureCoins, totalChallenges, challengeNumber}) => {
    if (!challenge) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
             <DialogContent className="max-w-lg p-10">
                <DialogHeader>
                    <DialogTitle className="flex flex-col justify-between font-comic text-lg">
                        <div>
                            <span className=" font-bold">Adventure: </span>
                            <span className="font-semibold">{adventureTitle}</span>
                        </div>

                        <div className="flex items-center justify-between mt-5">
                            <div>
                                <span className="font-semibold">Total Stars: </span>
                                <span className="font-medium">{challenge.starsReward}</span>
                            </div>
                            <div>
                                <span className="font-semibold">Total Coins: </span>
                                <span className="font-medium">{challenge.coinsReward}</span>
                            </div>
                        </div>
                    </DialogTitle>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default ChallengeDialog;