import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '../ui/dropdown-menu';

// Custom Icons
import profileImage from '../../assets/images/dashboard/profile.png';
import notesImage from '../../assets/images/dashboard/notes.png';
import familyImage from '../../assets/images/dashboard/family.png';
import tipsImage from '../../assets/images/dashboard/tips.png';
import adventureImage from '../../assets/images/dashboard/adventures.png';
import achievementsImage from '../../assets/images/dashboard/achievements.png';
import exploreImage from '../../assets/images/dashboard/exploreAndLearn.png';
import funImage from '../../assets/images/dashboard/funZone.png';
import calendarImage from '../../assets/images/dashboard/calendar.png';

import "../../styles/sidebar.css";

const Sidebar: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div
            className={`h-[calc(100vh-4rem)] bg-purple-100 ${
                collapsed ? 'w-20' : 'w-64'
            } transition-all duration-300 flex flex-col justify-between fixed top-16 left-0`}
        >
            <div>
                {/* Sidebar Header */}
                <div className="pt-4 flex justify-end pr-2">
                    <Button
                        variant="ghost"
                        onClick={toggleSidebar}
                        size="icon"
                        className="text-black hover:bg-[#3A8EBA] hover:text-white"
                    >
                        {collapsed ? <ChevronRight /> : <ChevronLeft />}
                    </Button>
                </div>

                {/* User Info */}
                <div className="flex flex-col items-center mt-4">
                    <div className="w-14 h-14 bg-white rounded-full mb-2">
                        <img src={profileImage} alt="User Profile" className="w-full h-full rounded-full" />
                    </div>
                    {!collapsed && (
                        <h1 className="text-md font-semibold">Name</h1>
                    )}
                </div>

                {/* Sidebar Items with Scroll */}
                <nav
                    className="flex flex-col space-y-2 mt-6 overflow-y-auto custom-scrollbar"
                    style={{ maxHeight: '47vh' }}
                >
                    <SidebarItem icon={profileImage} label="My Profile" collapsed={collapsed} />
                    <SidebarItem icon={notesImage} label="My Notes" collapsed={collapsed} />
                    
                    {/* Family Dropdown (Shadcn Dropdown) */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div
                                className={`flex items-center text-sm text-black px-6 py-2 hover:bg-purple-200 ${
                                collapsed ? 'justify-center' : 'pl-10'
                                } cursor-pointer`}
                            >
                                <div className="w-4 h-4">
                                <img src={familyImage} alt="Family" className="w-full h-full" />
                                </div>
                                {!collapsed && (
                                <>
                                    <span className="ml-4">Family</span>
                                    <ChevronDown className="ml-auto w-4 h-4 text-gray-500" />
                                </>
                                )}
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-40 ml-12">
                            <DropdownMenuItem>Family Tree</DropdownMenuItem>
                            <DropdownMenuItem>Family Journal</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <SidebarItem icon={tipsImage} label="AI Tips & Alerts" collapsed={collapsed} />
                    <SidebarItem icon={adventureImage} label="Adventures & Goals" collapsed={collapsed} />
                    <SidebarItem icon={achievementsImage} label="Achievements" collapsed={collapsed} />
                    <SidebarItem icon={exploreImage} label="Explore & Learn" collapsed={collapsed} />
                    <SidebarItem icon={funImage} label="Fun Zone" collapsed={collapsed} />
                    <SidebarItem icon={calendarImage} label="Calendar" collapsed={collapsed} />
                </nav>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-around pb-8">
                <FooterIcon icon={<LogOut />} />
                <FooterIcon icon={<Settings />} />
            </div>
        </div>
    );
};

export default Sidebar;

// Sidebar Item Component
function SidebarItem({
    icon,
    label,
    collapsed,
}: {
    icon: string;
    label: string;
    collapsed: boolean;
}) {
  return (
    <div
        className={`flex items-center text-sm text-black px-6 py-2 hover:bg-purple-200 cursor-pointer ${
            collapsed ? 'justify-center' : 'pl-10'
        }`}
    >
        <div className="w-4 h-4">  {/* Smaller icon size */}
            <img src={icon} alt={label} className="w-full h-full" />
        </div>
        {!collapsed && <span className="ml-4">{label}</span>}  {/* Spacing between icon and text */}
    </div>
  );
}

// Footer Icon Component
function FooterIcon({ icon }: { icon: JSX.Element }) {
    return (
        <div className="text-black text-md hover:text-purple-500 cursor-pointer">
        {React.cloneElement(icon, { size: 16 })}
        </div>
    );
}
