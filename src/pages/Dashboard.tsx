import React from "react";
import Navbar from "../components/dashboardComponents/NavBar";
import { Route, Routes } from "react-router-dom";
import Store from "./dashboardPages/Store";
import Main from "./dashboardPages/MainDashboard";
import AIFriend from "./dashboardPages/AIFriend";

const Dashboard : React.FC = () => {

    return(
        <div>
            <Navbar />
            <Routes>
                <Route path="/" element={<Main />}/>
                <Route path="/store" element={<Store />}/>
                <Route path="/AIFriend" element={<AIFriend />}/>
            </Routes>
        </div>
    );
}
export default Dashboard;