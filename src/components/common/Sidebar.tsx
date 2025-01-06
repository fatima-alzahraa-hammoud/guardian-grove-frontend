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
