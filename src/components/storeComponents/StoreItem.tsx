import React from "react";
import { cn } from "../../lib/utils";
import coinImage from "../../assets/images/coin.png";

interface StoreItemProps {
    name: string
    price: number
    image: string
    purchased?: boolean
}

const StoreItem: React.FC<StoreItemProps> = ({ name, price, image, purchased }) => {
    return (
        <div className="border border-[#3A8EBA] rounded-md hover:shadow-md transition font-poppins">
            <div className="p-5 flex flex-col items-center gap-4">
                {/* Item Image */}
                <div className="w-24 h-24 flex justify-center items-center">
                    <img 
                        src={image}
                        alt={name}
                        className="w-20 h-20 object-contain"
                    />
                </div>

                {/* Item Name */}
                <h4 className="text-lg font-medium text-center">{name}</h4>

                {/* Price Section */}
                <div className="flex items-center gap-4 text-gray-700">
                    <img 
                        src={coinImage}
                        alt="Coins"
                        width={20}
                        height={20}
                        className="w-5 h-5"
                    />
                    <span className="text-md">{price}</span>
                </div>

                {/* Buy Now Button */}
                <button
                    className={cn(
                        "w-3/4 rounded-full font-semibold py-2 text-sm",
                        purchased
                            ? "bg-[#A6A6A6] hover:bg-[#A6A6A6] text-black cursor-not-allowed"
                            : "bg-[#179447] hover:bg-green-600 text-white hover:text-white"
                    )}
                    disabled={purchased}
                >
                    {purchased ? "Purchased" : "Buy Now"}
                </button>
            </div>
        </div>
    );
};

export default StoreItem;
