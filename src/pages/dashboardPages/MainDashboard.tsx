import React, { useState } from "react";
import Sidebar from "../../components/dashboardComponents/Sidebar";
import Achievements from "../../components/dashboardComponents/Achievements";

const Main : React.FC = () => {

    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [activeSection, setActiveSection] = useState<string>('profile');

    const renderContent = () => {
        switch (activeSection) {
            case 'profile':
                return <div className="pt-20">Profile Content</div>;
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
            <div className={`p-8 flex-grow transition-all duration-300 text-left ${collapsed ? 'ml-20' : 'ml-64'}`}>
                {renderContent()}
            </div>

        </div>
    );
}
export default Main;