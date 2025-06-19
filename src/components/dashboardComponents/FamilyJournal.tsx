import React from "react";

interface FamilyJournalProps {
    collapsed: boolean;
}

const FamilyJournal : React.FC <FamilyJournalProps> = ({collapsed}) => {
    return(
        <div className={`pt-24 min-h-screen flex flex-col items-center transition-all duration-300 ${collapsed ? 'px-4' : 'px-8'}`}>
            <div className={`w-full flex-grow font-poppins mx-auto px-4 transition-all duration-300 ${collapsed ? 'max-w-6xl' : 'max-w-5xl'}`} >
                {/* Header */}
                <div className="text-left">
                    <h2 className={`font-bold font-comic transition-all duration-300 ${collapsed ? 'text-2xl' : 'text-xl'}`}>
                        Family Journal
                    </h2>
                    <p className={`text-gray-600 mt-2 transition-all duration-300 ${collapsed ? 'text-lg w-[80%]' : 'text-base w-[75%]'}`}>
                        A place to capture your family's special moments, stories, and memories. Keep them close, cherish them forever.
                    </p>
                </div>
                
                {/* Content area - you can add more content here */}
                <div className={`mt-8 transition-all duration-300 ${collapsed ? 'space-y-6' : 'space-y-4'}`}>
                    {/* Add your journal content here */}
                </div>
            </div>
        </div>
    );
};

export default FamilyJournal;