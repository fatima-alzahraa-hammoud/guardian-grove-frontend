import React from "react";
import Navbar from "../components/dashboardComponents/NavBar";
import Sidebar from "../components/dashboardComponents/Sidebar";
const Main : React.FC = () => {

    return(
        <div>
            <Navbar />
            <Sidebar />
        </div>
    );
}
export default Main;