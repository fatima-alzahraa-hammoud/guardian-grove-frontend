import React from "react";
import { Dialog, DialogHeader } from "../ui/dialog";
import { DialogContent, DialogTitle } from "@mui/material";

interface FamilyDialogProps {
    familyName: string;
    rank: number;
}

const FamilyDialog : React.FC<FamilyDialogProps> = ({familyName, rank}) => {

    return (
        <Dialog>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <div>
                            <span className=" font-bold">Family Name: </span>
                            <span className="font-semibold">{familyName}</span>
                        </div>

                        <div>
                            <span className="font-semibold">Rank: </span>
                            <span className="font-medium">{rank}</span>
                        </div>
                    </DialogTitle>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default FamilyDialog;