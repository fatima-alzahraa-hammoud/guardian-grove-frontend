import React from "react";
import { Dialog } from "../ui/dialog";


interface VoiceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const VoiceDialog : React.FC<VoiceDialogProps> = ({open, onOpenChange}) => {
    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
            
        </Dialog>
    );
};

export default VoiceDialog;