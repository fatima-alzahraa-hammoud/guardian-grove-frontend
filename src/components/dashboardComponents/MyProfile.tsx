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
import UpdateUserDialog from "../common/UpdateUserDialog";
import { useNavigate } from "react-router-dom";
import { selectFamilyAvatar, selectFamilyMembers, selectFamilyName, selectFamilyStars, updateFamilyAvatar, updateFamilyName } from "../../redux/slices/familySlice";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";

interface Style{
    size: number;
    color: string;
    style?: React.CSSProperties;
}
    
interface Style2{
    src: string;
    size?: string;
}

// Refined sparkle component with subtler animation
const Sparkle = ({ size, color, style }:Style) => {
    return (
        <motion.svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            style={style}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
                scale: [0, 0.8, 0.6, 0.8, 0], 
                opacity: [0, 0.7, 0.5, 0.7, 0], 
                rotate: [0, 25] 
            }}
            transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatDelay: 7,
                times: [0, 0.3, 0.5, 0.7, 1]
            }}
        >
        <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill={color}
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        </motion.svg>
    );
};

// Improved floating bubbles - fewer bubbles and more subtle
const FloatingBubbles = ({ count = 6, colors = ["#3A8EBA15", "#FDE4CF15", "#FF800015"] }) => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: count }).map((_, i) => {
                const size = Math.random() * 50 + 20;
                const color = colors[Math.floor(Math.random() * colors.length)];
                const left = `${Math.random() * 100}%`;
                const animDuration = 25 + Math.random() * 30;
                const delay = Math.random() * -40;
                
                return (
                    <motion.div
                        key={i}
                        className="absolute rounded-full blur-sm"
                        style={{
                        width: size,
                        height: size,
                        backgroundColor: color,
                        left,
                        top: "110%",
                        }}
                        initial={{ top: "110%" }}
                        animate={{ top: "-10%" }}
                        transition={{
                        duration: animDuration,
                        repeat: Infinity,
                        delay,
                        ease: "linear"
                        }}
                    />
                );
            })}
        </div>
    );
};

