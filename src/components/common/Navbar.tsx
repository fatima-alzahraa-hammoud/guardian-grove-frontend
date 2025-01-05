import React, { useEffect, useState } from "react";
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from "@headlessui/react";
import {
    Bars3Icon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../ui/button";
import { Search, ShoppingCart, Star } from "lucide-react";
import "../../styles/global.css";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { requestApi } from "../../libs/requestApi";
import { requestMethods } from "../../libs/enum/requestMethods";

// Classnames utility function
function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

interface DecodedToken {
    userId: string;
    role: string;
}

const Navbar: React.FC = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [stars, setStars] = useState<number>(0);

    const navigate = useNavigate();

    const [navigation, setNavigation] = useState([
        { name: "Home", href: "#", current: true },
        { name: "Features", href: "#", current: false },
        { name: "About Us", href: "#", current: false },
        { name: "Contact Us", href: "#", current: false },
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

    const token = localStorage.getItem("token");
    
    useEffect(() =>{
        if (token){
            const decoded = jwtDecode<DecodedToken>(token);
            console.log("Decoded token:", decoded); 
            setUserId(decoded.userId);
        }
    }, []);

    // Fetch stars from the API
    useEffect(() => {
        const fetchStars = async () => {
            if (userId) {
                try {
                    const response = await requestApi({
                        route: "/users/stars",
                        method: requestMethods.GET,
                        body: userId
                    });
        
                    if (response) {
                        setStars(response.stars);

                    } else {
                        console.log(response.message || 'Get stars failed!');
                    }
                } catch (error) {
                    console.log('An error occurred during getting the stars.');
                }
            }
        }

        fetchStars();
    }, [userId]);    

    return (
        <Disclosure as="nav" className='bg-[#F3E5F5]'>
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
                        <div className={`hidden sm:flex justify-center items-center sm:ml-10 ${userId ? 'sm:justify-start' : 'sm:justify-center sm:ml-56'}`}> 
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
                        
                        {userId ? (
                            <>
                                <div className="ml-auto flex items-center space-x-4">
                                    <Button
                                        variant="ghost"
                                        className="flex h-7 items-center gap-3 rounded-full bg-white px-2 text-[#FFC044] justify-center pt-3 pb-3 hover:bg-[#fcf7ef] hover:text-[#FFC044]"
                                        size="sm"
                                    >
                                        <Star className="h-4 w-4" />
                                        <span className="text-[13px] font-medium">{stars}</span>
                                    </Button>

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

                                </div>

                                {/* Profile dropdown */}
                                <Menu as="div" className="relative ml-4">
                                    <div>
                                        <MenuButton className="relative flex rounded-full bg-[#F3E5F5] text-sm focus:outline-none">
                                            <div className="relative p-[2px] rounded-full border-rotate-wrapper">
                                                <div className="border-[1.5px] border-dashed border-[#1140A6] rounded-full border-rotate h-12 w-12"></div>
                                                <img
                                                    className="avatar-image h-10 w-10 rounded-full"
                                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                    alt=""
                                                />
                                            </div>
                                        </MenuButton>
                                    </div>
                                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <MenuItem>
                                            {({ active }) => (
                                                <a
                                                    href="#"
                                                    className={classNames(
                                                        active ? "bg-gray-100" : "",
                                                        "block px-4 py-2 text-sm text-black"
                                                    )}
                                                >
                                                    Dashboard
                                                </a>
                                            )}
                                        </MenuItem>
                                        <MenuItem>
                                            {({ active }) => (
                                                <a
                                                    href="#"
                                                    className={classNames(
                                                        active ? "bg-gray-100" : "",
                                                        "block px-4 py-2 text-sm text-black"
                                                    )}
                                                >
                                                    Settings
                                                </a>
                                            )}
                                        </MenuItem>
                                        <MenuItem>
                                            {({ active }) => (
                                                <a
                                                    href="#"
                                                    className={classNames(
                                                        active ? "bg-gray-100" : "",
                                                        "block px-4 py-2 text-sm text-black"
                                                    )}
                                                >
                                                    Log out
                                                </a>
                                            )}
                                        </MenuItem>
                                    </MenuItems>
                                </Menu>
                            </>
                        ) :(
                            <Button
                                onClick={() => {navigate('/')}}
                                variant="ghost"
                                className="w-full sm:mr-28 flex items-center justify-center rounded-full px-6 py-2 bg-[#3A8EBA] text-white hover:bg-[#326E9F] hover:text-white"
                            >
                                Login
                            </Button>
                        )}
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
