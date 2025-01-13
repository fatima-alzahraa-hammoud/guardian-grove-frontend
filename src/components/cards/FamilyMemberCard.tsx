import React from "react";
import { Card, CardContent } from "../ui/card";

interface FamilyMember {
    name: string;
    role: string;
    avatar: string;
    gender: string;
}

interface FamilyMemberCardProps {
    member: FamilyMember;
    colorClass: string;
}

const FamilyMemberCard : React.FC<FamilyMemberCardProps> = ({ member, colorClass }) => {

    let familyMember;

    if (member.role === "parent"){
        familyMember = member.gender === "female" ? "Mother" : "Father";
    }
    else{
        familyMember = "child";
    }

    return(
        <Card className="relative rounded-b-none w-[180px] h-[200px] overflow-hidden hover:shadow-lg transition-shadow cursor-pointer rounded-t-[3.5rem]">
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
                    <h3 className="font-semibold font-comic truncate w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                        {member.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{familyMember}</p>
                </div>
            </CardContent>
            <div className={`absolute bottom-0 left-0 right-0 h-2 rounded-[0rem] ${colorClass}`} />
        </Card>
    );
};

export default FamilyMemberCard;