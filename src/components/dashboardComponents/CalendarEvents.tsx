import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MoreHorizontal, Plus, Sparkles, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { requestApi } from '../../libs/requestApi';
import { requestMethods } from '../../libs/enum/requestMethods';
import { useSelector } from "react-redux";
import { selectRole } from "../../redux/slices/userSlice";

interface Event {
    id: string;
    title: string;
    date: Date;
    time: string;
    description?: string;
    type: 'birthday' | 'picnic' | 'appointment' | 'reminder' | 'bonding';
    status?: 'pending' | 'approved' | 'rejected';
}

interface Task {
    id: string;
    title: string;
    completed: boolean;
}

interface BondingEvent {
    _id: string;
    title: string;
    description: string;
    date: Date;
    time: string;
    status: 'pending' | 'approved' | 'rejected';
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

const CalendarEvents: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date(2024, 11, 1)); // December 2024
    const [selectedDate, setSelectedDate] = useState(new Date(2024, 11, 16)); // 16th selected
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [isGeneratingEvents, setIsGeneratingEvents] = useState(false);
    const [allBondingEvents, setAllBondingEvents] = useState<BondingEvent[]>([]);
    const role = useSelector(selectRole);

    // Updated events state - start with fewer mock events and add bonding events from API
    const [events, setEvents] = useState<Event[]>([
        {
            id: '1',
            title: "tasnim's Birthday",
            date: new Date(2024, 11, 17),
            time: 'All day',
            type: 'birthday'
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

    // Fetch all bonding events (pending and approved)
    useEffect(() => {
        const fetchBondingEvents = async () => {
            try {
                const response = await requestApi({
                    route: "/events",
                    method: requestMethods.GET
                });
                if (response && response.events) {
                    setAllBondingEvents(response.events);
                    
                    // Add approved bonding events to the main events list
                    const approvedEvents = response.events
                        .filter((e: BondingEvent) => e.status === 'approved')
                        .map((e: BondingEvent) => ({
                            id: e._id,
                            title: e.title,
                            date: new Date(e.date),
                            time: e.time,
                            description: e.description,
                            type: 'bonding' as const,
                            status: e.status
                        }));
                    
                    // Update events with approved bonding events
                    setEvents(prevEvents => [
                        ...prevEvents.filter(e => e.type !== 'bonding'), // Remove existing bonding events
                        ...approvedEvents // Add new approved bonding events
                    ]);
                }
            } catch (error) {
                console.error("Error fetching bonding events:", error);
            }
        };

        fetchBondingEvents();
    }, []);

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

    const getEventsForDate = (date: Date | null) => {
        if (!date) return [];
        return events.filter(event => 
            event.date.toDateString() === date.toDateString()
        );
    };

    const getPendingEvents = () => {
        return allBondingEvents.filter(e => e.status === 'pending');
    };

    const getApprovedEventsForSuggestions = () => {
        // Get approved events for the AI suggestions section
        return allBondingEvents
            .filter(e => e.status === 'approved')
            .slice(0, 2); // Show only first 2 for the suggestions grid
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

    const generateBondingEvents = async () => {
        setIsGeneratingEvents(true);
        try {
            const response = await requestApi({
                route: "/events/generate",
                method: requestMethods.POST
            });

            if (response && response.events) {
                alert(`Generated ${response.events.length} bonding events! Waiting for parent approval.`);
                // Refresh the bonding events list
                setAllBondingEvents(prev => [...prev, ...response.events]);
            }
        } catch (error) {
            console.error("Error generating events:", error);
            alert("Failed to generate events. Please try again.");
        } finally {
            setIsGeneratingEvents(false);
        }
    };

    const handleApproveEvent = async (eventId: string) => {
        try {
            const response = await requestApi({
                route: "/events/review",
                method: requestMethods.POST,
                body: { eventId, status: 'approved' }
            });
            
            if (response) {
                // Update the bonding events list
                setAllBondingEvents(prev => 
                    prev.map(e => 
                        e._id === eventId 
                            ? { ...e, status: 'approved' as const }
                            : e
                    )
                );

                // Add to main events list
                const approvedEvent = allBondingEvents.find(e => e._id === eventId);
                if (approvedEvent) {
                    const newEvent: Event = {
                        id: approvedEvent._id,
                        title: approvedEvent.title,
                        date: new Date(approvedEvent.date),
                        time: approvedEvent.time,
                        description: approvedEvent.description,
                        type: 'bonding',
                        status: 'approved'
                    };
                    setEvents(prev => [...prev, newEvent]);
                }
            }
        } catch (error) {
            console.error("Error approving event:", error);
        }
    };

    const handleRejectEvent = async (eventId: string) => {
        try {
            await requestApi({
                route: "/events/review",
                method: requestMethods.POST,
                body: { eventId, status: 'rejected' }
            });
            
            // Update the bonding events list
            setAllBondingEvents(prev => 
                prev.map(e => 
                    e._id === eventId 
                        ? { ...e, status: 'rejected' as const }
                        : e
                )
            );
        } catch (error) {
            console.error("Error rejecting event:", error);
        }
    };

    const getEventTypeColor = (type: string) => {
        switch (type) {
            case 'birthday': return 'bg-[#FF6B6B]';
            case 'bonding': return 'bg-[#4ECDC4]';
            case 'picnic': return 'bg-[#4ECDC4]';
            case 'appointment': return 'bg-[#FFD166]';
            default: return 'bg-[#3A8EBA]';
        }
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
                                                className={`w-2 h-2 rounded-full ${getEventTypeColor(event.type)}`}
                                                whileHover={{ scale: 1.5 }}
                                            />
                                            <div>
                                                <span className="text-gray-700 text-sm font-medium">{event.title}</span>
                                                {event.description && (
                                                    <p className="text-xs text-gray-500">{event.description}</p>
                                                )}
                                                <p className="text-xs text-gray-400">{event.time}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {getEventsForDate(selectedDate).length === 0 && (
                                    <p className="text-gray-500 text-sm">No events for this date</p>
                                )}
                            </div>

                            {/* Pending Events Section for Parents */}
                            {role === 'parent' && getPendingEvents().length > 0 && (
                                <div className="mt-6">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Pending Approval</h4>
                                    <div className="space-y-2">
                                        {getPendingEvents().map(event => (
                                            <motion.div
                                                key={event._id}
                                                className="p-3 bg-yellow-50 rounded-lg border border-yellow-100"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium text-sm">{event.title}</p>
                                                        <p className="text-xs text-gray-600">{event.description}</p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {new Date(event.date).toLocaleDateString()} at {event.time}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <motion.button
                                                            onClick={() => handleApproveEvent(event._id)}
                                                            className="p-1 bg-green-500 text-white rounded"
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            <Check size={14} />
                                                        </motion.button>
                                                        <motion.button
                                                            onClick={() => handleRejectEvent(event._id)}
                                                            className="p-1 bg-red-500 text-white rounded"
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            <X size={14} />
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
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
                                    {events.filter(e => e.type === 'birthday').length > 0 
                                        ? `${events.find(e => e.type === 'birthday')?.title} Tomorrow`
                                        : 'No upcoming birthdays'
                                    }
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
                                    {tasks.filter(t => !t.completed).length} Pending Tasks for Today
                                </motion.div>
                                <motion.hr 
                                    className="border-gray-200"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                />
                                <motion.div 
                                    className="text-gray-700"
                                    whileHover={{ x: 5 }}
                                >
                                    {allBondingEvents.filter(e => e.status === 'approved').length} Active Bonding Events
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* AI Events Suggestions */}
                        <motion.div 
                            variants={fadeIn}
                            className="bg-white border-[1px] rounded-2xl p-6 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">Bonding Events</h3>
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
                                {getApprovedEventsForSuggestions().length > 0 ? (
                                    getApprovedEventsForSuggestions().map((event, index) => (
                                        <motion.div 
                                            key={event._id}
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
                                                    Approved
                                                </motion.span>
                                                <button className="text-gray-400 hover:text-gray-600">
                                                    <MoreHorizontal size={16} />
                                                </button>
                                            </div>
                                            <h4 className="font-semibold text-gray-900 mb-2">{event.title}</h4>
                                            <p className="text-sm text-gray-600 mb-4">{event.description}</p>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    <span>{new Date(event.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    <span>{event.time}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="col-span-2 text-center py-8">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-gray-500"
                                        >
                                            <Sparkles size={48} className="mx-auto mb-4 text-gray-300" />
                                            <p className="text-lg font-medium mb-2">No bonding events yet</p>
                                            <p className="text-sm">Click "Generate Bonding" to create family activities!</p>
                                        </motion.div>
                                    </div>
                                )}
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