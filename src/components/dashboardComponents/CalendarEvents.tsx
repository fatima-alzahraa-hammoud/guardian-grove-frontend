import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Edit2, MoreHorizontal, Plus, Sparkles, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Event {
    id: string;
    title: string;
    date: Date;
    time: string;
    description?: string;
    type: 'birthday' | 'picnic' | 'appointment' | 'reminder';
}

interface Task {
    id: string;
    title: string;
    completed: boolean;
}

interface CalendarEventsProps {
    collapsed?: boolean;
}

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            when: "beforeChildren"
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100
        }
    }
};

const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
};

const scaleUp = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 300 } }
};

const slideInFromLeft = {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

const slideInFromRight = {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

const pulse = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    tap: { scale: 0.95 }
};

// Floating background elements
const FloatingElements = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 4 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full blur-3xl"
                    style={{
                        width: `${100 + i * 50}px`,
                        height: `${100 + i * 50}px`,
                        left: `${10 + i * 25}%`,
                        top: `${20 + i * 15}%`,
                        backgroundColor: i % 2 === 0 ? '#3A8EBA' : '#8B5CF6',
                        opacity: 0.1
                    }}
                    animate={{
                        x: [0, 50, -30, 0],
                        y: [0, -30, 20, 0],
                        scale: [1, 1.2, 0.8, 1],
                    }}
                    transition={{
                        duration: 15 + i * 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 2
                    }}
                />
            ))}

            {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                    key={`particle-${i}`}
                    className="absolute w-2 h-2 rounded-full opacity-30"
                    style={{
                        backgroundColor: [
                            "#3A8EBA", // Primary blue
                            "#F09C14", // Orange
                            "#179447", // Green
                            "#8B5CF6"  // Purple
                        ][i % 4],
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -20, 0],
                        opacity: [0.2, 0.6, 0.2],
                    }}
                    transition={{
                        duration: 4 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
};

const CalendarEvents: React.FC<CalendarEventsProps> = ({ collapsed = false }) => {
    const [currentDate, setCurrentDate] = useState(new Date(2024, 11, 1)); // December 2024
    const [selectedDate, setSelectedDate] = useState(new Date(2024, 11, 16)); // 16th selected
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [isGeneratingEvents, setIsGeneratingEvents] = useState(false);
    
    const [events] = useState<Event[]>([
        {
            id: '1',
            title: "Leon's Birthday",
            date: new Date(2024, 11, 17),
            time: 'All day',
            type: 'birthday'
        },
        {
            id: '2',
            title: 'Family Picnic',
            date: new Date(2024, 11, 16),
            time: '6:00 pm',
            description: "Let's make a picnic today before 6:00 pm!",
            type: 'picnic'
        },
        {
            id: '3',
            title: 'Family Picnic',
            date: new Date(2024, 11, 16),
            time: '7:00 pm',
            description: "Let's make a picnic today before 6:00 pm!",
            type: 'picnic'
        }
    ]);

    const [tasks, setTasks] = useState<Task[]>([
        { id: '1', title: 'Read a Storybook', completed: false },
        { id: '2', title: 'Draw and color your favorite animal', completed: false },
        { id: '3', title: 'Clean your room', completed: false }
    ]);

    const [performanceData] = useState([
        { date: '16 Dec', value: 15 },
        { date: '17 Dec', value: 75 },
        { date: '18 Dec', value: 97 },
        { date: '19 Dec', value: 65 },
        { date: '20 Dec', value: 45 },
        { date: '21 Dec', value: 60 },
        { date: '22 Dec', value: 55 }
    ]);

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = (firstDay.getDay() + 6) % 7;

        const days = [];
        
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }
        
        return days;
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            if (direction === 'prev') {
                newDate.setMonth(prev.getMonth() - 1);
            } else {
                newDate.setMonth(prev.getMonth() + 1);
            }
            return newDate;
        });
    };

    const isToday = (date: Date | null) => {
        if (!date) return false;
        return date.getDate() === 16 && date.getMonth() === 11 && date.getFullYear() === 2024;
    };

    const isSelected = (date: Date | null) => {
        if (!date) return false;
        return date.toDateString() === selectedDate.toDateString();
    };

    const getEventsForDate = (date: Date | null) => {
        if (!date) return [];
        return events.filter(event => 
            event.date.toDateString() === date.toDateString()
        );
    };

    const toggleTaskCompletion = (taskId: string) => {
        setTasks(tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
        ));
    };

    const addNewTask = () => {
        if (newTaskTitle.trim()) {
            const newTask = {
                id: Date.now().toString(),
                title: newTaskTitle,
                completed: false
            };
            setTasks([...tasks, newTask]);
            setNewTaskTitle('');
        }
    };

    const generateBondingEvents = () => {
        setIsGeneratingEvents(true);
        setTimeout(() => {
            setIsGeneratingEvents(false);
            // In a real app, this would update events state
            alert("Bonding events generated!");
        }, 1500);
    };

    return (
        <div className="min-h-screen justify-center pt-24 pb-10 relative overflow-hidden">
            <FloatingElements />
            
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-6xl mx-auto relative z-10"
            >
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Side - Calendar */}
                    <motion.div 
                        className="col-span-4"
                        variants={slideInFromLeft}
                    >
                        {/* Calendar */}
                        <motion.div 
                            variants={scaleUp}
                            className="bg-white border-[1px] rounded-2xl p-6 mb-6 shadow-sm"
                        >
                            {/* Calendar Header */}
                            <div className="flex items-center justify-between mb-6">
                                <motion.h2 
                                    className="text-lg font-semibold text-gray-900"
                                    initial={{ x: -20 }}
                                    animate={{ x: 0 }}
                                    transition={{ type: "spring", stiffness: 100 }}
                                >
                                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                                </motion.h2>
                                <div className="flex gap-1">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => navigateMonth('prev')}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <ChevronLeft size={16} className="text-gray-600" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => navigateMonth('next')}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <ChevronRight size={16} className="text-gray-600" />
                                    </motion.button>
                                </div>
                            </div>

                            {/* Day Headers */}
                            <div className="grid grid-cols-7 gap-1 mb-3">
                                {dayNames.map(day => (
                                    <motion.div 
                                        key={day} 
                                        className="p-2 text-center text-xs font-medium text-gray-500"
                                        variants={itemVariants}
                                    >
                                        {day}
                                    </motion.div>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-1">
                                {getDaysInMonth(currentDate).map((date, index) => {
                                    const dateNumber = date?.getDate();
                                    const isCurrentDay = isToday(date);
                                    const hasEvents = date && getEventsForDate(date).length > 0;
                                    
                                    return (
                                        <motion.div
                                            key={index}
                                            className={`
                                                p-2 h-10 flex items-center justify-center text-sm cursor-pointer rounded-lg transition-all relative
                                                ${!date ? 'pointer-events-none' : ''}
                                                ${isCurrentDay ? 'bg-[#3A8EBA] text-white font-semibold' : ''}
                                                ${!isCurrentDay && date ? 'hover:bg-gray-100 text-gray-700' : ''}
                                                ${dateNumber && [1, 2, 3, 4].includes(dateNumber) ? 'text-blue-400' : ''}
                                            `}
                                            onClick={() => date && setSelectedDate(date)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            variants={itemVariants}
                                        >
                                            {dateNumber}
                                            {hasEvents && (
                                                <motion.span 
                                                    className="absolute bottom-1 w-1 h-1 bg-[#3A8EBA] rounded-full"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring", stiffness: 500 }}
                                                />
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* Events Section */}
                        <motion.div 
                            variants={scaleUp}
                            className="bg-white border-[1px] rounded-2xl p-6 mb-6 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Events</h3>
                                <motion.button 
                                    onClick={generateBondingEvents}
                                    className="flex items-center gap-1 bg-[#3A8EBA] text-white px-3 py-1 rounded-lg text-sm hover:bg-[#347ea5] transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={isGeneratingEvents}
                                >
                                    {isGeneratingEvents ? (
                                        <motion.span
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                        >
                                            <Sparkles size={14} />
                                        </motion.span>
                                    ) : (
                                        <>
                                            <Sparkles size={14} />
                                            Generate Bonding
                                        </>
                                    )}
                                </motion.button>
                            </div>
                            <div className="space-y-3">
                                <AnimatePresence>
                                    {getEventsForDate(selectedDate).map(event => (
                                        <motion.div 
                                            key={event.id} 
                                            className="flex items-center gap-3"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <motion.div 
                                                className={`w-2 h-2 rounded-full ${
                                                    event.type === 'birthday' ? 'bg-[#FF6B6B]' : 
                                                    event.type === 'picnic' ? 'bg-[#4ECDC4]' : 
                                                    event.type === 'appointment' ? 'bg-[#FFD166]' : 
                                                    'bg-[#3A8EBA]'
                                                }`}
                                                whileHover={{ scale: 1.5 }}
                                            />
                                            <span className="text-gray-700 text-sm">{event.title}</span>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </motion.div>

                        {/* Tasks Section */}
                        <motion.div 
                            variants={scaleUp}
                            className="bg-white border-[1px] rounded-2xl p-6 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Tasks</h3>
                                <div className="flex items-center gap-2">
                                    <motion.input
                                        type="text"
                                        value={newTaskTitle}
                                        onChange={(e) => setNewTaskTitle(e.target.value)}
                                        placeholder="Add new task"
                                        className="text-sm border rounded-lg px-2 py-1 w-32"
                                        onKeyPress={(e) => e.key === 'Enter' && addNewTask()}
                                        whileFocus={{ width: '140px' }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    />
                                    <motion.button 
                                        onClick={addNewTask}
                                        className="p-1 bg-[#3A8EBA] text-white rounded-lg hover:bg-[#347ea5] transition-colors"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Plus size={16} />
                                    </motion.button>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <AnimatePresence>
                                    {tasks.map(task => (
                                        <motion.div 
                                            key={task.id} 
                                            className="flex items-center gap-3"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                            layout
                                        >
                                            <motion.button
                                                onClick={() => toggleTaskCompletion(task.id)}
                                                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                                                    task.completed 
                                                        ? 'bg-[#3A8EBA] border-[#3A8EBA]' 
                                                        : 'border-gray-400 hover:border-[#3A8EBA]'
                                                }`}
                                                whileHover={{ scale: 1.2 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                {task.completed && (
                                                    <motion.span
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ type: "spring", stiffness: 500 }}
                                                    >
                                                        <Check size={10} className="text-white" />
                                                    </motion.span>
                                                )}
                                            </motion.button>
                                            <motion.span 
                                                className={`text-gray-700 text-sm ${
                                                    task.completed ? 'line-through text-gray-400' : ''
                                                }`}
                                                initial={{ x: 0 }}
                                                animate={{ x: task.completed ? 5 : 0 }}
                                            >
                                                {task.title}
                                            </motion.span>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Side - Remember, AI Suggestions, Performance */}
                    <motion.div 
                        className="col-span-8 space-y-6"
                        variants={slideInFromRight}
                    >
                        {/* Remember Section */}
                        <motion.div 
                            variants={fadeIn}
                            className="bg-white border-[1px] rounded-2xl p-6 shadow-sm"
                            whileHover={{ 
                                y: -5,
                                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                                transition: { duration: 0.3 }
                            }}
                        >
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Remember</h3>
                            <div className="space-y-4">
                                <motion.div 
                                    className="text-gray-700"
                                    whileHover={{ x: 5 }}
                                >
                                    Sara's Birthday Tomorrow
                                </motion.div>
                                <motion.hr 
                                    className="border-gray-200"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.5 }}
                                />
                                <motion.div 
                                    className="text-gray-700"
                                    whileHover={{ x: 5 }}
                                >
                                    3 Pending Tasks for Today
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* AI Events Suggestions */}
                        <motion.div 
                            variants={fadeIn}
                            className="bg-white border-[1px] rounded-2xl p-6 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">AI Events Suggestions</h3>
                                <div className="flex gap-2">
                                    <motion.button 
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <ChevronLeft size={20} className="text-gray-400" />
                                    </motion.button>
                                    <motion.button 
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <ChevronRight size={20} className="text-gray-400" />
                                    </motion.button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* First Event Card */}
                                <motion.div 
                                    className="border border-gray-200 rounded-xl p-4 relative"
                                    whileHover={{ 
                                        y: -5,
                                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                                        transition: { duration: 0.3 }
                                    }}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <motion.span 
                                            className="bg-[#3A8EBA] text-white text-xs px-3 py-1 rounded-full font-medium"
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 500 }}
                                        >
                                            12 Min Left
                                        </motion.span>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Family Picnic</h4>
                                    <p className="text-sm text-gray-600 mb-4">Let's make a picnic today before 6:00 pm!</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            <span>16 Dec 2024</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock size={12} />
                                            <span>6:00 pm</span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Second Event Card */}
                                <motion.div 
                                    className="border border-gray-200 rounded-xl p-4 relative"
                                    whileHover={{ 
                                        y: -5,
                                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                                        transition: { duration: 0.3 }
                                    }}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <motion.span 
                                            className="bg-[#3A8EBA] text-white text-xs px-3 py-1 rounded-full font-medium"
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 500 }}
                                        >
                                            72 Min Left
                                        </motion.span>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Family Picnic</h4>
                                    <p className="text-sm text-gray-600 mb-4">Let's make a picnic today before 6:00 pm!</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            <span>16 Dec 2024</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock size={12} />
                                            <span>7:00 pm</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Performance Section */}
                        <motion.div 
                            variants={fadeIn}
                            className="bg-white border-[1px] rounded-2xl p-6 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">Performance</h3>
                                <motion.div 
                                    className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <span className="text-sm text-gray-700">Weekly</span>
                                    <ChevronRight size={14} className="text-gray-400" />
                                </motion.div>
                            </div>

                            {/* Performance Badge */}
                            <motion.div 
                                className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6 inline-flex items-center gap-2"
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <span className="text-green-800 text-sm font-medium">Hurrahhh!</span>
                                <span className="text-green-700 text-sm">Super Productive</span>
                                <span className="text-green-800 text-lg font-bold">97%</span>
                            </motion.div>

                            {/* Chart */}
                            <div className="relative">
                                {/* Y-axis labels */}
                                <div className="absolute left-0 top-0 h-48 flex flex-col justify-between text-xs text-gray-400">
                                    <span>100%</span>
                                    <span>75%</span>
                                    <span>50%</span>
                                    <span>25%</span>
                                    <span>0%</span>
                                </div>

                                {/* Chart bars */}
                                <div className="ml-12 flex items-end justify-between h-48 gap-3">
                                    {performanceData.map((item, index) => (
                                        <motion.div 
                                            key={index} 
                                            className="flex flex-col items-center gap-3"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <motion.div
                                                className={`w-10 rounded-t-lg ${
                                                    item.value > 80 ? 'bg-[#3A8EBA]' : 'bg-[#3A8EBA]/30'
                                                }`}
                                                style={{ height: `${(item.value / 100) * 180}px` }}
                                                whileHover={{ scaleY: 1.05 }}
                                            />
                                            <span className="text-xs text-gray-500 -rotate-45 origin-center whitespace-nowrap">
                                                {item.date}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default CalendarEvents;