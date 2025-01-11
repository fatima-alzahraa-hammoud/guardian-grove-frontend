import React from "react";

const Leaderboard : React.FC = () => {
    return(
        <div className="pt-28 h-screen flex flex-col mx-auto">
            <div className="max-w-5xl px-6 flex-grow font-poppins">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="text-left">
                        <h2 className="text-2xl font-bold font-comic">Family Leaderboard</h2>
                        <p className="text-gray-600 mt-2 text-base">
                            Shine together! See how your family ranks among others.
                        </p>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default Leaderboard;