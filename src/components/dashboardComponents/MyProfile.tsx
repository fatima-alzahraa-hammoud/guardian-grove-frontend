import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAvatar, selectBirthday, selectCoins, selectDialyMessage, selectEmail, selectMmeberSince, selectName, selectRank, selectRole, setEmail, setUser } from "../../redux/slices/userSlice";
import coinImage from "/assets/images/coins.png";
import starsImage from "/assets/images/stars.png";
import rankImage from "/assets/images/rank.png";
import AIMessage from "/assets/images/message.png";
import motivationImage from "/assets/images/motivation.png";
import { requestApi } from "../../libs/requestApi";
import { requestMethods } from "../../libs/enum/requestMethods";
import ProgressBar from "../common/ProgressBar";
import "../../styles/card.css";
import "../../styles/global.css";
import DialogComponent from "../common/updateUserDialog";
import { TUpdate } from "../../libs/types/updateTypes";
import { useNavigate } from "react-router-dom";
import { selectFamilyMembers, selectFamilyName, selectFamilyStars, updateFamilyName } from "../../redux/slices/familySlice";

const MyProfile : React.FC = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const name = useSelector(selectName);
    const avatar = useSelector(selectAvatar);
    const email = useSelector(selectEmail);
    const birthday = useSelector(selectBirthday);
    const memberSince = useSelector(selectMmeberSince);
    const coins = useSelector(selectCoins);
    const rank = useSelector(selectRank);
    const role = useSelector(selectRole);
    const familyName = useSelector(selectFamilyName);
    const totalStars = useSelector(selectFamilyStars);
    const nbOfMembers = useSelector(selectFamilyMembers).length;
    const dailyMessage = useSelector(selectDialyMessage);

    const [currentDate, setCurrentDate] = useState<string>("");
    const [age, setAge] = useState<number>();
    const [formattedMemberSince, setFormattedMemberSince] = useState<string>("");
    const [lastUnlocked, setLastUnlocked] = useState<{title: string, photo: string, description: string, unlockedAt: Date}> ();
    const [noAchievements, setNoAchievements] = useState<boolean> (false);
    const [goals, setGoals] = useState<{completedGoals: number, totalGoals: number}>();
    const [tasks, setTasks] = useState<{completedTasks: number, totalTasks: number}>();
    const [isDialogOpen, setDialogOpen] = useState(false);

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleDialogConfirm = async(data: TUpdate) => {
        setDialogOpen(false);   

        if (data){
            try {
                const response = await requestApi({
                    route: "/users/",
                    method: requestMethods.PUT,
                    body: data
                });

                if (response){
                    dispatch(setUser(response.user));
                }
            } catch (error) {
                console.log("something wents wrong in updaing user", error);
            }

            //update family details
            if (data.email || data.familyAvatar || data.familyName){
                try {
                    const response = await requestApi({
                        route: "/family/",
                        method: requestMethods.PUT,
                        body: data
                    });
        
                    if (response){
                        dispatch(setEmail(response.family.email));
                        dispatch(updateFamilyName(response.family.familyName));
                    }
                } catch (error) {
                    console.log("something wents wrong in getting family details", error);
                }
            }
        }
    };
  
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
        const fetchLastUnlockedAchievement = async () => {
            try {
                const response = await requestApi({
                    route: "/achievements/lastUnlocked",
                    method: requestMethods.GET
                });

                if (response){
                    if (response.message === "No achievements"){
                        setNoAchievements(true);
                    }
                    setLastUnlocked(response.lastUnlockedAchievement);
                }
            } catch (error) {
                console.log("something wents wrong in getting achievements", error);
            }
        }
        fetchLastUnlockedAchievement();
    }, []);

    useEffect(() => {
        const fetchMonthlyStats = async() => {
            try {
                const response = await requestApi({
                    route: "/userGoals/monthlyStats",
                    method: requestMethods.GET
                });

                if(response){
                    const { completedGoals, totalGoals, completedTasks, totalTasks } = response;
                    setGoals({ completedGoals, totalGoals }); 
                    setTasks({ completedTasks, totalTasks }); 
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchMonthlyStats();
    }, [])

    return(
        <div className="mx-auto px-4 max-w-5xl pt-20 h-screen flex flex-col font-poppins flex-grow">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="font-comic font-extrabold text-lg">Hi, {name}</h1>
                    <p className="text-sm mt-3">{currentDate}</p>
                </div>
                {role === 'parent' && (
                    <button 
                        onClick={() => navigate("/AddMembers")}
                        className="bg-[#3A8EBA] text-white px-3 py-2 rounded-full text-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round-plus mr-2">
                            <path d="M2 21a8 8 0 0 1 13.292-6"/>
                            <circle cx="10" cy="8" r="5"/>
                            <path d="M19 16v6"/>
                            <path d="M22 19h-6"/>
                        </svg>                        
                        Add Family Member
                    </button>
                )}
            </div>
            
            {/* Daily message */}

            <div className="mt-5">
                <div className="flex gap-2">
                    <h3 className="font-comic font-extrabold mb-2 text-base">Daily Message</h3>
                    <img src={AIMessage} alt="AI message" className="w-6 h-6"/>
                </div>
                <div className="w-full max-h-16 text-[13px] font-poppins mt-3">
                    {dailyMessage}
                </div>
            </div>

            {/* Info */}
            <div className="flex space-x-6 mt-10">
                <div className="flex bg-[#3A8EBA] p-6 rounded-lg w-3/5">

                    <div className="flex flex-col pl-1 items-center">
                        {/* Image */}
                        <div className="relative">
                            <img 
                                className="w-20 h-20 bg-purple-100 rounded-full"
                                src={avatar || "https://via.placeholder.com/150"}
                                alt="User Avatar"
                            />       
                        </div>
                        <p className="pt-3 text-sm text-white">{role}</p>
                    </div>
                    
                    {/* Details */}
                    <div className="text-white text-xs space-y-3 pl-12 pt-1">
                        <p className="font-bold">{name}</p>
                        <p><span className="font-bold pr-3">Age:</span>{age}</p>
                        <p><span className="font-bold pr-3">Member since: </span>{formattedMemberSince}</p>
                        <p className="pb-1 pr-3"><span className="font-bold pr-1">Family email: </span>{email}</p>
                        <button onClick={handleDialogOpen} className="pl-3 pr-3 pt-2 pb-2 bg-white rounded-full text-black border-[1px] border-[#FDE4CF] focus:outline-none">Update Your Personal Details</button>
                        <DialogComponent
                            isOpen={isDialogOpen}
                            onClose={handleDialogClose}
                            onConfirm={handleDialogConfirm}
                            title="Update Personal Details"
                            confirmText="Save"
                            cancelText="Cancel"
                            familyName={familyName || ''}
                        />
                    </div>
                </div>
                <div className="bg-[#FDE4CF] p-6 w-2/5 rounded-lg text-xs flex flex-col justify-between">
                    <p><span className="font-bold pr-3 text-left">Your Family:</span>{familyName} {' ( '} <span className="text-sm">{nbOfMembers}</span> {' members)'}</p>
                    <p className="flex items-center">
                        <span className="font-bold pr-5">Total Family Stars:</span>
                        <img src={starsImage} alt="Stars" className="w-5 h-5 mr-3"/>
                        <span className="text-sm">{totalStars}</span>
                    </p>
                    <p className="flex items-center">
                        <span className="font-bold pr-8">Your Total Coins: </span>
                        <img src={coinImage} alt="Coin" className="w-5 h-5 mr-3"/>
                        <span className="text-sm">{coins}</span>
                    </p>
                    <p className="flex items-center">
                        <span className="font-bold pr-3">Your Rank in Family:</span>
                        <img src={rankImage} alt="ranks" className="w-5 h-5 mr-3"/>
                        <span className="text-sm">{rank}</span>
                    </p>
                </div>
            </div>

            {/*Personal progress */}

            <div className="mt-10">
                <h3 className="font-comic font-extrabold mb-2 text-base">Personal Progress</h3>
                
                <div className="flex gap-10 mt-5">
                    {/* Tasks & Goals */}
                    <div className=" group relative bg-[#FDEBE3] w-1/3 h-80 rounded-md p-3 overflow-hidden">
                        {/* Dashed Border */}
                        <div className="absolute inset-0 m-[8px] border-[1.5px] border-dashed border-[#FF9800] rounded-md pointer-events-none opacity-0 group-hover:opacity-100 border-rotate"></div>

                        {/* Card Content */}
                        <div className="relative w-full h-full bg-[#FDEBE3] rounded-md p-2">
                            <h4 className="font-comic text-[16px] font-extrabold text-center">Tasks & Goals</h4>
                            {goals?.totalGoals && goals.totalGoals > 0 ? (
                                <div>
                                    <p className="text-xs text-left pt-10 font-bold">This month</p>
                                    <div>
                                        <ProgressBar completed={tasks?.completedTasks || 0} total={tasks?.totalTasks || 0} label="Tasks" />
                                        <ProgressBar completed={goals?.completedGoals || 0} total={goals?.totalGoals || 0} label="Goals" />
                                    </div>
                                    <p className="text-center text-sm font-comic mb-3 mt-14 font-extrabold">
                                        "Keep up the great work!"
                                    </p>
                                </div>
                            ) :(
                                <div className="flex flex-col items-center rounded-lg p-6 text-center">
                                    <h3 className="font-bold text-[#3A8EBA] mb-2">No tasks or goals yet!</h3>
                                    <p className="text-gray-700 text-sm">Ask your AI friend to assign exciting adventures and challenges. <br></br><br></br>Let’s get started!</p>
                                    <button className="text-sm mt-4 bg-[#3A8EBA] text-white px-4 py-2 rounded-full hover:bg-[#347ea5]">
                                        Get Tasks Now
                                    </button>
                                </div>

                            )}
                        </div>
                    </div>

                    {/* Achievements */}

                    <div className="group flex flex-col bg-[#E3F2FD] w-1/3 h-80 rounded-md p-5 items-center justify-between relative overflow-hidden">
                        {/* Moving Border */}
                        <div className="absolute inset-0 m-[8px] border-[1.5px] border-dashed border-[#2196F3] rounded-md pointer-events-none opacity-0 group-hover:opacity-100 animate-borderMovement"></div>

                        <h4 className="font-comic text-[16px] font-extrabold text-center">Achievements</h4>
                        {!noAchievements ? (
                            <div className="flex flex-col justify-between">
                                <img src={lastUnlocked?.photo || "https://via.placeholder.com/150"} alt="" className="w-12 center" />
                                <p className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {lastUnlocked?.title}
                                </p>
                                <p className="text-xs text-center">Unlocked on: {' '}
                                    {lastUnlocked?.unlockedAt 
                                        ? new Date(lastUnlocked.unlockedAt).toLocaleDateString(undefined, {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        }) 
                                        : "N/A"
                                    }
                                </p>
                                <p className="text-xs text-center">{lastUnlocked?.description}</p>
                                <p className="text-center text-sm font-comic mb-3 font-extrabold">
                                    "Keep up the great work!"
                                </p>
                            </div>
                        ): (
                            <div className="flex flex-col items-center rounded-lg p-6 text-center">
                                <h3 className="font-bold text-[#FF8A00] mb-2">No achievements yet!</h3>
                                <p className="text-sm text-gray-700">Start completing tasks and challenges to collect your first star.<br></br><br></br>You can do it!</p>
                                <img src={motivationImage} alt="Motivational Illustration" className="mt-4 w-20 h-20" />
                            </div>
                        )}
                    </div>

                    {/* Magic Garden */}
                    <div className="group flex flex-col bg-[#FDE3EC] w-1/3 h-80 rounded-md p-5 items-center justify-between relative overflow-hidden">
                        {/* Moving Border */}
                        <div className="absolute inset-0 m-[8px] border-[1.5px] border-dashed border-[#FF4081] rounded-md pointer-events-none opacity-0 group-hover:opacity-100 animate-borderMovement"></div>

                        <h4 className="font-comic text-[16px] font-extrabold text-center">Magic Garden</h4>
                        <div className="flex gap-3 items-center justify-center mx-auto">
                            <img src={coinImage} alt="" className="w-5 h-5" />
                            <p className="text-xs">
                                You’ve grown 5 new flowers this week!
                            </p>
                        </div>
                        <p className="text-center text-sm font-comic mb-3 font-extrabold">
                            "Keep up the great work!"
                        </p>
                    </div>
                </div>
            </div>

            {/* Connect to AI */}
            <div className="mt-10">
                <h3 className="font-comic font-extrabold mb-2">Need help or guidance today? I’m here for you!</h3>
                <button onClick={() => navigate("/dashboard/AIFriend")} className="p-2 mt-3 mb-10 bg-[#3A8EBA] rounded-full text-sm text-white">Talk to me, your AI friend</button>
            </div>
            
        </div>
    );
};

export default MyProfile;