import React from "react";
import sortImage from "../../assets/images/sort.png";

const Achievements : React.FC = () => {
    return(
        <div className="pt-20 h-screen flex flex-col">
            <div className="max-w-5xl px-6 flex-grow font-poppins">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="text-left">
                        <h2 className="text-xl font-bold font-comic">Achievements</h2>
                    </div>

                    <button className="flex items-center justify-between bg-[#3A8EBA] px-3 py-2 rounded-full hover:bg-[#347ea5] transition">
                        <img src={sortImage} alt="Sort" className="w-4 h-4 mr-1"/>
                        <span className="font-semibold text-sm ml-2 text-white">Sort</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Achievements;