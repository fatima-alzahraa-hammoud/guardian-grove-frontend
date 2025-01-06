import React from "react";
import Navbar from "../components/common/NavBar";
import Sidebar from "../components/common/Sidebar";
const Main : React.FC = () => {

    return(
        <div>
            <Navbar />
            <Sidebar />
        </div>
    );
}
export default Main;