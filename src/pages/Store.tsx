import React, { useState } from "react";
import Navbar from "../components/dashboardComponents/NavBar";
import coinIcon from "../assets/images/coins.png";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

const Store: React.FC = () => {

    const [activeFilter, setActiveFilter] = useState<string>("All");

    const filters = ["All", "Garden Items", "Pets", "Themes", "Gifts", "Games"];



    return (
        <div className="h-screen flex flex-col">
            {/* Navbar */}
            <Navbar />
            
            {/* Main Content */}
            <div className="flex-grow pt-20 px-6 font-poppins">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="mb-10 mt-5 flex items-center justify-between">
                        <div className="text-left">
                            <h2 className="text-3xl font-bold font-comic">Welcome to your Magic Store</h2>
                            <p className="text-gray-600 mt-2 text-base">
                                Spend your hard-earned coins to customize your Magic Garden and unlock rewards!
                            </p>
                        </div>

                        {/* Coin Button */}
                        <div className="flex items-center justify-between bg-[#FFC85B] px-5 py-2 rounded-full shadow cursor-pointer hover:bg-yellow-300 transition">
                            <img src={coinIcon} alt="coin" className="w-6 h-6 mr-2" />
                            <span className="font-semibold text-lg ml-2">{0}</span>
                        </div>
                    </div>

                    {/* Filters Section */}
                    <div className="flex flex-wrap gap-2">
                        {filters.map((filter) => (
                            <Button
                                key={filter}
                                variant="secondary"
                                className={cn(
                                    "bg-[#E3F2FD] hover:bg-[#d7edfd] w-32 text-black",
                                    activeFilter === filter && "bg-[#3A8EBA] text-white hover:bg-[#347ea5]"
                                )}
                                onClick={() => setActiveFilter(filter)}
                            >
                                {filter}
                            </Button>
                        ))}
                    </div>

                    {/* Item Cards Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Item cards will be mapped here */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Store;
