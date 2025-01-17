import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import microphone from "/assets/images/microphone.png";
import stop from "/assets/images/stop.png";
import send from "/assets/images/send.png";
import { useChat } from 'ai/react'

interface VoiceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const VoiceDialog : React.FC<VoiceDialogProps> = ({open, onOpenChange}) => {

    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState("")

    const recognitionRef = useRef<any>(null)


    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop()
            }
        }
    }, [])

    const toggleListening = () => {
        if (isListening) {
            stopListening()
        } else {
            startListening()
        }
    }

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
        alert("Speech recognition not supported in this browser.")
        return
        }

        recognitionRef.current = new (window as any).webkitSpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'en-US'

        recognitionRef.current.onstart = () => {
            setIsListening(true)
        }

        recognitionRef.current.onresult = (event: any) => {
            const currentTranscript = Array.from(event.results)
                .map((result: any) => result[0].transcript)
                .join('')
            setTranscript(currentTranscript)
        }

        recognitionRef.current.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error)
            stopListening()
        }

        recognitionRef.current.start()
    }

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
    }

    const handleCloseDialog = (open: boolean) => {
        onOpenChange(open);
        if (!open) {
            setIsListening(false);
            setTranscript(""); 
        }
    };

    return(
        <Dialog open={open} onOpenChange={handleCloseDialog}>
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

                {/* Display the transcript */}
                <div className="w-full p-2 h-[100px] border rounded text-center font-poppins text-xs overflow-y-auto">
                    { transcript|| "Start talking to Glowy..."}
                </div>

                {/* button start if not listening, and make it stop if listening and button send*/}
                
                <div className=" flex items-center justify-center gap-5">
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
                    <button
                        className="cursor-pointer border-[1px] rounded-full p-3 hover:bg-[#f7f7f7]"
                    >
                        <img src={send} className="h-7 w-7" />
                    </button>
                </div>

            </DialogContent>
        </Dialog>
    );
};

export default VoiceDialog;