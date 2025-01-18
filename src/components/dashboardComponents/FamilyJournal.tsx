import React from "react";

interface FamilyJournalProps {
    collapsed: boolean;
}

const FamilyJournal : React.FC <FamilyJournalProps> = ({collapsed}) => {
    return(
        <div className={`pt-24 min-h-screen flex flex-col items-center`}>
            <div className={`w-full flex-grow font-poppins mx-auto px-4 max-w-5xl`} >
                {/* Header */}
                <div className="text-left">
                    <h2 className="text-xl font-bold font-comic">
                        Family Journal
                    </h2>
                    <p className="text-gray-600 mt-2 text-base w-[75%]">
                        A place to capture your family’s special moments, stories, and memories. Keep them close, cherish them forever.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FamilyJournal;