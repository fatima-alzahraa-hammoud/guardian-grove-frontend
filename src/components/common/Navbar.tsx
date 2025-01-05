import React from "react";
import {
    Disclosure,
    DisclosureButton,
} from "@headlessui/react";
import {
    Bars3Icon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import "../../styles/global.css";

const Navbar: React.FC = () => {

    return (
        <Disclosure as="nav" className='bg-[#F3E5F5]'>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-12">
                <div className="relative flex items-center justify-between h-16">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        {/* Mobile menu button */}
                        <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
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
                        
                    </div>
                </div>
            </div>

            
        </Disclosure>
    );
};

export default Navbar;
