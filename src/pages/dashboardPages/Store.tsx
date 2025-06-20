import React, { useEffect, useState } from "react";
import coinIcon from "/assets/images/coins.png";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import StoreItem from "../../components/cards/StoreItem";
import { useDispatch, useSelector } from "react-redux";
import { selectCoins, selectPurchasedItems, setCoins, setPurchasedItems } from "../../redux/slices/userSlice";
import { requestApi } from "../../libs/requestApi";
import { requestMethods } from "../../libs/enum/requestMethods";
import { toast, ToastContainer } from "react-toastify";

interface StoreItemType {
    _id: string;
    name: string;
    price: number;
    image: string;
    type: string;
}

const Store: React.FC = () => {

    let coins = useSelector(selectCoins);
    const dispatch = useDispatch();
    const purchasedItems = useSelector(selectPurchasedItems); ;
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
                }
            } catch (error: unknown) {
                console.log("error fetching purchased items", error);
            }
        }
        fetchPurchasedItems();
    }, [dispatch]);

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
            } catch (error: unknown) {
                console.log("error fetching store items", error);
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

    const handleBuy = async(itemId: string, price: number) =>{
        try{
            const response = await requestApi({
                route: '/store/buy',
                method: requestMethods.POST,
                body: {itemId}
            });
            if(response){
                const purchasedItem = storeItems.find(item => item._id === itemId);

                dispatch(setPurchasedItems([...purchasedItems, response.item._id]));
                // Update the user's coin balance
                dispatch(setCoins(coins - price));
                coins = coins-price;

                // Show success toast with item name
                toast.success(`${purchasedItem?.name || 'Item'} purchased successfully!`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
            else{
                toast.error(response.error);
            }
        }catch(error){
            console.log("Error buying item", error);
        }
    }

    return (
        <div className="pt-28 min-h-screen flex justify-center">
            <ToastContainer className='text-xs'/>
            <div className="max-w-6xl w-full flex-grow font-poppins">
                {/* Header */}
                <div className="mb-10 flex items-center justify-between">
                    <div className="text-left">
                        <h2 className="text-2xl font-bold font-comic">Welcome to your Magic Store</h2>
                        <p className="text-gray-600 mt-2 text-base">
                            Spend your hard-earned coins to customize your Magic Garden and unlock rewards!
                        </p>
                    </div>

                    {/* Coin Button */}
                    <div className="flex items-center justify-between bg-[#FFC85B] px-5 py-2 rounded-full cursor-pointer hover:bg-yellow-300 transition">
                        <img src={coinIcon} alt="coin" className="w-6 h-6 mr-2" />
                        <span className="font-semibold text-lg ml-2">{coins}</span>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="flex flex-wrap gap-3">
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
                    {filteredItems.map((item) => (
                        <StoreItem
                            key={item._id}
                            image={item.image}
                            name={item.name}
                            price={item.price}
                            purchased={purchasedItems.includes(item._id)}
                            onBuy={() => handleBuy(item._id, item.price)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Store;
