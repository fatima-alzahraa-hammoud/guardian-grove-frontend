import React from "react";
import { useSelector } from "react-redux";
import { selectName } from "../../redux/slices/userSlice";

const MyProfile : React.FC = () => {

    const name = useSelector(selectName);

    return(
        <div className="pt-20 h-screen flex flex-col font-poppins max-w-5xl px-6 flex-grow">
            {/* Header */}
            <div className="text-left">
                <h1 className="font-comic font-extrabold mb-2 text-lg">Hi, {name}</h1>
                <p className="text-sm">date</p>
            </div>

            {/* Info */}

            {/* Daily message */}

            {/*Personal progress */}

            {/* Need help */}
        </div>
    );
};

export default MyProfile;