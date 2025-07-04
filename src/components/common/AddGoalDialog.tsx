import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Loader2, Wand2, Star, Coins, AlertCircle } from "lucide-react";
import { requestApi } from "../../libs/requestApi";
import { requestMethods } from "../../libs/enum/requestMethods";
import { useSelector } from "react-redux";
import { selectUserId } from "../../redux/slices/userSlice";
import { toast } from "react-toastify";
import { Task } from "../../libs/types/Task";
import { Goal } from "../../libs/types/Goal";

interface AddGoalDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onGoalCreated?: (newGoal: Goal) => void;
}

const AddGoalDialog: React.FC<AddGoalDialogProps> = ({ open, onOpenChange, onGoalCreated }) => {
    const userId = useSelector(selectUserId);
    
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState<string>("");
    const [generatedTasks, setGeneratedTasks] = useState<Task[]>([]);
    const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [hasGeneratedTasks, setHasGeneratedTasks] = useState(false);
    const [error, setError] = useState<string>("");

    // Reset form when dialog opens/closes
    useEffect(() => {
        if (!open) {
            setTitle("");
            setDescription("");
            setDueDate("");
            setGeneratedTasks([]);
            setIsGeneratingTasks(false);
            setIsSaving(false);
            setHasGeneratedTasks(false);
            setError("");
        }
    }, [open]);

    const handleGenerateTasks = async () => {
        // Clear any previous errors
        setError("");
        
        if (!title.trim() || !description.trim()) {
            setError("Please fill in both title and description before generating tasks");
            toast.error("Please fill in both title and description before generating tasks");
            return;
        }

        if (!userId) {
            setError("User not found. Please try logging in again.");
            toast.error("User not found. Please try logging in again.");
            return;
        }

        setIsGeneratingTasks(true);
        setGeneratedTasks([]);
        setHasGeneratedTasks(false);

        try {
            const response = await requestApi({
                route: "/users/generateTasksForGoal",
                method: requestMethods.POST,
                body: {
                    userId,
                    title: title.trim(),
                    description: description.trim(),
                    dueDate: dueDate ? new Date(dueDate).toISOString() : undefined
                }
            });

            console.log("Generate tasks response:", response); // Debug log

            if (response && response.tasks && Array.isArray(response.tasks)) {
                // Validate task structure
                const validTasks = response.tasks.filter((task: Task) => 
                    task.title && 
                    task.description && 
                    task.rewards && 
                    typeof task.rewards.stars === 'number' && 
                    typeof task.rewards.coins === 'number'
                );

                if (validTasks.length > 0) {
                    setGeneratedTasks(validTasks);
                    setHasGeneratedTasks(true);
                    toast.success(`${validTasks.length} tasks generated successfully!`);
                } else {
                    setError("Generated tasks have invalid format");
                    toast.error("Generated tasks have invalid format");
                }
            } else {
                const errorMessage = response?.message || "Failed to generate tasks";
                setError(errorMessage);
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error("Error generating tasks:", error);
            const errorMessage = "Something went wrong while generating tasks. Please try again.";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsGeneratingTasks(false);
        }
    };

    const handleSaveGoal = async () => {
        setError("");
        
        if (!title.trim() || !description.trim()) {
            setError("Please fill in both title and description");
            toast.error("Please fill in both title and description");
            return;
        }

        if (!hasGeneratedTasks || generatedTasks.length === 0) {
            setError("Please generate tasks before saving the goal");
            toast.error("Please generate tasks before saving the goal");
            return;
        }

        if (!userId) {
            setError("User not found. Please try logging in again.");
            toast.error("User not found. Please try logging in again.");
            return;
        }

        setIsSaving(true);

        try {
            const response = await requestApi({
                route: "/userGoals/", // Make sure this endpoint exists
                method: requestMethods.POST,
                body: {
                    userId,
                    title: title.trim(),
                    description: description.trim(),
                    tasks: generatedTasks,
                    dueDate: dueDate ? new Date(dueDate).toISOString() : undefined
                }
            });

            console.log("Create goal response:", response); // Debug log

            if (response && response.goal) {
                toast.success("Goal created successfully!");
                
                // Call the callback to update the parent component
                if (onGoalCreated) {
                    onGoalCreated(response.goal);
                }
                
                // Close the dialog
                onOpenChange(false);
            } else {
                const errorMessage = response?.message || "Failed to create goal";
                setError(errorMessage);
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error("Error creating goal:", error);
            const errorMessage = "Something went wrong while creating the goal. Please try again.";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    const calculateTotalRewards = () => {
        return generatedTasks.reduce(
            (total, task) => ({
                stars: total.stars + (task.rewards?.stars || 0),
                coins: total.coins + (task.rewards?.coins || 0)
            }),
            { stars: 0, coins: 0 }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl p-8 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-comic text-2xl text-center">
                        Create New Goal
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 font-poppins">
                    {/* Error Display */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    {/* Goal Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-semibold">
                            Goal Title *
                        </Label>
                        <Input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter your goal title..."
                            className="w-full"
                            disabled={isGeneratingTasks || isSaving}
                            maxLength={100} // Add character limit
                        />
                        <div className="text-xs text-gray-500">{title.length}/100 characters</div>
                    </div>

                    {/* Goal Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-semibold">
                            Goal Description *
                        </Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your goal in detail... What do you want to achieve and why?"
                            className="w-full min-h-[100px] resize-none"
                            disabled={isGeneratingTasks || isSaving}
                            maxLength={500} // Add character limit
                        />
                        <div className="text-xs text-gray-500">{description.length}/500 characters</div>
                    </div>

                    {/* Due Date */}
                    <div className="space-y-2">
                        <Label htmlFor="dueDate" className="text-sm font-semibold">
                            Due Date (Optional)
                        </Label>
                        <Input
                            id="dueDate"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
                            className="w-full"
                            disabled={isGeneratingTasks || isSaving}
                        />
                        {dueDate && (
                            <div className="text-xs text-gray-500">
                                Target completion: {new Date(dueDate).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        )}
                    </div>

                    {/* Generate Tasks Button */}
                    <div className="flex justify-center">
                        <Button
                            onClick={handleGenerateTasks}
                            disabled={isGeneratingTasks || isSaving || !title.trim() || !description.trim()}
                            className="bg-[#3A8EBA] hover:bg-[#326E9F] text-white px-6 py-2 rounded-full transition-all duration-200"
                        >
                            {isGeneratingTasks ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating Tasks...
                                </>
                            ) : (
                                <>
                                    <Wand2 className="w-4 h-4 mr-2" />
                                    Generate Tasks
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Generated Tasks Display */}
                    {hasGeneratedTasks && generatedTasks.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg font-comic">
                                    Generated Tasks ({generatedTasks.length})
                                </h3>
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-500" />
                                        <span className="font-medium">{calculateTotalRewards().stars}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Coins className="w-4 h-4 text-yellow-500" />
                                        <span className="font-medium">{calculateTotalRewards().coins}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Goal Timeline Info */}
                            {dueDate && (
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-center gap-2 text-sm text-blue-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar">
                                            <path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>
                                        </svg>
                                        <span className="font-medium">Goal Timeline:</span>
                                        <span>Target completion by {new Date(dueDate).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}</span>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                {generatedTasks.map((task, index) => (
                                    <div
                                        key={index}
                                        className="p-4 bg-[#CDE7FE] rounded-lg border border-gray-200"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="w-6 h-6 bg-[#3A8EBA] text-white rounded-full flex items-center justify-center text-sm font-medium">
                                                        {index + 1}
                                                    </span>
                                                    <h4 className="font-medium text-sm">{task.title}</h4>
                                                </div>
                                                <p className="text-xs text-gray-600 ml-8">{task.description}</p>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-3 h-3 text-yellow-500" />
                                                    <span>{task.rewards?.stars || 0}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Coins className="w-3 h-3 text-yellow-500" />
                                                    <span>{task.rewards?.coins || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Regenerate Tasks Button */}
                            <div className="flex justify-center">
                                <Button
                                    onClick={handleGenerateTasks}
                                    disabled={isGeneratingTasks || isSaving}
                                    variant="outline"
                                    className="px-4 py-2 rounded-full text-sm"
                                >
                                    {isGeneratingTasks ? (
                                        <>
                                            <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                                            Regenerating...
                                        </>
                                    ) : (
                                        <>
                                            <Wand2 className="w-3 h-3 mr-2" />
                                            Regenerate Tasks
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isGeneratingTasks || isSaving}
                            className="px-8 py-2 rounded-full"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveGoal}
                            disabled={!hasGeneratedTasks || generatedTasks.length === 0 || isGeneratingTasks || isSaving}
                            className="bg-[#179447] hover:bg-[#158C43] text-white px-8 py-2 rounded-full"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Goal"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddGoalDialog;