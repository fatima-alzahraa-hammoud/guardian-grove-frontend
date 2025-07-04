import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";

interface User {
    id: number;
    name: string;
    email: string;
    type: "parent" | "child";
    role: "user" | "parent" | "child" | "admin";
    status: "active" | "banned";
    achievements: number;
    progress: number;
    stars: number;
    coins: number;
}

interface UserManageDialogProps {
    user: User | null;
    onStatusChange: (userId: number, newStatus: "active" | "banned") => void;
    onRoleChange: (userId: number, newRole: "child" | "parent" | "admin") => void;
}

const UserManageDialog: React.FC<UserManageDialogProps> = ({ user, onStatusChange, onRoleChange }) => {

    const [isOpen, setIsOpen] = useState(false);

    if (!user) return null;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="border border-[#3A8EBA] text-[#3A8EBA] hover:bg-[#3A8EBA] hover:text-white"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(true);
                    }}
                >
                    Manage
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-white rounded-lg shadow-lg border border-gray-200" onClick={(e) => e.stopPropagation()}>
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-[#3A8EBA]">
                        Manage User: {user.name}
                    </DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    {/* Status Toggle */}
                    <div className="flex items-center space-x-4">
                        <Switch
                            id="user-status"
                            className="bg-[#3A8EBA] border border-gray-300 focus:ring-2 focus:ring-[#3A8EBA]"
                            checked={user.status === "active"}
                            onCheckedChange={(checked) => onStatusChange(user.id, checked ? "active" : "banned")}
                            onClick={(e) => e.stopPropagation()} 
                        />
                        <Label
                            htmlFor="user-status"
                            className="text-[#3A8EBA] font-medium"
                        >
                            Active
                        </Label>
                    </div>

                    {/* Role Selector */}
                    <div>
                        <Label
                            htmlFor="user-role"
                            className="text-[#3A8EBA] font-medium"
                        >
                            Role
                        </Label>
                        <Select
                            value={user.role}
                            onValueChange={(value: "child" | "parent" | "admin") => onRoleChange(user.id, value)}
                        >
                            <SelectTrigger className="border border-[#3A8EBA] focus:ring-[#3A8EBA] focus:border-[#3A8EBA]">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="parent">Parent</SelectItem>
                                <SelectItem value="child">Child</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button
                        variant="outline"
                        className="border border-[#3A8EBA] text-[#3A8EBA] hover:bg-[#3A8EBA] hover:text-white"
                        onClick={() => setIsOpen(false)}
                    >
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UserManageDialog;
