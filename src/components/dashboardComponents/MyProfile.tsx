import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAvatar, selectBirthday, selectCoins, selectEmail, selectMmeberSince, selectName, selectRank } from "../../redux/slices/userSlice";
import uploadImage from "/assets/images/camera.svg";
import coinImage from "/assets/images/coins.png";
import { requestApi } from "../../libs/requestApi";
import { requestMethods } from "../../libs/enum/requestMethods";
import { toast } from "react-toastify";

const MyProfile : React.FC = () => {

    const name = useSelector(selectName);
    const avatar = useSelector(selectAvatar);
    const email = useSelector(selectEmail);
    const birthday = useSelector(selectBirthday);
    const memberSince = useSelector(selectMmeberSince);
    const coins = useSelector(selectCoins);
    const rank = useSelector(selectRank);
    const [currentDate, setCurrentDate] = useState<string>("");
    const [age, setAge] = useState<number>();
    const [formattedMemberSince, setFormattedMemberSince] = useState<string>("");
    const [familyName, setFamilyName] = useState<string>("");
    const [nbOfMembers, setNumberOfMembers] = useState<number>();
    const [totalStars, setTotalStars] = useState<number>();
    const [dailyMessage, setDailyMessage] = useState<string> ('You are shining!');

    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        setCurrentDate(formattedDate);

        // Calculate age
        if (birthday) {
            const birthDate = new Date(birthday);
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDifference = today.getMonth() - birthDate.getMonth();
            const dayDifference = today.getDate() - birthDate.getDate();

            if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
                setAge(age - 1);
            } else {
                setAge(age);
            }
        }

        // Format memberSince date correctly
        if (memberSince) {
            console.log(memberSince)
            const memberDate = new Date(memberSince);
            if (memberDate instanceof Date && !isNaN(memberDate.getTime())) {
                const formattedDate = `${memberDate.getDate()}, ${memberDate.getMonth() + 1}, ${memberDate.getFullYear()}`;
                setFormattedMemberSince(formattedDate);
            } else {
                console.error("Invalid memberSince date:", memberSince);
            }
        }

    }, [birthday]);

    useEffect(() => {
        const fetchFamilyNameAndNbMembers = async () => {
            try {
                const response = await requestApi({
                    route: "/family/someFamilydetails",
                    method: requestMethods.GET
                });

                if (response){
                    setFamilyName(response.familyName);
                    setNumberOfMembers(response.numberOfMembers);
                    setTotalStars(response.stars);
                }
            } catch (error) {
                console.log(error);
                toast.error("Error getting family name and number of members")
            }
        }
        fetchFamilyNameAndNbMembers();
    }, [])

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

                    <div className="flex flex-col pl-1 items-center">
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
                    <div className="text-white text-xs space-y-3 pl-3 pt-1">
                        <p className="font-bold">{name}</p>
                        <p><span className="font-bold pr-3">Age:</span>{age}</p>
                        <p><span className="font-bold pr-3">Member since: </span>{formattedMemberSince}</p>
                        <p className="pb-1"><span className="font-bold pr-1">Family email: </span>{email}</p>
                        <button className="pl-3 pr-3 pt-2 pb-2 bg-white rounded-full text-black border-[1px] border-[#FDE4CF] focus:outline-none">Update Your Personal Details</button>
                    </div>
                </div>
                <div className="bg-[#FDE4CF] p-6 w-2/5 rounded-lg text-xs flex flex-col justify-between">
                    <p><span className="font-bold p-3">Your Family:</span>{familyName} {' ( '} <span className="text-sm">{nbOfMembers}</span> {' members)'}</p>
                    <p><span className="font-bold pr-3">Total Family Stars:</span><span className="text-sm">{totalStars}</span></p>
                    <p className="flex items-center">
                        <span className="font-bold pr-4">Your Total Coins: </span>
                        <img src={coinImage} alt="Coin" className="w-5 h-5 mr-3"/>
                        <span className="text-sm">{coins}</span>
                    </p>
                    <p><span className="font-bold pr-3">Your Rank in Family:</span><span className="text-sm">{rank}</span></p>
                </div>
            </div>
            {/* Daily message */}

            <div className="pt-10">
                <h3 className="font-comic font-extrabold mb-2 text-md">Daily Message</h3>
                <div className="w-full bg-[#E3F2FD] border-[1px] border-[#3A8EBA] focus:outline-none h-16 rounded-md p-2 text-xs font-poppins">
                    {dailyMessage}
                </div>
            </div>

            {/*Personal progress */}

            {/* Need help */}
        </div>
    );
};

export default MyProfile;