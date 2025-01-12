import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import AvatarSelector from "../AvatarSelector";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addMemberSchema, TAddMember } from "../../libs/types/addMemberTypes";

const AddMembersForm : React.FC = () => {

    const [tab, setTab] = useState<string>("child");

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset
    } = useForm<TAddMember>({
        resolver: zodResolver(addMemberSchema),
    });

    return(
        <div className="max-w-2xl w-full backdrop-blur-sm p-6 space-y-6 rounded-2xl">
            {/* Header */}
            <h1 className="text-xl md:text-2xl font-bold font-comic">
                Add Your Loved Ones to Begin the Adventure!
            </h1>

            <Tabs defaultValue="child" className="w-full">
                <div className="flex justify-start items-center pl-20">
                    <TabsList className="flex flex-nowrap space-x-2 bg-[#CDE7FE]">
                        <TabsTrigger value="child" className="shrink-0" onClick={() => setTab("child")}>Child</TabsTrigger>
                        <TabsTrigger value="parent" className="shrink-0" onClick={() => setTab("parent")}>Parent</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value={tab}>
                    {/* Avatar Selection */}
                    <div className="mt-10">
                        <h4 className="mb-2 text-xs font-medium -mx-[30px]">Change your avatar</h4>
                        <div className="flex">
                            
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AddMembersForm;