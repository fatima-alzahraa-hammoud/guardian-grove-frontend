import React, { useState } from "react";
import AdminSidebar from "../admin/AdminSidebar";
import AdminDashboard from "../admin/AdminDashboard";
import Users from "../admin/users";


const Admin : React.FC = () => {
    const [activeSection, setActiveSection] = useState<string>('dashboard');

    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return <AdminDashboard />;
            case 'users':
                return <Users />
            default:
                return <div>Select a section</div>;
        }
    };
    return(
        <div className="flex">
            <AdminSidebar setActiveSection={setActiveSection} />

            {/* Main Content Area */}
            <div className={`flex-grow w-full mx-auto transition-all duration-300 text-left`}>
                {renderContent()}
            </div>

        </div>
    );
}
export default Admin;