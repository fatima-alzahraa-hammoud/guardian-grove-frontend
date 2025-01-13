import React from "react";
import { Card, CardContent } from "../ui/card";

interface FamilyMember {
    name: string;
    role: string;
    avatar: string;
}

interface FamilyMemberCardProps {
    member: FamilyMember;
    colorClass: string;
}

const FamilyMemberCard : React.FC<FamilyMemberCardProps> = ({ member, colorClass }) => {
    return(
        <Card className="relative rounded-b-none w-[200px] overflow-hidden hover:shadow-lg transition-shadow cursor-pointer rounded-t-[3.5rem]">
            <CardContent className="p-6 flex flex-col items-center space-y-4">
                <div
                    className={`w-24 h-24 rounded-full border-4 ${colorClass} flex items-center justify-center overflow-hidden`}
                >
                    <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full object-cover rounded-full"
                    />
                </div>
                <div className="text-center">
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
            </CardContent>
            <div className={`absolute bottom-0 left-0 right-0 h-2 rounded-[0rem] ${colorClass}`} />
        </Card>
    );
};

export default FamilyMemberCard;