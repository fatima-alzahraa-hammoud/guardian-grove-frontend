import React, { useState } from "react";
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel
} from "@headlessui/react";
import {
    Bars3Icon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../ui/button";
import { Search, ShoppingCart, Star } from "lucide-react";
import "../../styles/global.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAvatar, selectStars } from "../../redux/slices/userSlice";

// Classnames utility function
function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}
  
const Navbar: React.FC= () => {

    const stars = useSelector(selectStars);
    const avatar = useSelector(selectAvatar);

    const navigate = useNavigate();

    const [navigation, setNavigation] = useState([
        { name: "Main", href: "#", current: true },
        { name: "AI Friend", href: "#", current: false },
        { name: "Magic garden", href: "#", current: false },
        { name: "Leaderboard", href: "#", current: false },
    ]);

    const handleNavigationClick = (clickedItem: string) => {
        setNavigation(prevNav =>
            prevNav.map(item =>
                item.name === clickedItem
                    ? { ...item, current: true }
                    : { ...item, current: false }
            )
        );
    };

    return (
        <Disclosure as="nav" className='bg-purple-100 fixed top-0 left-0 w-full z-50'>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-12">
                <div className="relative flex items-center justify-between h-16">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        {/* Mobile menu button */}
                        <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-[#3A8EBA] hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                            <XMarkIcon className="hidden h-6 w-6" aria-hidden="true" />
                        </DisclosureButton>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex shrink-0 items-center">
                            <img
                                className="h-12 w-auto"
                                src="src/assets/logo/GuardianGrove_logo_NoText.png"
                                alt="Your Company"
                            />
                        </div>
                        <div className="hidden sm:flex justify-center items-center sm:ml-10"> 
                            <div className="flex space-x-4">
                                {navigation.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => handleNavigationClick(item.name)}
                                        className={classNames(
                                        item.current
                                            ? "bg-[#3A8EBA] text-white"
                                            : "text-black hover:bg-[#3A8EBA60] hover:text-black",
                                            "rounded-md px-3 py-1 text-md font-extrabold font-comic"
                                        )}
                                        aria-current={item.current ? "page" : undefined}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <div className="ml-auto flex items-center space-x-4">

                            <div className="relative p-[2px] rounded-full border-rotate-wrapper">
                                <div className="border-[1.5px] border-dashed border-[#FFC85B] rounded-full border-rotate h-10 w-10"></div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="p-1 focus:outline-none relative h-8 w-8 rounded-full bg-[#FFC85B] hover:bg-[#FFC85B] non-rotating-button"
                                >
                                    <ShoppingCart className="h-6 w-6 text-white fill-white" />
                                    <span className="sr-only">Shopping cart</span>
                                </Button>
                            </div>

                            <div className="relative p-[2px] rounded-full border-rotate-wrapper">
                                <div className="border-[1.5px] border-dashed border-[#FA9DB7] rounded-full border-rotate h-10 w-10"></div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="p-1 h-8 w-8 rounded-full bg-[#FA9DB7] hover:bg-[#FA9DB7] non-rotating-button"
                                >
                                    <Search className="h-6 w-6 text-white" />
                                </Button>
                            </div>

                            <Button
                                variant="ghost"
                                className="flex h-7 items-center gap-3 rounded-full bg-white px-2 text-[#FFC044] justify-center pt-3 pb-3 hover:bg-[#fcf7ef] hover:text-[#FFC044]"
                                size="sm"
                            >
                                <Star className="h-4 w-4" />
                                <span className="text-[13px] font-medium">{stars}</span>
                            </Button>

                        </div>
                    </div>
                </div>
            </div>

            <DisclosurePanel className="sm:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2">
                    {navigation.map((item) => (
                        <DisclosureButton
                            key={item.name}
                            as="a"
                            href={item.href}
                            onClick={() => handleNavigationClick(item.name)}
                            className={classNames(
                                item.current
                                    ? "bg-[#3A8EBA] text-white"
                                    : "text-black hover:bg-[#3A8EBA60] hover:text-black",
                                "block rounded-md px-3 py-2 text-base font-extrabold font-comic"
                            )}
                            aria-current={item.current ? "page" : undefined}
                        >
                            {item.name}
                        </DisclosureButton>
                    ))}
                </div>
            </DisclosurePanel>
        </Disclosure>
    );
};

export default Navbar;
