import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";


interface VoiceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const VoiceDialog : React.FC<VoiceDialogProps> = ({open, onOpenChange}) => {
    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center">Speak with Glowy, your AI Friend</DialogTitle>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default VoiceDialog;