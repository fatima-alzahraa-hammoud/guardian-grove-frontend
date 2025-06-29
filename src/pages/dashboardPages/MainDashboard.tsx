import React, { useEffect, useState } from "react";
import Sidebar from "../../components/dashboardComponents/Sidebar";
import Achievements from "../../components/dashboardComponents/Achievements";
import MyProfile from "../../components/dashboardComponents/MyProfile";
import FamilyTree from "../../components/dashboardComponents/FamilyTree";
import { useDispatch } from "react-redux";
import { resetChats } from "../../redux/slices/chatSlice";
import GoalsAndAdventures from "../../components/dashboardComponents/GoalsAndAdventures";
import FamilyJournal from "../../components/dashboardComponents/FamilyJournal";
import AINotifications from "../../components/dashboardComponents/AINotifications";
import Notes from "../../components/dashboardComponents/Notes";

const Main : React.FC = () => {

    const dispatch = useDispatch();
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [activeSection, setActiveSection] = useState<string>('profile');

    const renderContent = () => {
        switch (activeSection) {
            case 'profile':
                return <MyProfile />;
            case 'notes':
                return <Notes />;
            case 'achievements':
                return <Achievements collapsed={collapsed}/>;
            case 'familyTree':
                return <FamilyTree collapsed = {collapsed}/>
            case 'familyJournal':
                return <FamilyJournal collapsed = {collapsed}/>
            case 'goals&adventures':
                return <GoalsAndAdventures collapsed={collapsed}/>
            case 'notifications':
                return <AINotifications collapsed={collapsed}/>
            default:
                return <div>Select a section</div>;
        }
    };

    useEffect(() => {
        return () => {
            dispatch(resetChats()); // Reset chats when component unmounts
        };
    }, [dispatch]);

    return(
        <div className="flex">
            <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} collapsed={collapsed} setCollapsed={setCollapsed} />

            {/* Main Content Area */}
            <div className={` pt-8 flex-grow w-full mx-auto transition-all duration-300 text-left ${collapsed ? 'ml-[60px]' : 'ml-64'}`}>
                {renderContent()}
            </div>

        </div>
    );
}
export default Main;