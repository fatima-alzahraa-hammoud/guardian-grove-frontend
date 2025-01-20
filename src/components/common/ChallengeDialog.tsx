import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { toast } from "react-toastify";
import { requestApi } from "../../libs/requestApi";
import { requestMethods } from "../../libs/enum/requestMethods";
import { useSelector } from "react-redux";
import { selectUserId } from "../../redux/slices/userSlice";


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
    challengeNumber: number;
    totalChallenges: number;
}

const ChallengeDialog : React.FC<ChallengeDialogProps> = ({isOpen, onClose, challenge, adventureTitle, totalChallenges, challengeNumber}) => {
    if (!challenge) return null;

    const [userAnswer, setUserAnswer] = useState<string>("");
    const userId = useSelector(selectUserId);
    const [aiResponse, setAiResponse] = useState<string>("");

    const handleAiSubmit = async() => {
        try {
            if (!userAnswer.trim()){
                toast.warn("Add an answer!");
            }

            const response = await requestApi({
                route: "/users/checkAnswer",
                method: requestMethods.POST,
                body: {userId: userId, question: challenge.content, userAnswer: userAnswer.trim()}
            });

            if (response && response.questionAnswered){
                setAiResponse("Excellent your answer is correct! 😊");
            }
            else{
                console.log(response.message)
            }
            
        } catch (error) {
            console.log("something went wrong", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
             <DialogContent className="max-w-lg p-10 font-poppins">
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

                <div className="mt-6">
                    <h3 className="text-sm font-semibold mb-2 text-center">
                        Challenge {challengeNumber}/{totalChallenges}: {challenge.title}
                    </h3>
                    
                    <div className="mt-6 text-xs">
                        {challenge.content}
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-semibold mb-2">Answer</label>
                        <Input
                            id="answer" 
                            type="text" 
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            placeholder="Answer" 
                            className=" flex-1 h-9 bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-xs pl-8 mt-1 placeholder:text-[10px] placeholder:text-gray-500 rounded-md border-[#3A8EBA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3A8EBA]" 
                        />
                    </div>

                    <button onClick={handleAiSubmit} className="text-xs mt-6 w-28 mx-auto block py-2 px-4 bg-[#3A8EBA] rounded-full hover:bg-[#347ea5] text-white transition-colors">
                        Submit
                    </button>

                    {/* AI response */}
                    {aiResponse && <p className="font-poppins text-sm">{aiResponse}</p>}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ChallengeDialog;