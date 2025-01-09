import React, { useState } from "react";
import Sidebar from "../../components/dashboardComponents/Sidebar";
import Achievements from "../../components/dashboardComponents/Achievements";
import MyProfile from "../../components/dashboardComponents/MyProfile";

const Main : React.FC = () => {

    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [activeSection, setActiveSection] = useState<string>('profile');

    const renderContent = () => {
        switch (activeSection) {
            case 'profile':
                return <MyProfile />;
            case 'notes':
                return <div className="pt-20">Notes Content</div>;
            case 'achievements':
                return <Achievements />;
            default:
                return <div>Select a section</div>;
        }
    };

    return(
        <div className="flex">
            <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} collapsed={collapsed} setCollapsed={setCollapsed} />

            {/* Main Content Area */}
            <div className={` pt-8 flex-grow max-w-[1200px] w-full mx-auto transition-all duration-300 text-left ${collapsed ? 'ml-20' : 'ml-64'}`}>
                {renderContent()}
            </div>

        </div>
    );
}
export default Main;