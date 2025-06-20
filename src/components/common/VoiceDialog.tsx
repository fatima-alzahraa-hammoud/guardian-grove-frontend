import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import microphone from "/assets/images/microphone.png";
import stop from "/assets/images/stop.png";
import send from "/assets/images/send.png";

interface VoiceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onClose: () => void;
    onSendMessage: (message: string) => Promise<void>;
}

interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionError extends Event {
    error: string;
}

interface WebkitSpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    onstart: (event: Event) => void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionError) => void;
}

interface WindowWithSpeechRecognition extends Window {
    webkitSpeechRecognition: new () => WebkitSpeechRecognition;
}

const VoiceDialog : React.FC<VoiceDialogProps> = ({open, onOpenChange, onSendMessage, onClose}) => {

    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState("")
    const [isProcessing, setIsProcessing] = useState(false);

    const recognitionRef = useRef<WebkitSpeechRecognition | null>(null);


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

        setTranscript("Preparing microphone...");

        const windowWithSpeech = window as WindowWithSpeechRecognition;
        recognitionRef.current = new windowWithSpeech.webkitSpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = () => {
            setIsListening(true);
        };

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
            const currentTranscript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            setTranscript(currentTranscript);
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionError) => {
            console.error("Speech recognition error:", event.error);
            if (event.error === 'not-allowed') {
                setTranscript("Microphone access denied. Please allow microphone access.");
            }
            stopListening();
        };

        recognitionRef.current.start();
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
            onClose();
        }
    };

    const handleSendMessage = async () => {
        if (transcript.trim() && !isProcessing) {
            setIsListening(false);
            setIsProcessing(true);
            try {
                await onSendMessage(transcript);
                setTranscript("");
            } catch (error) {
                console.error("Error sending message:", error);
            } finally {
                setIsProcessing(false);
            }
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
                        disabled={isProcessing}
                    >
                        {!isListening ? (
                            <img src={microphone} className="h-8 w-8" />
                        ) : (
                            <img src={stop} className="h-7 w-7" />
                        )}
                    </button>
                    <button
                        onClick={handleSendMessage}
                        className="cursor-pointer border-[1px] rounded-full p-3 hover:bg-[#f7f7f7]"
                        disabled={!transcript.trim() || isProcessing}
                    >
                        <img src={send} className="h-7 w-7" />
                    </button>
                </div>

            </DialogContent>
        </Dialog>
    );
};

export default VoiceDialog;