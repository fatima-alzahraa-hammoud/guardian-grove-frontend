import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import AIMessage from "/assets/images/message.png";
import ProgressBar from '../common/ProgressBar';

// Reusing the same components from MyProfile
interface SparkleProps {
    size: number;
    color: string;
    style?: React.CSSProperties;
}

const Sparkle: React.FC<SparkleProps> = ({ size, color, style }) => {
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

// Animated Star Component - consistent with MyProfile
const AnimatedStar: React.FC = () => {
    return (
        <div className="relative flex items-center">
            <motion.span 
                className="text-sm md:text-lg mr-2 md:mr-3"
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
            >
                ⭐
            </motion.span>
            <Sparkle 
                size={8} 
                color="#FFD700" 
                style={{ position: "absolute", right: "35%", top: "30%" }} 
            />
        </div>
    );
};

// Animated Coin Component - consistent with MyProfile
const AnimatedCoin: React.FC = () => {
    return (
        <motion.span 
            className="text-sm md:text-lg mr-2 md:mr-3"
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
        >
            🪙
        </motion.span>
    );
};

// Mock data - replace with your actual data fetching
const mockChildData = {
  name: "Tasnim Hammoud",
  age: 10,
  memberSince: "17, 12, 2023",
  familyEmail: "tasnimhammoud@gmail.com",
  avatar: "/assets/images/avatars/child/avatar4.png",
  personalRank: 3,
  totalStars: 170,
  totalCoins: 20,
  about: "Tasnim is thriving in creativity and learning, with notable achievements in problem-solving and storytelling. They are most active during the afternoon, excelling in physical tasks and creative challenges. Monitoring shows positive social interactions and a healthy routine, with room to encourage group activities and family bonding for holistic growth.",
  currentLocation: "Al-Mahdi School",
  locationUpdate: "Tasnim left school at 2:45 PM, which is earlier than usual",
  soundsMonitored: "Bullying keywords detected during a call at 4:45 PM. Please check in with Tasnim.",
  dailyRoutine: [
    { activity: "Wake Up", time: "10:00 a.m", color: "bg-blue-100 border-blue-300" },
    { activity: "Breakfast", time: "10:30 a.m", color: "bg-pink-100 border-pink-300" },
    { activity: "WhatsApp", time: "10:40 - 12:00 a.m", color: "bg-orange-100 border-orange-300" },
    { activity: "Go to garden", time: "12:20 - 14:30 a.m", color: "bg-green-100 border-green-300" },
    { activity: "Game", time: "15:00 - 17:00 a.m", color: "bg-purple-100 border-purple-300" }
  ],
  routineHighlights: [
    {
      text: "Tasnim is most active and engaged between 3 PM and 5 PM.",
      color: "bg-blue-50 border-blue-200 text-blue-800"
    },
    {
      text: "They spent 2 hours on educational activities today, focusing on science and storytelling.",
      color: "bg-pink-50 border-pink-200 text-pink-800"
    },
    {
      text: "Phone usage: 30 minutes on a language learning app, 20 minutes on a creative drawing app, and 40 minutes on games",
      color: "bg-orange-50 border-orange-200 text-orange-800"
    },
    {
      text: "Tasnim is most active and engaged between 3 PM and 5 PM.",
      color: "bg-purple-50 border-purple-200 text-purple-800"
    }
  ],
  progressData: {
    goals: { completed: 25, total: 30 },
    tasks: { completed: 80, total: 100 },
    achievements: { completed: 80, total: 150 }
  },
  weeklyPerformance: [
    { day: "16 Dec", percentage: 25 },
    { day: "17 Dec", percentage: 85 },
    { day: "18 Dec", percentage: 97, highlight: true },
    { day: "19 Dec", percentage: 65 },
    { day: "20 Dec", percentage: 50 },
    { day: "21 Dec", percentage: 60 },
    { day: "22 Dec", percentage: 55 }
  ],
  achievements: [
    { title: "Star Collector", icon: "🏆" },
    { title: "Creative Writer", icon: "✏️" },
    { title: "Problem Solver", icon: "🧩" },
    { title: "Team Player", icon: "🤝" },
    { title: "Reading Champion", icon: "📚" }
  ],
  growthInsights: [
    "Tasnim is showing significant improvement in creative thinking and problem-solving.",
    "They excel in completing physical tasks but need encouragement to participate in group activities."
  ],
  recommendations: [
    "Encourage Tasnim to spend more time on group activities to build social skills.",
    "Plan a family outing this weekend to strengthen family bonding."
  ]
};

const ChildInsights = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState("");
  const [currentHighlight, setCurrentHighlight] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  // Same animation variants as MyProfile
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

  const nextHighlight = () => {
    setCurrentHighlight((prev) => (prev + 1) % mockChildData.routineHighlights.length);
  };

  const prevHighlight = () => {
    setCurrentHighlight((prev) => 
      prev === 0 ? mockChildData.routineHighlights.length - 1 : prev - 1
    );
    console.log(currentHighlight)
  };

  const handleSendFeedback = () => {
    if (feedback.trim()) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      toast.success("Feedback sent successfully!");
      setFeedback("");
    }
  };

  // Confetti effect from MyProfile
  const Confetti = () => {
    const confettiCount = 50;
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

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl pt-16 lg:pt-20 min-h-screen flex flex-col font-poppins flex-grow relative">

      {/* Background animated bubbles */}
      <FloatingBubbles count={6} />
      
      <ToastContainer className="text-xs"/>
      {showConfetti && <Confetti />}
      
      {/* Header with same style as MyProfile */}
      <motion.div 
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div>
          <motion.h1 
            className="font-comic font-extrabold text-lg md:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className='text-lg md:text-xl font-bold'>Your Child's Insights: </span> 
            <span className='text-[#3A8EBA] font-extrabold font-poppins break-words'>{mockChildData.name}</span>
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
        <motion.button 
          onClick={() => navigate(-1)}
          className="bg-[#3A8EBA] text-white px-3 py-2 rounded-full text-sm flex items-center w-full sm:w-auto justify-center"
          whileHover={{ scale: 1.03, backgroundColor: "#2C7EA8" }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <ChevronLeft className="mr-2" size={16} />
          Back
        </motion.button>
      </motion.div>

      {/* Main Info Cards - Responsive layout */}
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
                src={mockChildData.avatar || "https://via.placeholder.com/150"}
                alt="Child Avatar"
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
              child
            </motion.p>
          </div>
          
          {/* Details - Exact MyProfile styling */}
          <div className="text-white text-xs space-y-3 pl-12 pt-1 z-10">
            <motion.p 
              className="font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {mockChildData.name}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <span className="font-bold pr-3">Age:</span>{mockChildData.age}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <span className="font-bold pr-3">Member since: </span>{mockChildData.memberSince}
            </motion.p>
            <motion.p 
              className="pb-1 pr-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <span className="font-bold pr-1">family email: </span>{mockChildData.familyEmail}
            </motion.p>
            <motion.button 
              className="pl-3 pr-3 pt-2 pb-2 bg-white rounded-full text-black border-[1px] border-[#FDE4CF] focus:outline-none"
              whileHover={{ scale: 1.03, backgroundColor: "#FDE4CF" }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, type: "spring", stiffness: 100 }}
            >
              Update Your Child Personal Details
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          className="bg-[#FDE4CF] p-6 w-2/5 rounded-lg text-xs flex flex-col justify-between relative overflow-hidden"
          variants={itemVariants}
          whileHover={{ boxShadow: "0 8px 20px rgba(253, 228, 207, 0.4)" }}
        >
          {/* Animated gradient background - matching MyProfile */}
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
          
          <motion.p 
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span className="font-bold pr-3">Personal Rank:</span>
            <motion.span 
              className="text-sm"
              whileHover={{ scale: 1.1 }}
            >
              {mockChildData.personalRank}
            </motion.span>
          </motion.p>
          <motion.p 
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <span className="font-bold pr-5">Total Stars:</span>
            <AnimatedStar />
            <motion.span 
              className="text-sm"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.2 }}
            >
              {mockChildData.totalStars} stars
            </motion.span>
          </motion.p>
          <motion.p 
            className="flex items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <span className="font-bold pr-5">Total Coins: </span>
            <AnimatedCoin />
            <motion.span 
              className="text-sm"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.2 }}
            >
              {mockChildData.totalCoins} coins
            </motion.span>
          </motion.p>
        </motion.div>
      </motion.div>

      {/* About Section - matching MyProfile daily message style */}
      <motion.div 
        className="mt-6 lg:mt-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7 }}
      >
        <div className="flex gap-2 mb-2 items-center">
          <h3 className="font-comic font-extrabold text-base">About Tasnim:</h3>
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
          className="w-full text-xs md:text-sm font-poppins mt-3 bg-blue-50 p-4 rounded-lg relative overflow-hidden"
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
            {mockChildData.about}
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Daily Routine - Mobile optimized */}
      <motion.div 
        className="mt-7 lg:mt-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
      >
        <h3 className="font-comic font-extrabold mb-4 lg:mb-6 text-base">Daily routine</h3>
        
        {/* Mobile: Vertical scroll */}
        <div className="md:hidden space-y-4">
          {mockChildData.dailyRoutine.map((item, index) => (
            <motion.div 
              key={index}
              className={`w-full p-4 rounded-lg border-2 ${item.color} flex items-center justify-between`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="font-semibold text-sm">{item.activity}</div>
              <div className="text-xs">{item.time}</div>
            </motion.div>
          ))}
        </div>

        {/* Desktop: Horizontal scroll */}
        <div className="hidden md:flex justify-between items-center gap-4 overflow-x-auto pb-4">
          <button 
            onClick={prevHighlight}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 flex-shrink-0"
          >
            <ChevronLeft size={20} />
          </button>
          
          {mockChildData.dailyRoutine.map((item, index) => (
            <motion.div 
              key={index}
              className={`flex-shrink-0 w-28 h-28 lg:w-32 lg:h-32 rounded-full border-2 ${item.color} flex flex-col items-center justify-center text-center p-2 mt-3`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="font-semibold text-xs lg:text-sm">{item.activity}</div>
              <div className="text-xs mt-1">{item.time}</div>
            </motion.div>
          ))}
          
          <button 
            onClick={nextHighlight}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 flex-shrink-0"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </motion.div>

      {/* Daily Routine Highlights - Responsive grid */}
      <motion.div 
        className="mt-6 lg:mt-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7 }}
      >
        <h3 className="font-comic font-extrabold mb-4 lg:mb-6 text-base">Daily routine Highlights</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {mockChildData.routineHighlights.map((highlight, index) => (
            <motion.div
              key={index}
              className={`p-4 rounded-lg border-2 border-dashed ${highlight.color}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-xs md:text-sm">{highlight.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Safety and Progress Section - Responsive layout */}
      <motion.div 
        className="flex flex-col lg:flex-row gap-4 lg:gap-6 mt-6 lg:mt-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Safety Card */}
        <motion.div 
          className="bg-white rounded-lg border p-4 lg:p-6 w-full lg:w-1/2 flex flex-col justify-center"
          variants={itemVariants}
          whileHover={{ boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)" }}
        >
          <h3 className="font-comic font-extrabold mb-4 text-base">Safety and Well-being:</h3>
          <div className="flex flex-col justify-center flex-grow">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <MapPin className="text-blue-600 mt-1 flex-shrink-0" size={16} />
                  <div className="min-w-0">
                    <p className="font-semibold text-xs md:text-sm break-words">Current Location: {mockChildData.currentLocation}</p>
                    <p className="text-xs md:text-sm text-gray-600 mt-1">
                      <span className="font-medium">Location monitored:</span> {mockChildData.locationUpdate}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-red-600 mt-1 flex-shrink-0" size={16} />
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm">
                      <span className="font-medium">Sounds monitored:</span> {mockChildData.soundsMonitored}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <motion.button 
                  className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded-full text-xs md:text-sm hover:bg-blue-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Check Alerts
                </motion.button>
                <motion.button 
                  className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded-full text-xs md:text-sm hover:bg-blue-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Track Location
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress Card */}
        <motion.div 
          className="bg-white rounded-lg border p-4 lg:p-6 w-full lg:w-1/2"
          variants={itemVariants}
          whileHover={{ boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="flex items-center gap-2 mb-6">
            <h3 className="font-comic font-extrabold text-base">Progress Details</h3>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              📊
            </motion.div>
          </div>
          
          <div className="space-y-6">
            <ProgressBar 
              completed={mockChildData.progressData.goals.completed} 
              total={mockChildData.progressData.goals.total} 
              label="Daily Goals" 
              showPercentage={true}
              size="md"
            />
            
            <ProgressBar 
              completed={mockChildData.progressData.tasks.completed} 
              total={mockChildData.progressData.tasks.total} 
              label="Weekly Tasks" 
              showPercentage={true}
              size="md"
            />
            
            <ProgressBar 
              completed={mockChildData.progressData.achievements.completed} 
              total={mockChildData.progressData.achievements.total} 
              label="Total Achievements" 
              showPercentage={true}
              size="md"
            />
          </div>

          {/* Overall progress summary */}
          <motion.div 
            className="mt-6 p-4 bg-blue-50 rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">Overall Progress</span>
              <motion.span 
                className="text-sm font-bold text-blue-600"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 2, duration: 0.5 }}
              >
                {Math.round(
                  ((mockChildData.progressData.goals.completed + 
                    mockChildData.progressData.tasks.completed + 
                    mockChildData.progressData.achievements.completed) / 
                  (mockChildData.progressData.goals.total + 
                    mockChildData.progressData.tasks.total + 
                    mockChildData.progressData.achievements.total)) * 100
                )}%
              </motion.span>
            </div>
            
            <ProgressBar
              completed={
                mockChildData.progressData.goals.completed + 
                mockChildData.progressData.tasks.completed + 
                mockChildData.progressData.achievements.completed
              }
              total={
                mockChildData.progressData.goals.total + 
                mockChildData.progressData.tasks.total + 
                mockChildData.progressData.achievements.total
              }
              size="sm"
              className="mt-2"
            />
          </motion.div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2 mt-6">
            <motion.button 
              className="flex-1 px-4 py-2 bg-[#3A8EBA] text-white rounded-full text-sm hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Detailed Report
            </motion.button>
            <motion.button 
              className="flex-1 px-4 py-2 border border-[#3A8EBA] text-[#3A8EBA] rounded-full text-sm hover:bg-blue-50 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Set New Goals
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Performance Chart - Mobile optimized */}
      <motion.div 
        className="mt-6 lg:mt-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.7 }}
      >
        <div className="bg-white rounded-lg border p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 className="font-comic font-extrabold text-base">Performance</h3>
            <select className="border rounded px-3 py-1 text-sm bg-white w-full sm:w-auto">
              <option>📅 Weekly</option>
              <option>Monthly</option>
              <option>Yearly</option>
            </select>
          </div>
          
          <div className="flex justify-between items-end h-48 md:h-64 gap-1 md:gap-2 overflow-x-auto">
            {mockChildData.weeklyPerformance.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1 min-w-0">
                <div className="relative flex-1 flex items-end w-full">
                  {item.highlight && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap z-10">
                      <div className="hidden sm:block">Hurrahhh! Super Productive {item.percentage}%</div>
                      <div className="sm:hidden">{item.percentage}%</div>
                    </div>
                  )}
                  <motion.div
                    className={`w-full rounded-t ${item.highlight ? 'bg-[#3A8EBA]' : 'bg-blue-300'}`}
                    initial={{ height: 0 }}
                    animate={{ height: `${item.percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
                <span className="text-xs mt-2 text-gray-600 text-center break-words">{item.day}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Personal Progress Section - Responsive cards */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-6 lg:mt-10"
      >
        <h3 className="font-comic font-extrabold mb-2 text-base">
          Child Progress & Activities
        </h3>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 mt-5"
          variants={progressVariants}
          initial="hidden"
          animate="show"
        >
          {/* Achievements Card */}
          <motion.div
            className="group flex flex-col bg-[#E3F2FD] h-80 rounded-md p-5 items-center justify-between relative overflow-hidden"
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
            
            <div className="flex gap-2 overflow-x-auto pb-2 w-full">
              {mockChildData.achievements.slice(0, 3).map((achievement, index) => (
                <motion.div 
                  key={index} 
                  className="flex-shrink-0 w-16 h-16 border-2 border-blue-200 rounded-lg flex flex-col items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-lg mb-1">{achievement.icon}</span>
                  <span className="text-xs text-center px-1">{achievement.title}</span>
                </motion.div>
              ))}
            </div>
            <motion.button 
              className="text-sm bg-[#3A8EBA] text-white px-4 py-2 rounded-full"
              whileHover={{ scale: 1.05, backgroundColor: "#347ea5" }}
              whileTap={{ scale: 0.98 }}
            >
              View All
            </motion.button>
          </motion.div>

          {/* Task Assignment Card */}
          <motion.div
            className="group flex flex-col bg-[#FDEBE3] h-80 rounded-md p-5 items-center justify-center text-center relative overflow-hidden"
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
            <div className="absolute inset-0 m-[8px] border-[1.5px] border-dashed border-[#FF9800] rounded-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <h4 className="font-comic text-[16px] font-extrabold mb-4">Do you want to assign tasks to Tasnim?</h4>
            <motion.button 
              className="bg-[#3A8EBA] text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Assign Tasks
            </motion.button>
          </motion.div>

          {/* Growth Insights Card */}
          <motion.div
            className="group flex flex-col bg-[#FDE3EC] h-80 rounded-md p-5 relative overflow-hidden md:col-span-2 xl:col-span-1"
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
            <h4 className="font-comic text-[16px] font-extrabold text-center mb-4">Growth Insights</h4>
            
            <div className="space-y-3 flex-1">
              {mockChildData.growthInsights.map((insight, index) => (
                <p key={index} className="text-sm text-gray-700">
                  ⇒ {insight}
                </p>
              ))}
            </div>
            <motion.button 
              className="mt-4 bg-[#3A8EBA] text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition-colors w-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Generate Growth Plan
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Feedback and Recommendations Section - Responsive layout */}
      <motion.div 
        className="flex flex-col lg:flex-row gap-4 lg:gap-6 mt-6 lg:mt-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Recommendations */}
        <motion.div 
          className="bg-white rounded-lg border p-4 lg:p-6 w-full lg:w-1/2"
          variants={itemVariants}
          whileHover={{ boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)" }}
        >
          <h3 className="font-comic font-extrabold mb-4 text-base">Recommendations</h3>
          <div className="space-y-3">
            {mockChildData.recommendations.map((recommendation, index) => (
              <p key={index} className="text-xs md:text-sm text-gray-700">
                ⇒ {recommendation}
              </p>
            ))}
          </div>
          <motion.button 
            className="mt-4 bg-[#3A8EBA] text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition-colors w-full sm:w-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get AI Guidance
          </motion.button>
        </motion.div>

        {/* Feedback */}
        <motion.div 
          className="bg-white rounded-lg border p-4 lg:p-6 w-full lg:w-1/2"
          variants={itemVariants}
          whileHover={{ boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)" }}
        >
          <h3 className="font-comic font-extrabold mb-4 text-base text-center">
            Do you Like to send a feedback about Tasnim?
          </h3>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Add your feedback..."
            className="w-full h-32 border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#3A8EBA] focus:border-transparent"
          />
          <motion.button 
            onClick={handleSendFeedback}
            className="w-full mt-4 bg-[#3A8EBA] text-white py-2 rounded-full hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Send
          </motion.button>
          <p className="text-xs text-center text-gray-500 mt-2">
            It will be first shared with your AI friend!<br />
            Add whatever you want
          </p>
        </motion.div>
      </motion.div>

      {/* Connect to AI - Same as MyProfile */}
      <motion.div 
        className="mt-6 lg:mt-10 relative"
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
          className="font-comic font-extrabold mb-2 relative z-10 text-sm md:text-base"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Want to discuss Tasnim's progress with your AI friend?
        </motion.h3>
        <motion.button
          onClick={() => navigate("/dashboard/AIFriend")}
          className="group relative p-2 mt-3 mb-10 bg-[#3A8EBA] rounded-full text-sm text-white overflow-hidden w-full sm:w-auto"
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
          <span className="relative z-10 flex items-center justify-center gap-2">
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
            Talk to your AI friend about Tasnim
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ChildInsights;