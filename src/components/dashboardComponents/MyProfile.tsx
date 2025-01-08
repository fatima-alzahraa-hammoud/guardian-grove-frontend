import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAvatar, selectName } from "../../redux/slices/userSlice";
import uploadImage from "/assets/images/camera.svg";

const MyProfile : React.FC = () => {

    const name = useSelector(selectName);
    const avatar = useSelector(selectAvatar);
    const [currentDate, setCurrentDate] = useState<string>("");

    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        setCurrentDate(formattedDate);
    }, []);


    return(
        <div className="pt-20 h-screen flex flex-col font-poppins max-w-5xl px-6 flex-grow">
            {/* Header */}
            <div className="text-left">
                <h1 className="font-comic font-extrabold mb-2 text-lg">Hi, {name}</h1>
                <p className="text-sm">{currentDate}</p>
            </div>

            {/* Info */}
            <div className="flex space-x-6 pt-10">
                <div className="flex bg-[#3A8EBA] p-6 rounded-lg w-3/5">

                    <div className="flex flex-col pl-2 items-center">
                        {/* Image */}
                        <div className="relative">
                            <img 
                                className="w-20 h-20 bg-purple-100 rounded-full"
                                src={avatar || "https://via.placeholder.com/150"}
                                alt="User Avatar"
                            />
                            <span className="absolute bottom-2 right-0.5 transform translate-y-1/4 w-5 h-5 bg-white rounded-full flex items-center justify-center z-10">
                                <img
                                    src={uploadImage}
                                    alt="Camera Icon"
                                    className="w-4 h-4"
                                />
                            </span>       
                        </div>
                        <p className="pt-3 text-sm text-white">Child</p>
                    </div>

                    
                    {/* Details */}
                    <div className="text-white text-xs space-y-3 pl-4 pt-1">
                        <p className="font-bold">{name}</p>
                        <p><span className="font-bold">Birthday: </span></p>
                        <p><span className="font-bold">Member since: </span></p>
                        <p><span className="font-bold">Family email: </span></p>
                        <button className="pl-3 pr-3 pt-2 pb-2 bg-white rounded-full text-black border-[1px] border-[#FDE4CF] focus:outline-none">Update Your Personal Details</button>
                    </div>
                </div>
            </div>
            {/* Daily message */}

            {/*Personal progress */}

            {/* Need help */}
        </div>
    );
};

export default MyProfile;