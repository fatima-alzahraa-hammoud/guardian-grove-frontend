import React from "react";
import Navbar from "../components/dashboardComponents/NavBar";
import { Route, Routes } from "react-router-dom";
import Store from "./dashboardPages/Store";
import Main from "./dashboardPages/MainDashboard";
import AIFriend from "./dashboardPages/AIFriend";
import Leaderboard from "./dashboardPages/Leaderboard";
import MagicGarden from "./dashboardPages/MagicGarden";

const Dashboard : React.FC = () => {

    return(
        <div>
            <Navbar />
            <Routes>
                <Route path="/" element={<Main />}/>
                <Route path="/store" element={<Store />}/>
                <Route path="/AIFriend" element={<AIFriend />}/>
                <Route path="/Leaderboard" element={<Leaderboard />}/>
                <Route path="/MagicGarden" element={<MagicGarden />}/>
            </Routes>
        </div>
    );
}
export default Dashboard;