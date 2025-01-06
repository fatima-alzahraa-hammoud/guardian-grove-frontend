import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
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
import settingsImage from '../../assets/images/dashboard/settings.png';
import logoutImage from '../../assets/images/dashboard/logout.png';

import "../../styles/sidebar.css";

const Sidebar: React.FC = () => {
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [activeSection, setActiveSection] = useState<string>('profile');

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className="flex">
            {/* Sidebar */}
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

                    {/* Sidebar Items */}
                    <nav className="flex flex-col space-y-2 mt-6 overflow-y-auto custom-scrollbar"
                        style={{ maxHeight: '50vh' }}>
                        <SidebarItem  icon={profileImage} label="My Profile" collapsed={collapsed} onClick={() => setActiveSection('profile')} isActive={activeSection === 'profile'} />
                        <SidebarItem icon={notesImage} label="My Notes" collapsed={collapsed} onClick={() => setActiveSection('notes')} isActive={activeSection === 'notes'} />

                        {/* Family Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div
                                    className={`flex items-center text-sm text-black hover:text-black px-6 py-2 hover:bg-[#3a8dba89] ${(activeSection === 'familyJournal' || activeSection === 'familyTree' ) ? 'bg-[#3a8dba] text-white' : 'hover:bg-[#3a8dba89]'} ${
                                    collapsed ? 'justify-center' : 'pl-10'
                                    } cursor-pointer`}
                                >
                                    <div className="w-4 h-4 ">
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
                                <DropdownMenuItem onClick={() => setActiveSection('familyTree')} className={`text-black hover:text-black ${activeSection === 'familyTree' ? 'bg-[#3a8dba] text-white' : 'hover:bg-[#3a8dba89]'}`}>
                                    Family Tree
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setActiveSection('familyJournal')} className={`${activeSection === 'familyJournal' ? 'bg-[#3a8dba] text-white' : 'hover:bg-[#3a8dba89]'}`}>
                                    Family Journal
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <SidebarItem icon={tipsImage} label="AI Tips & Alerts" collapsed={collapsed}  onClick={() => setActiveSection('notifications')} isActive={activeSection === 'notifications'}/>
                        <SidebarItem icon={adventureImage} label="Adventures & Goals" collapsed={collapsed} onClick={() => setActiveSection('goals&adventures')} isActive={activeSection === 'goals&adventures'}/>
                        <SidebarItem icon={achievementsImage} label="Achievements" collapsed={collapsed} onClick={() => setActiveSection('achievements')} isActive={activeSection === 'achievements'}/>
                        <SidebarItem icon={exploreImage} label="Explore & Learn" collapsed={collapsed} onClick={() => setActiveSection('explore&learn')} isActive={activeSection === 'explore&learn'}/>
                        <SidebarItem icon={funImage} label="Fun Zone" collapsed={collapsed} onClick={() => setActiveSection('funZone')} isActive={activeSection === 'funZone'}/>
                        <SidebarItem icon={calendarImage} label="Calendar" collapsed={collapsed} onClick={() => setActiveSection('calendar')} isActive={activeSection === 'calendar'} />
                    </nav>
                </div>

                {/* Footer with Custom Images */}
                <div className="flex justify-between pt-6 pb-6 pl-9 pr-9">
                    <FooterIcon icon={logoutImage} />
                    <FooterIcon icon={settingsImage} />
                </div>
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
    onClick,
    isActive,
}: {
    icon: string;
    label: string;
    collapsed: boolean;
    onClick: () => void;
    isActive: boolean,
}) {
    return (
        <div
            onClick={onClick}
            className={`flex items-center text-sm text-black px-6 py-2 hover:bg-[#3a8dba89] cursor-pointer hover:text-black ${
                isActive ? 'bg-[#3A8EBA] text-white' : 'hover:bg-[#3a8dba89] hover:text-black'
            } ${ collapsed ? 'justify-center' : 'pl-10' }`}
        >
            <div className="w-4 h-4">
                <img src={icon} alt={label} className="w-full h-full" />
            </div>
            {!collapsed && <span className="ml-4">{label}</span>}
        </div>
    );
}

// Footer Icon Component
function FooterIcon({ icon }: { icon: string }) {
    return (
        <div className="text-black hover:opacity-75 cursor-pointer">
            <img src={icon} alt="footer icon" className="w-4 h-4" />
        </div>
    );
}
