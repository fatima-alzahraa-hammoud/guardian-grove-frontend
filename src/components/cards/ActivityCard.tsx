import { Download, Users, Clock, Star, Heart, Gamepad2, BookOpen, Music, Palette, Coffee } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { BondingActivity } from "../../libs/types/BondingActivity";

const categoryIcons: Record<string, any> = {
    "Creative": Palette,
    "Memory": Heart,
    "Games": Gamepad2,
    "Emotional": Heart,
    "Planning": BookOpen,
    "Music": Music,
    "Cooking": Coffee
};

const difficultyColors = {
    "Easy": "bg-green-100 text-green-800",
    "Medium": "bg-yellow-100 text-yellow-800",
    "Hard": "bg-red-100 text-red-800"
};

const ActivityCard = ({ activity }: { activity: BondingActivity }) => {
    const IconComponent = categoryIcons[activity.category] || BookOpen;

    const handleDownload = () => {
        // Simulate download
        const link = document.createElement('a');
        link.href = activity.downloadUrl;
        link.download = `${activity.title.replace(/\s+/g, '-').toLowerCase()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <motion.div
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
            whileHover={{ y: -5 }}
            layout
        >
            {/* Thumbnail with fixed height */}
            <div className="h-48 bg-gradient-to-br from-[#3A8EBA] to-[#2c6b8f] relative overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 flex items-center justify-center">
                    <IconComponent className="w-16 h-16 text-white/80" />
                </div>
                <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[activity.difficulty]}`}>
                        {activity.difficulty}
                    </span>
                </div>
                <div className="absolute bottom-3 left-3 flex items-center space-x-2 text-white/90 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{activity.duration}</span>
                </div>
            </div>

            {/* Content area with flex-grow to take remaining space */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg text-gray-800 font-comic line-clamp-1">{activity.title}</h3>
                    <div className="flex items-center space-x-1 text-yellow-500 flex-shrink-0">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium text-gray-600">{activity.rating}</span>
                    </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">{activity.description}</p>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{activity.participants}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                        <span className="font-medium mr-2">Age:</span>
                        <span>{activity.ageGroup}</span>
                    </div>
                </div>

                {/* Materials */}
                <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Materials needed:</h4>
                    <div className="flex flex-wrap gap-1">
                        {activity.materials.slice(0, 3).map((material, index) => (
                            <span key={index} className="px-2 py-1 bg-[#E3F2FD] text-[#3A8EBA] text-xs rounded-full">
                                {material}
                            </span>
                        ))}
                        {activity.materials.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{activity.materials.length - 3} more
                            </span>
                        )}
                    </div>
                </div>

                {/* Spacer to push button to bottom */}
                <div className="mt-auto">
                    {/* Download Button */}
                    <Button
                        onClick={handleDownload}
                        className="w-full bg-[#3A8EBA] hover:bg-[#347ea5] text-white font-semibold py-3 rounded-full transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                        <Download className="w-4 h-4" />
                        <span>Download Activity</span>
                    </Button>

                    {/* Download count */}
                    <div className="mt-3 text-center">
                        <span className="text-xs text-gray-500">{activity.downloads} downloads</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ActivityCard;