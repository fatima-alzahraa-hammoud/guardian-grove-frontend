import React from "react";


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

const ChallengeDialog : React.FC<ChallengeDialogProps> = () => {
    return(
        <div></div>
    )
};

export default ChallengeDialog;