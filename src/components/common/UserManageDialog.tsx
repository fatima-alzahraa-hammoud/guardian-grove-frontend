import React from "react";
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
    role: "user" | "admin";
    status: "active" | "banned";
    achievements: number;
    progress: number;
    stars: number;
    coins: number;
}

interface UserManageDialogProps {
    user: User | null;
    onStatusChange: (userId: number, newStatus: "active" | "banned") => void;
    onRoleChange: (userId: number, newRole: "user" | "admin") => void;
}

const UserManageDialog: React.FC<UserManageDialogProps> = ({ user, onStatusChange, onRoleChange }) => {
    if (!user) return null;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    Manage
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manage User: {user.name}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="user-status"
                            checked={user.status === "active"}
                            onCheckedChange={(checked) => onStatusChange(user.id, checked ? "active" : "banned")}
                        />
                        <Label htmlFor="user-status">Active</Label>
                    </div>
                    <Select
                        value={user.role}
                        onValueChange={(value: "user" | "admin") => onRoleChange(user.id, value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UserManageDialog;
