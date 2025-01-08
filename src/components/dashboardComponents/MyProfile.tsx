import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectName } from "../../redux/slices/userSlice";

const MyProfile : React.FC = () => {

    const name = useSelector(selectName);
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
            <div>
                <div>
                    {/* Image */}
                    <div></div>
                    
                    {/* Details */}
                    <div></div>
                </div>
                <div></div>
            </div>
            {/* Daily message */}

            {/*Personal progress */}

            {/* Need help */}
        </div>
    );
};

export default MyProfile;