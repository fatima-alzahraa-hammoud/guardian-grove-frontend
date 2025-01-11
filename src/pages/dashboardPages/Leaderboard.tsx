import React from "react";
import { Button } from "../../components/ui/button";

const Leaderboard : React.FC = () => {
    return(
        <div className=" h-screen flex flex-col">
            <div className="max-w-5xl mx-auto flex-grow pt-20 font-poppins">
                {/* Header */}
                <div className="mb-10 mt-5 flex items-center justify-between">
                    <div className="text-left">
                        <h2 className="text-2xl font-bold font-comic">Family Leaderboard</h2>
                        <p className="text-gray-600 mt-2 text-base">
                            Shine together! See how your family ranks among others.
                        </p>
                    </div>

                    <Button
                        className="flex items-center bg-[#3A8EBA] px-3 py-2 rounded-full hover:bg-[#347ea5] transition"
                    >
                        <p className="text-sm font-semibold text-white">
                            View Your Achievements 
                        </p>
                    </Button>
                </div>
            </div>
            
        </div>
    );
};

export default Leaderboard;