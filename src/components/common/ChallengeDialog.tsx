import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { toast } from "react-toastify";
import { requestApi } from "../../libs/requestApi";
import { requestMethods } from "../../libs/enum/requestMethods";
import { useDispatch, useSelector } from "react-redux";
import { selectUserId, setCoins, setStars } from "../../redux/slices/userSlice";


interface ChallengeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    challenge: {
        _id: string;
        title: string;
        content: string;
        starsReward: number;
        coinsReward: number;
    } | null;
    adventureId: string;
    adventureTitle: string;
    challengeNumber: number;
    totalChallenges: number;
    onChallengeComplete?: (challengeId: string) => void;
    isCompleted?: boolean;
}

const ChallengeDialog : React.FC<ChallengeDialogProps> = ({isOpen, onClose, challenge, adventureTitle, totalChallenges, adventureId, challengeNumber, onChallengeComplete, isCompleted}) => {
    const [userAnswer, setUserAnswer] = useState<string>("");
    const userId = useSelector(selectUserId);
    const [aiResponse, setAiResponse] = useState<string>("");
    const dispatch = useDispatch();

    if (!challenge) return null;

    const handleAiSubmit = async() => {
        try {
            if (!userAnswer.trim()){
                toast.warn("Add an answer!");
                return;
            }

            setAiResponse("Checking your answer...");

            const response = await requestApi({
                route: "/users/checkAnswer",
                method: requestMethods.POST,
                body: {userId: userId, question: challenge.content, userAnswer: userAnswer.trim()}
            });

            if (response &&  typeof response.questionAnswered === 'boolean'){
                setAiResponse("Excellent your answer is correct! 😊");

                const result = await requestApi({
                    route: "/users/adventure/challenge",
                    method: requestMethods.POST,
                    body: {adventureId: adventureId, challengeId: challenge._id}
                });
                console.log(result)
                if(result && result.adventureProgress && result.rewards){
                    dispatch(setStars(result.rewards.stars));
                    dispatch(setCoins(result.rewards.coins));
                    onChallengeComplete?.(challenge._id);

                }else{
                    console.log(result.message)
                }
            }
            else{
                setAiResponse("That's not quite right. Try again! 🤔");
                toast.info(response?.message || "Incorrect answer, please try again");
            }
            
        } catch (error) {
            console.error("Error checking answer:", error);
            toast.error("Something went wrong. Please try again.");
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
                        {isCompleted && (
                            <span className="ml-2 text-green-500">
                                (Completed ✓)
                            </span>
                        )}
                    </h3>
                    
                    <div className="mt-6 text-xs">
                        {challenge.content}
                    </div>

                    {!isCompleted && (
                        <>
                            <div className="mt-6">
                                <label className="block text-sm font-semibold mb-2">Answer</label>
                                <input
                                    id="answer" 
                                    type="text" 
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    placeholder="Answer" 
                                    className="w-full flex-1 h-9 bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-xs pl-8 mt-1 placeholder:text-[10px] placeholder:text-gray-500 rounded-md border-[#3A8EBA] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3A8EBA]" 
                                />
                            </div>

                            <button 
                                onClick={handleAiSubmit} 
                                className="text-xs mt-6 w-28 mx-auto block py-2 px-4 bg-[#3A8EBA] rounded-full hover:bg-[#347ea5] text-white transition-colors"
                            >
                                Submit
                            </button>
                        </>
                    )}


                    {/* AI response */}
                    {aiResponse && <p className="text-center font-comic text-sm pt-3">{aiResponse}</p>}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ChallengeDialog;