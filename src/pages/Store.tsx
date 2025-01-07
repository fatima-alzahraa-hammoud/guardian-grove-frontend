import React, { useEffect, useState } from "react";
import Navbar from "../components/dashboardComponents/NavBar";
import coinIcon from "../assets/images/coins.png";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import StoreItem from "../components/storeComponents/StoreItem";
import picture1 from "../assets/images/avatars/parent/avatar1.png";
import picture2 from "../assets/images/avatars/parent/avatar2.png";
import picture3 from "../assets/images/avatars/parent/avatar3.png";
import picture4 from "../assets/images/avatars/parent/avatar4.png";
import { useDispatch, useSelector } from "react-redux";
import { selectCoins, selectPurchasedItems, setPurchasedItems } from "../redux/slices/userSlice";
import { requestApi } from "../libs/requestApi";
import { requestMethods } from "../libs/enum/requestMethods";

interface StoreItemType {
    _id: string;
    name: string;
    price: number;
    image: string;
    type: string;
}

const Store: React.FC = () => {

    const coins = useSelector(selectCoins);
    const dispatch = useDispatch();
    let purchasedItems =useSelector(selectPurchasedItems); ;
    const [storeItems, setStoreItems] = useState<StoreItemType[]>([]);
    const [activeFilter, setActiveFilter] = useState<string>("All");

    const filters = ["All", "Garden Items", "Pets", "Themes", "Gifts", "Games", "Purchased"];

    useEffect(() =>{
        const fetchPurchasedItems = async () => {
            try {
                const response = await requestApi({
                    route: '/users/purchasedItems',
                    method: requestMethods.GET,
                });
                if (response){
                    dispatch(setPurchasedItems(response.purchasedItems));
                    purchasedItems = useSelector(selectPurchasedItems);
                }
            } catch (error) {
                console.log("error fetching purchased items");
            }
        }
        fetchPurchasedItems();
    }, []);

    useEffect(() =>{
        const fetchStoreItems = async () => {
            try {
                const response = await requestApi({
                    route: '/store',
                    method: requestMethods.GET,
                });
                if (response){
                    setStoreItems(response.items);
                }
            } catch (error) {
                console.log("error fetching store items");
            }
        }
        fetchStoreItems();
    }, []);

    const filteredItems = storeItems.filter((item) => {
        if (activeFilter === "Purchased") {
            return purchasedItems.includes(item._id);
        }
        if (activeFilter === "All") {
            return true;
        }
        return item.type === activeFilter;
    });

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
                            <span className="font-semibold text-lg ml-2">{coins}</span>
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
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-5">
                        <StoreItem image={coinIcon} name="coinn" price={10} purchased={false}/>
                        <StoreItem image={picture1} name="coinn" price={10} purchased={false}/>
                        <StoreItem image={picture2} name="coinn" price={10} purchased={false}/>
                        <StoreItem image={picture3} name="coinn" price={10} purchased={false}/>
                        <StoreItem image={picture4} name="coinn" price={10} purchased={true}/>
                        <StoreItem image={coinIcon} name="coinn" price={10} purchased={false}/>
                        <StoreItem image={coinIcon} name="coinn" price={10} purchased={true}/>
                        <StoreItem image={coinIcon} name="coinn" price={10} purchased={false}/>
                        <StoreItem image={coinIcon} name="coinn" price={10} purchased={false}/>
                        <StoreItem image={coinIcon} name="coinn" price={10} purchased={false}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Store;
