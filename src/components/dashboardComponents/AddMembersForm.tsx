import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

const AddMembersForm : React.FC = () => {

    const [tab, setTab] = useState<string>("child");

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
            </Tabs>
        </div>
    );
};

export default AddMembersForm;