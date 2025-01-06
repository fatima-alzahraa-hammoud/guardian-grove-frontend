import React, { useState } from 'react';
import {
  User,
  NotebookPen,
  Users,
  Bell,
  Map,
  Trophy,
  BookOpen,
  Gamepad2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut,
} from 'lucide-react';
import { Button } from '../ui/button';

const Sidebar :React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div
            className={`h-screen bg-purple-100 ${
                collapsed ? 'w-20' : 'w-64'
            } transition-all duration-300 flex flex-col justify-between`}
        >
            <div>
                {/* Sidebar Header */}
                <div className="pr-2 pt-1 flex justify-end">
                    <Button variant="ghost" onClick={toggleSidebar} size="icon" className="text-black hover:bg-[#3A8EBA] hover:text-white">
                        {collapsed ? <ChevronRight /> : <ChevronLeft />}
                    </Button>
                </div>

                {/* User Info */}
                <div className="flex flex-col items-center mt-2">
                    <div className="w-16 h-16 bg-white rounded-full mb-2"></div>
                    {!collapsed && (
                        <h1 className="text-lg font-semibold">name</h1>
                    )}
                </div>

                {/* Sidebar Items */}
                <nav className="flex flex-col space-y-5 mt-5">
                    <SidebarItem icon={<User />} label="My Profile" collapsed={collapsed} />
                    <SidebarItem icon={<NotebookPen />} label="My Notes" collapsed={collapsed} />
                    <SidebarItem icon={<Users />} label="Family" collapsed={collapsed} />
                    <SidebarItem icon={<Bell />} label="AI Tips & Alerts" collapsed={collapsed} />
                    <SidebarItem icon={<Map />} label="Adventures & Goals" collapsed={collapsed} />
                    <SidebarItem icon={<Trophy />} label="Achievements"  collapsed={collapsed} />
                    <SidebarItem icon={<BookOpen />} label="Explore & Learn" collapsed={collapsed} />
                    <SidebarItem icon={<Gamepad2 />} label="Fun Zone" collapsed={collapsed} />
                    <SidebarItem icon={<CalendarDays />} label="Calendar" collapsed={collapsed} />
                </nav>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-around pb-6">
                <FooterIcon icon={<LogOut />} />
                <FooterIcon icon={<Settings />} />
                <FooterIcon icon={<Settings />} />
            </div>
        </div>
    );
}

export default Sidebar;

// Sidebar Item Component
function SidebarItem({
    icon,
    label,
    collapsed,
}: {
    icon: JSX.Element;
    label: string;
    collapsed: boolean;
}) {
  return (
    <div
        className={`flex items-center space-x-4 text-sm text-black px-4 hover:bg-purple-200 cursor-pointer ${
            collapsed ? 'justify-center' : ''
        }`}
    >
        <div className="w-3 h-3">{icon}</div>
        {!collapsed && <span>{label}</span>}
    </div>
  );
}

// Footer Icon Component
function FooterIcon({ icon }: { icon: JSX.Element }) {
    return (
        <div className="text-black text-md hover:text-purple-500 cursor-pointer">
            {icon}
        </div>
    );
}
