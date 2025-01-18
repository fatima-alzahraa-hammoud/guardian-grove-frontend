import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '../ui/button';

// Custom Icons
import profileImage from '/assets/images/dashboard/profile.png';
import notesImage from '/assets/images/dashboard/notes.png';
import familyImage from '/assets/images/dashboard/family.png';
import tipsImage from '/assets/images/dashboard/tips.png';
import adventureImage from '/assets/images/dashboard/adventures.png';
import achievementsImage from '/assets/images/dashboard/achievements.png';
import exploreImage from '/assets/images/dashboard/exploreAndLearn.png';
import funImage from '/assets/images/dashboard/funZone.png';
import calendarImage from '/assets/images/dashboard/calendar.png';
import settingsImage from '/assets/images/dashboard/settings.svg';
import logoutImage from '/assets/images/dashboard/logout.svg';
import infoImage from '/assets/images/dashboard/badge-info.svg';
import "../../styles/sidebar.css";
import { useDispatch, useSelector } from 'react-redux';
import { selectGender } from '../../redux/slices/userSlice';
import { logout } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeSection: string;
  setActiveSection: React.Dispatch<React.SetStateAction<string>>;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection, collapsed, setCollapsed }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isFamilyOpen, setIsFamilyOpen] = useState(false);
  const gender = useSelector(selectGender);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  }

  return (
    <div className="flex">
      <div
        className={classNames(
            "h-[calc(100vh-4rem)] transition-all duration-300 flex flex-col justify-between fixed top-16 left-0",
            collapsed ? "w-20" : "w-64",
            gender === "female" ? "bg-purple-100" : "bg-[#E3F2FD]"
          )}        
        >
        <div>
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


          <nav className="flex flex-col space-y-2 mt-6 overflow-y-auto md:custom-scrollbar md:max-h-[50vh] lg:max-h-screen">
            <SidebarItem icon={profileImage} label="My Profile" collapsed={collapsed} onClick={() => setActiveSection('profile')} isActive={activeSection === 'profile'} />
            <SidebarItem icon={notesImage} label="My Notes" collapsed={collapsed} onClick={() => setActiveSection('notes')} isActive={activeSection === 'notes'} />

            {/* Family Dropdown */}
            <div
              className={`flex flex-col ${collapsed ? 'items-center' : ''}`}
            >
              <div
                className={`flex items-center text-sm text-black hover:text-black px-6 py-2 hover:bg-[#3a8dba89] ${
                  collapsed ? 'justify-center' : 'pl-10'
                } cursor-pointer`}
                onClick={() => setIsFamilyOpen(!isFamilyOpen)}
              >
                <div className="w-4 h-4">
                  <img src={familyImage} alt="Family" className="w-full h-full" />
                </div>
                {!collapsed && (
                  <>
                    <span className="ml-4">Family</span>
                    {isFamilyOpen ? <ChevronUp className="ml-auto w-4 h-4" /> : <ChevronDown className="ml-auto w-4 h-4" />}
                  </>
                )}
              </div>
              {isFamilyOpen && !collapsed && (
                <div className="ml-10">
                  <SidebarItem label="Family Tree" collapsed={collapsed} onClick={() => setActiveSection('familyTree')} isActive={activeSection === 'familyTree'} />
                  <SidebarItem label="Family Journal" collapsed={collapsed} onClick={() => setActiveSection('familyJournal')} isActive={activeSection === 'familyJournal'} />
                </div>
              )}
            </div>

            <SidebarItem icon={tipsImage} label="AI Tips & Alerts" collapsed={collapsed} onClick={() => setActiveSection('notifications')} isActive={activeSection === 'notifications'} />
            <SidebarItem icon={adventureImage} label="Adventures & Goals" collapsed={collapsed} onClick={() => setActiveSection('goals&adventures')} isActive={activeSection === 'goals&adventures'} />
            <SidebarItem icon={achievementsImage} label="Achievements" collapsed={collapsed} onClick={() => setActiveSection('achievements')} isActive={activeSection === 'achievements'} />
            <SidebarItem icon={exploreImage} label="Explore & Learn" collapsed={collapsed} onClick={() => setActiveSection('explore&learn')} isActive={activeSection === 'explore&learn'} />
            <SidebarItem icon={funImage} label="Fun Zone" collapsed={collapsed} onClick={() => setActiveSection('funZone')} isActive={activeSection === 'funZone'} />
            <SidebarItem icon={calendarImage} label="Calendar" collapsed={collapsed} onClick={() => setActiveSection('calendar')} isActive={activeSection === 'calendar'} />
          </nav>
        </div>

        <div className="flex justify-between pt-3 pb-6 pl-9 pr-9">
          <FooterIcon icon={logoutImage} onClick={handleLogout}/>
          <FooterIcon icon={infoImage} />
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
    icon?: string;
    label: string;
    collapsed: boolean;
    onClick: () => void;
    isActive: boolean,
}) {
    return (
        <div
            onClick={onClick}
            className={`flex items-center text-sm text-black px-6 py-3 hover:bg-[#3a8dba89] cursor-pointer hover:text-black ${
                isActive ? 'bg-[#3A8EBA] text-white' : 'hover:bg-[#3a8dba89] hover:text-black'
            } ${ collapsed ? 'justify-center' : 'pl-10' }`}
        >
          {icon &&
            <div className="w-5 h-5">
                <img src={icon} alt={label} className="w-full h-full" />
            </div>
          }
            {!collapsed && <span className="ml-4">{label}</span>}
          
        </div>
    );
}

// Footer Icon Component
function FooterIcon({ icon, onClick }: { icon: string; onClick?: () => void }) {
  return (
      <div
          className="text-black hover:text-[#3a8dba89] cursor-pointer transition-all duration-300 ease-in-out hover:scale-110"
          onClick={onClick}
      >
          <img src={icon} alt="footer icon" className="w-4 h-4" />
      </div>
  );
}