import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Lightbulb } from "lucide-react";

export interface QuickTipProps {
    tip: {
        title: string;
        message: string;
    }
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const QuickTipDialog : React.FC<QuickTipProps> = ({ open, onOpenChange, tip }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-sky-800">
                        <Lightbulb className="w-5 h-5 text-[#3A8EBA]" />
                        {tip.title}
                    </DialogTitle>
                    <DialogDescription className="text-sky-800 pt-5">
                        {tip.message}
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default QuickTipDialog;