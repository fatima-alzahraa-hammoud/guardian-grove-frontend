import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Loader2, Wand2, Star, Coins } from "lucide-react";
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
    const [generatedTasks, setGeneratedTasks] = useState<Task[]>([]);
    const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [hasGeneratedTasks, setHasGeneratedTasks] = useState(false);

    // Reset form when dialog opens/closes
    useEffect(() => {
        if (!open) {
            setTitle("");
            setDescription("");
            setGeneratedTasks([]);
            setIsGeneratingTasks(false);
            setIsSaving(false);
            setHasGeneratedTasks(false);
        }
    }, [open]);

    const handleGenerateTasks = async () => {
        if (!title.trim() || !description.trim()) {
            toast.error("Please fill in both title and description before generating tasks");
            return;
        }

        setIsGeneratingTasks(true);
        setGeneratedTasks([]);
        setHasGeneratedTasks(false);

        try {
            const response = await requestApi({
                route: "/users/generateTasksForGoal", // Adjust this endpoint as needed
                method: requestMethods.POST,
                body: {
                    userId,
                    title: title.trim(),
                    description: description.trim()
                }
            });

            if (response && response.tasks) {
                setGeneratedTasks(response.tasks);
                setHasGeneratedTasks(true);
                toast.success("Tasks generated successfully!");
            } else {
                toast.error("Failed to generate tasks: " + (response?.message || "Unknown error"));
            }
        } catch (error) {
            console.error("Error generating tasks:", error);
            toast.error("Something went wrong while generating tasks");
        } finally {
            setIsGeneratingTasks(false);
        }
    };

    const handleSaveGoal = async () => {
        if (!title.trim() || !description.trim()) {
            toast.error("Please fill in both title and description");
            return;
        }

        if (!hasGeneratedTasks || generatedTasks.length === 0) {
            toast.error("Please generate tasks before saving the goal");
            return;
        }

        setIsSaving(true);

        try {
            const response = await requestApi({
                route: "/userGoals/createGoal", // Adjust this endpoint as needed
                method: requestMethods.POST,
                body: {
                    userId,
                    title: title.trim(),
                    description: description.trim(),
                    tasks: generatedTasks
                }
            });

            if (response && response.goal) {
                toast.success("Goal created successfully!");
                
                // Call the callback to update the parent component
                if (onGoalCreated) {
                    onGoalCreated(response.goal);
                }
                
                // Close the dialog
                onOpenChange(false);
            } else {
                toast.error("Failed to create goal: " + (response?.message || "Unknown error"));
            }
        } catch (error) {
            console.error("Error creating goal:", error);
            toast.error("Something went wrong while creating the goal");
        } finally {
            setIsSaving(false);
        }
    };

    const calculateTotalRewards = () => {
        return generatedTasks.reduce(
            (total, task) => ({
                stars: total.stars + task.rewards.stars,
                coins: total.coins + task.rewards.coins
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
                    {/* Goal Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-semibold">
                            Goal Title
                        </Label>
                        <Input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter your goal title..."
                            className="w-full"
                            disabled={isGeneratingTasks || isSaving}
                        />
                    </div>

                    {/* Goal Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-semibold">
                            Goal Description
                        </Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your goal in detail..."
                            className="w-full min-h-[100px] resize-none"
                            disabled={isGeneratingTasks || isSaving}
                        />
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
                                <h3 className="font-semibold text-lg font-comic">Generated Tasks</h3>
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
                                                    <span>{task.rewards.stars}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Coins className="w-3 h-3 text-yellow-500" />
                                                    <span>{task.rewards.coins}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
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