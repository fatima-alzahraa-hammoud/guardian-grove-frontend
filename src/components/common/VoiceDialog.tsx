import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import microphone from "/assets/images/microphone.png";
import stop from "/assets/images/stop.png";

interface VoiceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const VoiceDialog : React.FC<VoiceDialogProps> = ({open, onOpenChange}) => {

    const [isListening, setIsListening] = useState(false)

    const toggleListening = () => {
        if (isListening) {
            setIsListening(false)
        } else {
            setIsListening(true)
        }
    }

    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center font-comic">Speak with Glowy, your AI Friend</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center space-y-6 my-5">

                    <Button
                        className={`w-20 h-20 rounded-full transition-all duration-500 ease-in-out bg-[#3A8EBA] hover:bg-[#347ea5] ${
                        isListening 
                            ? 'animate-pulse' 
                            : ''
                        }`}
                    >
                    </Button>
                </div>

                {/* button start if not listening, and make it stop if listening and button send*/}
                
                <div className=" flex items-center justify-center gap-2">
                    <button
                        onClick={toggleListening}
                        className="cursor-pointer border-[1px] rounded-full p-3 hover:bg-[#f7f7f7]"
                        type="button"
                    >
                        {!isListening ? (
                            <img src={microphone} className="h-8 w-8" />
                        ) : (
                            <img src={stop} className="h-7 w-7" />
                        )}
                    </button>
                </div>

            </DialogContent>
        </Dialog>
    );
};

export default VoiceDialog;