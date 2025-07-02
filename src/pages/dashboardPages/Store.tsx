import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

// Floating background elements (same as Achievements)
const FloatingElements = React.memo(() => {
    const particlePositions = React.useMemo(() => 
        Array.from({ length: 8 }, () => ({
            left: Math.random() * 100,
            top: Math.random() * 100,
            delay: Math.random() * 2,
            duration: 4 + Math.random() * 2
        })), []
    );

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Animated gradient orbs using vibrant theme colors */}
            {Array.from({ length: 4 }).map((_, i) => (
                <motion.div
                    key={`orb-${i}`}
                    className="absolute rounded-full blur-3xl"
                    style={{
                        width: `${100 + i * 50}px`,
                        height: `${100 + i * 50}px`,
                        left: `${10 + i * 25}%`,
                        top: `${20 + i * 15}%`,
                    }}
                    animate={{
                        x: [0, 50, -30, 0],
                        y: [0, -30, 20, 0],
                        scale: [1, 1.2, 0.8, 1],
                    }}
                    transition={{
                        duration: 15 + i * 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 2
                    }}
                />
            ))}

            {/* Floating particles with vibrant colors */}
            {particlePositions.map((position, i) => (
                <motion.div
                    key={`particle-${i}`}
                    className="absolute w-2 h-2 rounded-full opacity-30"
                    style={{
                        backgroundColor: [
                            "#3A8EBA", // Primary blue
                            "#F09C14", // Orange
                            "#179447", // Green
                            "#8B5CF6"  // Purple
                        ][i % 4],
                        left: `${position.left}%`,
                        top: `${position.top}%`,
                    }}
                    animate={{
                        y: [0, -20, 0],
                        opacity: [0.2, 0.6, 0.2],
                    }}
                    transition={{
                        duration: position.duration,
                        repeat: Infinity,
                        delay: position.delay,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
});

// Simple Enhanced Empty State (same style as Achievements)
const EmptyState = ({ activeFilter }: { activeFilter: string }) => {
    return (
        <motion.div 
            className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-300px)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <motion.h3 
                className="text-2xl font-bold text-[#3A8EBA] mb-4 font-comic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
                No {activeFilter} Items Available
            </motion.h3>

            <motion.p 
                className="text-gray-600 text-base mb-8 max-w-md mx-auto leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
            >
                {activeFilter === "Purchased" 
                    ? "You haven't purchased any items yet. Start shopping to build your collection!"
                    : "Check back soon for new exciting items to enhance your magical experience!"
                }
                <br />
                <span className="font-semibold text-[#3A8EBA]">Happy shopping!</span>
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
            >
                <motion.img
                    src="/assets/images/happyShopping.png"
                    alt="Shopping Illustration"
                    className="w-56 h-56 mx-auto"
                    animate={{
                        y: [0, -10, 0],
                        rotate: [0, 2, -2, 0]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </motion.div>
        </motion.div>
    );
};

const Store: React.FC = () => {
    let coins = useSelector(selectCoins);
    const dispatch = useDispatch();
    const purchasedItems = useSelector(selectPurchasedItems);
    const [storeItems, setStoreItems] = useState<StoreItemType[]>([]);
    const [activeFilter, setActiveFilter] = useState<string>("All");
    const [loading, setLoading] = useState(true);
    const filters = ["All", "Garden Items", "Pets", "Themes", "Gifts", "Games", "Purchased"];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [purchasedResponse, storeResponse] = await Promise.allSettled([
                    requestApi({
                        route: '/users/purchasedItems',
                        method: requestMethods.GET,
                    }),
                    requestApi({
                        route: '/store',
                        method: requestMethods.GET,
                    })
                ]);

                if (purchasedResponse.status === 'fulfilled' && purchasedResponse.value) {
                    dispatch(setPurchasedItems(purchasedResponse.value.purchasedItems));
                }

                if (storeResponse.status === 'fulfilled' && storeResponse.value) {
                    setStoreItems(storeResponse.value.items);
                }
            } catch (error: unknown) {
                console.log("Error fetching store data", error);
                toast.error("Failed to load store data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dispatch]);

    const filteredItems = storeItems.filter((item) => {
        if (activeFilter === "Purchased") {
            return purchasedItems.includes(item._id);
        }
        if (activeFilter === "All") {
            return true;
        }
        return item.type === activeFilter;
    });

    const handleBuy = async (itemId: string, price: number) => {
        try {
            const response = await requestApi({
                route: '/store/buy',
                method: requestMethods.POST,
                body: { itemId }
            });
            
            if (response) {
                const purchasedItem = storeItems.find(item => item._id === itemId);
                dispatch(setPurchasedItems([...purchasedItems, response.item._id]));
                dispatch(setCoins(coins - price));
                coins = coins - price;
                
                toast.success(`${purchasedItem?.name || 'Item'} purchased successfully!`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                toast.error(response.error);
            }
        } catch (error) {
            console.log("Error buying item", error);
            toast.error("Failed to purchase item");
        }
    };

    return (
        <div className="pt-24 min-h-screen flex justify-center relative overflow-hidden">
            {/* Floating Background Elements */}
            <FloatingElements />
            
            <ToastContainer className='text-xs'/>
            
            <div className={`w-full flex-grow font-poppins mx-auto px-4 relative z-10 max-w-6xl`}>
                
                {/* Header - Clean and Minimal (same as Achievements) */}
                <motion.div 
                    className="text-left mb-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-2xl font-bold font-comic text-gray-800 mb-2">
                        Magic Store
                    </h2>
                    <div className="h-1 w-24 bg-[#3A8EBA] rounded-full mb-4" />
                    <p className="text-gray-600 text-base">
                        Spend your hard-earned coins to customize your Magic Garden and unlock rewards!
                    </p>
                </motion.div>

                {/* Controls Section (same layout as Achievements) */}
                <motion.div 
                    className="flex items-center justify-between mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    {/* Filters Section */}
                    <div className="flex flex-wrap gap-3">
                        {filters.map((filter, index) => (
                            <motion.div
                                key={filter}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                            >
                                <Button
                                    onClick={() => setActiveFilter(filter)}
                                    variant="secondary"
                                    className={cn(
                                        "bg-[#E3F2FD] hover:bg-[#d7edfd] text-gray-700 font-medium transition-all duration-300 px-6 py-3 rounded-full border border-[#3A8EBA]/20",
                                        activeFilter === filter &&
                                            "bg-[#3A8EBA] text-white hover:bg-[#347ea5] border-[#3A8EBA]"
                                    )}
                                >
                                    {filter}
                                </Button>
                            </motion.div>
                        ))}
                    </div>

                    {/* Coin Display (styled like sort button in Achievements) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        <motion.div 
                            className="flex items-center bg-[#FFC85B] px-4 py-3 rounded-full cursor-pointer hover:bg-[#ffbf42] transition-colors duration-300 border border-[#FFC85B]/20 shadow-lg"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <img 
                                src={coinIcon} 
                                alt="coin" 
                                className="w-4 h-4 mr-2" 
                            />
                            <span className="text-sm font-semibold text-white">
                                {coins} Coins
                            </span>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Loading State (same as Achievements) */}
                {loading && (
                    <motion.div 
                        className="flex justify-center items-center py-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <motion.div
                            className="w-12 h-12 border-4 border-[#E3F2FD] border-t-[#3A8EBA] rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                    </motion.div>
                )}

                {/* Content Section (same structure as Achievements) */}
                {!loading && (
                    <AnimatePresence mode="wait">
                        {filteredItems.length > 0 ? (
                            <motion.div
                                key="store-items-grid"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 pb-12">
                                    {filteredItems.map((item, index) => (
                                        <motion.div
                                            key={item._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ 
                                                delay: index * 0.1,
                                                duration: 0.5,
                                                ease: "easeOut"
                                            }}
                                            whileHover={{ 
                                                y: -5,
                                                transition: { duration: 0.3 }
                                            }}
                                        >
                                            <StoreItem
                                                image={item.image}
                                                name={item.name}
                                                price={item.price}
                                                purchased={purchasedItems.includes(item._id)}
                                                onBuy={() => handleBuy(item._id, item.price)}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty-state"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.6 }}
                            >
                                <EmptyState activeFilter={activeFilter} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default Store;