// Enhanced pulsing coin effect with subtler animation
const PulsingCoin = ({ src, size = "w-5 h-5" } : Style2) => {
    return (
        <motion.img
            src={src}
            alt="Coin"
            className={size}
            animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
            }}
            transition={{ 
                duration: 3, 
                repeat: Infinity,
                repeatDelay: 4,
                ease: "easeInOut" 
            }}
        />
    );
};

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
    const familyAvatar = useSelector(selectFamilyAvatar);
    const totalStars = useSelector(selectFamilyStars);
    const familyMembers = useSelector(selectFamilyMembers);
    const nbOfMembers = familyMembers.length;
    const dailyMessage = useSelector(selectDialyMessage);

    const [currentDate, setCurrentDate] = useState<string>("");
    const [age, setAge] = useState<number>();
    const [formattedMemberSince, setFormattedMemberSince] = useState<string>("");
    const [lastUnlocked, setLastUnlocked] = useState<{title: string, photo: string, description: string, unlockedAt: Date}> ();
    const [noAchievements, setNoAchievements] = useState<boolean> (false);
    const [goals, setGoals] = useState<{completedGoals: number, totalGoals: number}>();
    const [tasks, setTasks] = useState<{completedTasks: number, totalTasks: number}>();
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    // Smoother animation variants with longer durations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                staggerChildren: 0.2,
                delayChildren: 0.3,
                duration: 0.8
            }
        }
    };
    
    const itemVariants = {
        hidden: { y: 15, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { 
                type: "spring", 
                stiffness: 100, 
                damping: 12 
            }
        }
    };

    const fadeInUpVariants = {
        hidden: { 
            opacity: 0, 
            y: 20 
        },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 1.2,
                ease: "easeOut"
            }
        }
    };
    
    // More relaxed animations for the progress section
    const progressVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { 
                staggerChildren: 0.4,
                delayChildren: 0.3 
            }
        }
    };
    
    const cardVariants = {
        hidden: { 
            y: 20, 
            opacity: 0,
            scale: 0.97
        },
        show: { 
            y: 0, 
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.9,
                ease: "easeOut"
            }
        }
    };

    // Get children members (excluding parents)
    const children = familyMembers.filter(member => member.role !== 'parent');

    // Color palette for kid circles
    const kidColors = [
        { bg: '#FFE5E5', border: '#FF6B6B', shadow: 'rgba(255, 107, 107, 0.3)' },
        { bg: '#E5F3FF', border: '#4DABF7', shadow: 'rgba(77, 171, 247, 0.3)' },
        { bg: '#E5FFE5', border: '#51CF66', shadow: 'rgba(81, 207, 102, 0.3)' },
        { bg: '#FFF5E5', border: '#FFB84D', shadow: 'rgba(255, 184, 77, 0.3)' },
        { bg: '#F3E5FF', border: '#9775FA', shadow: 'rgba(151, 117, 250, 0.3)' },
        { bg: '#FFE5F5', border: '#FF6BB3', shadow: 'rgba(255, 107, 179, 0.3)' }
    ];

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    // Update the handleDialogConfirm function in MyProfile component
    const handleDialogConfirm = async(data: { userFormData: FormData; familyFormData?: FormData }) => {
        setDialogOpen(false);  
        console.log("Data to update:", data);

        if (data) {
            let userUpdated = false;
            let familyUpdated = false;

            // Update user profile if there are user changes
            if (data.userFormData && Array.from(data.userFormData.entries()).length > 0) {
                try {
                    const userResponse = await requestApi({
                        route: "/users/",
                        method: requestMethods.PUT,
                        body: data.userFormData
                    });

                    if (userResponse) {
                        dispatch(setUser(userResponse.user));
                        userUpdated = true;
                    }
                } catch (error) {
                    console.log("something went wrong in updating user", error);
                    toast.error("Failed to update user profile");
                }
            }

            // Update family details if there are family changes
            if (data.familyFormData && Array.from(data.familyFormData.entries()).length > 0) {
                try {
                    const familyResponse = await requestApi({
                        route: "/family/",
                        method: requestMethods.PUT,
                        body: data.familyFormData
                    });

                    if (familyResponse) {
                        dispatch(setEmail(familyResponse.family.email));
                        dispatch(updateFamilyName(familyResponse.family.familyName));
                        dispatch(updateFamilyAvatar(familyResponse.family.familyAvatar));
                        familyUpdated = true;
                    }  
                } catch (error) {
                    console.log("something went wrong in updating family details", error);
                    toast.error("Failed to update family details");
                }
            }

            if (userUpdated || familyUpdated) {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3000);
                toast.success("Profile updated successfully!");
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

    }, [birthday, memberSince]);

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

    // More elegant confetti effect with fewer particles
    const Confetti = () => {
        const confettiCount = 50; // Reduced count
        return (
            <div className="fixed inset-0 pointer-events-none z-50">
                {Array.from({ length: confettiCount }).map((_, index) => {
                    const startX = Math.random() * window.innerWidth;
                    const startY = -20;
                    const endX = startX + (Math.random() * 150 - 75);
                    const endY = window.innerHeight + 20;
                    const rotation = Math.random() * 360;
                    const size = Math.random() * 7 + 3;
                    const duration = Math.random() * 3 + 2;
                    const delay = Math.random() * 0.8;
                    const color = ['#FF9800', '#3A8EBA', '#4CAF50', '#E91E63', '#9C27B0'][Math.floor(Math.random() * 5)];
                    
                    return (
                        <motion.div
                            key={index}
                            className="absolute rounded-md"
                            style={{
                                width: size,
                                height: size * 1.5,
                                backgroundColor: color,
                                top: startY,
                                left: startX,
                                transformOrigin: 'center center',
                            }}
                            initial={{ x: 0, y: 0, rotate: 0 }}
                            animate={{ 
                                x: endX - startX, 
                                y: endY, 
                                rotate: rotation,
                                opacity: [1, 1, 0]
                            }}
                            transition={{ 
                                duration: duration, 
                                delay: delay,
                                ease: [0.1, 0.9, 1, 1]
                            }}
                        />
                    );
                })}
            </div>
        );
    };

    return(
        <div className="mx-auto px-4 max-w-5xl pt-20 min-h-screen flex flex-col font-poppins flex-grow relative">
            {/* Background animated bubbles - reduced count */}
            <FloatingBubbles count={6} />
            
            <ToastContainer className="text-xs"/>
            {showConfetti && <Confetti />}
            
            {/* Header with simpler animations */}
            <motion.div 
                className="flex justify-between items-center mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >
                <div>
                    <motion.h1 
                        className="font-comic font-extrabold text-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        Hi, {name}
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.7, duration: 0.5, type: "spring" }}
                            className="inline-block ml-2"
                        >
                            👋
                        </motion.span>
                    </motion.h1>
                    <motion.p 
                        className="text-sm mt-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        {currentDate}
                    </motion.p>
                </div>
                {role === 'parent' && (
                    <motion.button 
                        onClick={() => navigate("/AddMembers")}
                        className="bg-[#3A8EBA] text-white px-3 py-2 rounded-full text-sm flex items-center"
                        whileHover={{ scale: 1.03, backgroundColor: "#2C7EA8" }}
                        whileTap={{ scale: 0.97 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round-plus mr-2">
                            <path d="M2 21a8 8 0 0 1 13.292-6"/>
                            <circle cx="10" cy="8" r="5"/>
                            <path d="M19 16v6"/>
                            <path d="M22 19h-6"/>
                        </svg>                        
                        Add Family Member
                    </motion.button>
                )}
            </motion.div>
            
            {/* Daily message with subtle animation */}
            <motion.div 
                className="mt-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
            >
                <div className="flex gap-2">
                    <h3 className="font-comic font-extrabold mb-2 text-base">Daily Message</h3>
                    <motion.img 
                        src={AIMessage} 
                        alt="AI message" 
                        className="w-6 h-6"
                        animate={{ 
                            rotateZ: [0, -10, 10, -10, 10, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                            duration: 1.5,
                            delay: 1,
                            repeat: Infinity,
                            repeatDelay: 5
                        }}
                    />

                </div>
                <motion.div 
                    className="w-full max-h-16 text-[13px] font-poppins mt-3 bg-blue-50 p-3 rounded-lg relative overflow-hidden"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ delay: 0.4, duration: 0.7 }}
                >
                    <motion.div
                        className="absolute left-0 top-0 h-full w-1 bg-[#3A8EBA]"
                        animate={{ 
                            height: ["0%", "100%"]
                        }}
                        transition={{ 
                            duration: 1.5,
                            delay: 0.8,
                            ease: "easeOut"
                        }}
                    />
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.6 }}
                    >
                        {dailyMessage}
                    </motion.p>
                </motion.div>
            </motion.div>

            {role === 'parent' && children.length > 0 && (
                <motion.div 
                    className="mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    <h3 className="font-comic font-extrabold mb-4 text-base">Your Little Guardians</h3>
                    <motion.div 
                        className="flex flex-wrap gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {children.map((child, index) => {
                            const colorScheme = kidColors[index % kidColors.length];
                            return (
                                <motion.div
                                    key={index}
                                    className="flex flex-col items-center cursor-pointer"
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        // Navigate to child's insights/profile using their _id
                                          navigate(`/child/${child._id}`);

                                    }}
                                >
                                    <motion.div
                                        className="relative"
                                        transition={{ duration: 0.3 }}
                                    >
                                        {/* Animated border ring */}
                                        <motion.div
                                            className="absolute -inset-1 rounded-full"
                                            style={{ backgroundColor: colorScheme.border }}
                                            animate={{
                                                scale: [1, 1.1, 1],
                                                opacity: [0.3, 0.6, 0.3]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        />
                                        
                                        {/* Child avatar */}
                                        <motion.img 
                                            className="w-16 h-16 rounded-full relative z-10 border-3 border-white"
                                            style={{ 
                                                backgroundColor: colorScheme.bg,
                                                borderColor: colorScheme.border,
                                                borderWidth: '3px'
                                            }}
                                            src={child.avatar || "https://via.placeholder.com/150"}
                                            alt={`${child.name} Avatar`}
                                            whileHover={{ rotate: [0, -5, 5, 0] }}
                                            transition={{ duration: 0.5 }}
                                        />
                                        
                                        {/* Status indicator */}
                                        <motion.div
                                            className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white z-20"
                                            animate={{
                                                scale: [1, 1.2, 1]
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        />
                                    </motion.div>
                                    
                                    <motion.p 
                                        className="text-xs font-medium mt-2 text-center max-w-20 truncate hover:text-blue-600"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        {child.name}
                                    </motion.p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </motion.div>
            )}

            {/* Info cards with smoother motion */}
            <motion.div 
                className="flex space-x-6 mt-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div 
                    className="flex bg-[#3A8EBA] p-6 rounded-lg w-3/5 relative overflow-hidden"
                    variants={itemVariants}
                    whileHover={{ boxShadow: "0 8px 20px rgba(58, 142, 186, 0.2)" }}
                >
                
                    <div className="flex flex-col pl-1 items-center z-10">
                        {/* Image */}
                        <div className="relative">
                            <motion.div
                                className="absolute -inset-2 rounded-full"
                                animate={{ 
                                    boxShadow: ["0 0 0 rgba(255,255,255,0)", "0 0 15px rgba(255,255,255,0.5)", "0 0 0 rgba(255,255,255,0)"] 
                                }}
                                transition={{ 
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "loop"
                                }}
                            />
                            <motion.img 
                                className="w-20 h-20 bg-purple-100 rounded-full"
                                src={avatar || "https://via.placeholder.com/150"}
                                alt="User Avatar"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            />       
                        </div>

                        <motion.p 
                            className="pt-3 text-sm text-white"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            {role}
                        </motion.p>
                    </div>
                    
                    {/* Details with simplified animations */}
                    <div className="text-white text-xs space-y-3 pl-12 pt-1 z-10">
                        <motion.p 
                            className="font-bold"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            {name}
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            <span className="font-bold pr-3">Age:</span>{age}
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            <span className="font-bold pr-3">Member since: </span>{formattedMemberSince}
                        </motion.p>
                        <motion.p 
                            className="pb-1 pr-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9 }}
                        >
                            <span className="font-bold pr-1">Family email: </span>{email}
                        </motion.p>
                        <motion.button 
                            onClick={handleDialogOpen} 
                            className="pl-3 pr-3 pt-2 pb-2 bg-white rounded-full text-black border-[1px] border-[#FDE4CF] focus:outline-none"
                            whileHover={{ scale: 1.03, backgroundColor: "#FDE4CF" }}
                            whileTap={{ scale: 0.97 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, type: "spring", stiffness: 100 }}
                        >
                            Update Your Personal Details
                        </motion.button>
                        <UpdateUserDialog
                            isOpen={isDialogOpen}
                            onClose={handleDialogClose}
                            onConfirm={handleDialogConfirm}
                            title="Update Personal Details"
                            confirmText="Save"
                            cancelText="Cancel"
                            familyName={familyName || ''}
                            familyAvatar={familyAvatar || '/assets/images/stars.png'}
                        />
                    </div>
                </motion.div>
                <motion.div 
                    className="bg-[#FDE4CF] p-6 w-2/5 rounded-lg text-xs flex flex-col justify-between relative overflow-hidden"
                    variants={itemVariants}
                    whileHover={{ boxShadow: "0 8px 20px rgba(253, 228, 207, 0.4)" }}
                >
                    {/* Subtler animated gradient background */}
                    <motion.div 
                        className="absolute inset-0 opacity-15 bg-gradient-to-br from-yellow-200 to-red-100" 
                        animate={{ 
                            background: [
                                "linear-gradient(135deg, rgba(253,228,207,0.2) 0%, rgba(255,152,0,0.07) 100%)",
                                "linear-gradient(225deg, rgba(253,228,207,0.2) 0%, rgba(255,152,0,0.07) 100%)"
                            ]
                        }}
                        transition={{ 
                            duration: 12, 
                            repeat: Infinity,
                            repeatType: "reverse" 
                        }}
                    />
                    
                    {/* Family info with avatar */}
                    <motion.div
                        className="flex items-center justify-between"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <div className="flex-1">
                            <p className="font-bold text-left mb-2">Your Family:</p>
                            <p className="text-sm">
                                {familyName} {' ( '} 
                                <motion.span 
                                    className="text-sm"
                                    whileHover={{ scale: 1.1 }}
                                >
                                    {nbOfMembers}
                                </motion.span> 
                                {' members)'}
                            </p>
                        </div>
                        
                        {/* Family Avatar */}
                        <motion.div
                            className="relative"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.div
                                className="absolute -inset-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-30"
                                animate={{
                                    rotate: [0, 360],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{
                                    rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                                }}
                            />
                            <motion.img 
                                src={familyAvatar || starsImage} 
                                alt="Family Avatar" 
                                className="w-16 h-16 rounded-full border-2 border-white relative z-10"
                                animate={{ 
                                    boxShadow: [
                                        "0 0 0 rgba(255,215,0,0)",
                                        "0 0 15px rgba(255,215,0,0.5)",
                                        "0 0 0 rgba(255,215,0,0)"
                                    ]
                                }}
                                transition={{ 
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        </motion.div>
                    </motion.div>
                    
                    {/* ...existing stars and coins sections... */}
                    <motion.p 
                        className="flex items-center mt-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        <span className="font-bold pr-5">Total Family Stars:</span>
                        <div className="relative">
                            <motion.img 
                                src={starsImage} 
                                alt="Stars" 
                                className="w-5 h-5 mr-3"
                                animate={{ 
                                    rotate: [0, 10, -10, 10, 0],
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{ 
                                    duration: 2,
                                    delay: 1.5,
                                    repeat: Infinity,
                                    repeatDelay: 4
                                }}
                            />
                            {/* Light effect behind stars */}
                            <motion.div
                                className="absolute inset-0 bg-yellow-300 rounded-full filter blur-md z-[-1]"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ 
                                    opacity: [0, 0.5, 0],
                                    scale: [0.5, 1.5, 0.5]
                                }}
                                transition={{ 
                                    duration: 2,
                                    delay: 1.5,
                                    repeat: Infinity,
                                    repeatDelay: 4
                                }}
                            />
                        </div>
                        <motion.span 
                            className="text-sm"
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.2 }}
                        >
                            {totalStars}
                        </motion.span>
                        
                        {/* Add some random sparkles around stars */}
                        <Sparkle 
                            size={10} 
                            color="#FFD700" 
                            style={{ position: "absolute", right: "35%", top: "30%" }} 
                        />
                        <Sparkle 
                            size={8} 
                            color="#FFD700" 
                            style={{ position: "absolute", right: "30%", top: "50%" }} 
                        />
                    </motion.p>

                    {/* ...existing coins and rank sections... */}
                    <motion.p 
                        className="flex items-center mt-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <span className="font-bold pr-8">Your Total Coins: </span>
                        <PulsingCoin src={coinImage} />
                        <motion.span 
                            className="text-sm ml-3"
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.2 }}
                        >
                            {coins}
                        </motion.span>
                    </motion.p>
                    
                    <motion.p 
                        className="flex items-center mt-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                    >
                        <span className="font-bold pr-3">Your Rank in Family:</span>
                        <motion.img 
                            src={rankImage} 
                            alt="ranks" 
                            className="w-5 h-5 mr-3"
                            whileHover={{ scale: 1.2, rotate: 10 }}
                        />
                        <motion.span 
                            className="text-sm"
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.2 }}
                        >
                            {rank}
                        </motion.span>
                    </motion.p>
                </motion.div>

            </motion.div>

            {/* Personal Progress Section with refined animations */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-10"
            >
                <h3 className="font-comic font-extrabold mb-2 text-base">
                    Personal Progress
                </h3>
                
                <motion.div 
                    className="flex gap-10 mt-5"
                    variants={progressVariants}
                    initial="hidden"
                    animate="show"
                >
                    {/* Tasks & Goals Card */}
                    <motion.div
                        className="group relative bg-[#FDEBE3] w-1/3 h-80 rounded-md p-3 overflow-hidden"
                        variants={cardVariants}
                        whileHover={{ 
                            scale: 1.01,
                            transition: { duration: 0.4 }
                        }}
                    >
                        {/* Dashed Border */}
                        <div className="absolute inset-0 m-[8px] border-[1.5px] border-dashed border-[#FF9800] rounded-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        <div className="relative w-full h-full bg-[#FDEBE3] rounded-md p-2">
                            <h4 className="font-comic text-[16px] font-extrabold text-center">
                                Tasks & Goals
                            </h4>
                
                            {goals?.totalGoals && goals.totalGoals > 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <p className="text-xs text-left pt-10 font-bold">This month</p>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 1 }}
                                    >
                                        <ProgressBar completed={tasks?.completedTasks || 0} total={tasks?.totalTasks || 0} label="Tasks" className = "pt-5"/>
                                        <ProgressBar completed={goals?.completedGoals || 0} total={goals?.totalGoals || 0} label="Goals" className = "pt-5"/>
                                    </motion.div>
                                </motion.div>
                            ) : (
                                <div className="flex flex-col items-center rounded-lg p-6 text-center">
                                    <h3 className="font-bold text-[#3A8EBA] mb-2">No tasks or goals yet!</h3>
                                    <p className="text-gray-700 text-sm">
                                        Ask your AI friend to assign exciting adventures and challenges.
                                        <br/><br/>Let's get started!
                                    </p>
                                    <motion.button 
                                        className="text-sm mt-4 bg-[#3A8EBA] text-white px-4 py-2 rounded-full"
                                        whileHover={{ scale: 1.05, backgroundColor: "#347ea5" }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Get Tasks Now
                                    </motion.button>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Achievements Card */}
                    <motion.div
                        className="group flex flex-col bg-[#E3F2FD] w-1/3 h-80 rounded-md p-5 items-center justify-between relative overflow-hidden"
                        variants={cardVariants}
                        whileHover={{ 
                            scale: 1.02,
                            transition: { 
                                duration: 0.4,
                                ease: [0.25, 0.46, 0.45, 0.94] 
                            }
                        }}
                    >
                        {/* Dashed Border */}
                        <div className="absolute inset-0 m-[8px] border-[1.5px] border-dashed border-[#2196F3] rounded-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        <h4 className="font-comic text-[16px] font-extrabold text-center">Achievements</h4>
                        
                        {!noAchievements ? (
                            <div className="flex flex-col justify-between items-center">
                                <motion.img 
                                    src={lastUnlocked?.photo || "https://via.placeholder.com/150"}
                                    alt=""
                                    className="w-12 center"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ duration: 0.3 }}
                                />
                                <p className="text-xs font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {lastUnlocked?.title}
                                </p>
                                <p className="text-xs text-center mt-2">
                                    {lastUnlocked?.description}
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center rounded-lg p-6 text-center">
                                <h3 className="font-bold text-[#FF8A00] mb-2">No achievements yet!</h3>
                                <p className="text-sm text-gray-700">
                                    Start completing tasks and challenges to collect your first star.
                                    <br/><br/>You can do it!
                                </p>
                                <motion.img 
                                    src={motivationImage}
                                    alt="Motivational Illustration"
                                    className="mt-4 w-20 h-20"
                                    animate={{ 
                                        y: [-3, 3, -3],
                                    }}
                                    transition={{ 
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            </div>
                        )}
                    </motion.div>

                    {/* Magic Garden Card */}
                    <motion.div
                        className="group flex flex-col bg-[#FDE3EC] w-1/3 h-80 rounded-md p-5 items-center justify-between relative overflow-hidden"
                        variants={cardVariants}
                        whileHover={{ 
                            scale: 1.02,
                            transition: { 
                                duration: 0.4,
                                ease: [0.25, 0.46, 0.45, 0.94] 
                            }
                        }}
                    >
                        {/* Dashed Border */}
                        <div className="absolute inset-0 m-[8px] border-[1.5px] border-dashed border-[#FF4081] rounded-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        <h4 className="font-comic text-[16px] font-extrabold text-center">Magic Garden</h4>
                        
                        <motion.div 
                            className="flex gap-3 items-center justify-center mx-auto"
                            whileHover={{ scale: 1.05 }}
                        >
                            <PulsingCoin src={coinImage} />
                            <p className="text-xs">
                                You've grown 5 new flowers this week!
                            </p>
                        </motion.div>
                        
                        <p className="text-center text-sm font-comic mb-3 font-extrabold">
                            "Keep up the great work!"
                        </p>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Connect to AI */}
            <motion.div 
                className="mt-10 relative"
                variants={fadeInUpVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div
                    className="absolute -right-4 -top-4 w-20 h-20"
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <svg viewBox="0 0 100 100" className="w-full h-full opacity-10">
                        <path
                            d="M50 0C77.6142 0 100 22.3858 100 50C100 77.6142 77.6142 100 50 100C22.3858 100 0 77.6142 0 50C0 22.3858 22.3858 0 50 0Z"
                            fill="currentColor"
                        />
                    </svg>
                </motion.div>

                <motion.h3 
                    className="font-comic font-extrabold mb-2 relative z-10"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Need help or guidance today? I'm here for you!
                </motion.h3>

                <motion.button
                    onClick={() => navigate("/dashboard/AIFriend")}
                    className="group relative p-2 mt-3 mb-10 bg-[#3A8EBA] rounded-full text-sm text-white overflow-hidden"
                    whileHover={{ 
                        scale: 1.05,
                        transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: 0.95 }}
                >
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#3A8EBA] to-[#64B5E6]"
                    animate={{
                        x: ['-100%', '100%']
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                    <span className="relative z-10 flex items-center gap-2">
                        <motion.svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            animate={{
                                rotate: [0, 10, -10, 0]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </motion.svg>
                        Talk to me, your AI friend
                    </span>
                </motion.button>
            </motion.div>
        </div>
    );
};

export default MyProfile;