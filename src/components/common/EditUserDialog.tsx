import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

interface User {
    id: number;
    name: string;
    email: string;
    type: 'parent' | 'child';
    role: 'user' | 'admin';
    status: 'active' | 'banned';
    achievements: number;
    progress: number;
    stars: number;
    coins: number;
}

interface EditUserDialogProps {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedUser: User) => void;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({ user, isOpen, onClose, onSave }) => {
    const [editedUser, setEditedUser] = useState<User | null>(user);

    React.useEffect(() => {
        setEditedUser(user); // Sync the dialog state with the selected user
    }, [user]);

    if (!editedUser) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Edit User Details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* Name */}
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                        id="name"
                        value={editedUser.name}
                        onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            value={editedUser.email}
                            onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                        />
                    </div>

                    {/* Type */}
                    <div>
                        <Label htmlFor="type">Type</Label>
                        <Select
                            value={editedUser.type}
                            onValueChange={(value: "parent" | "child") =>
                                setEditedUser({ ...editedUser, type: value })
                            }
                        >
                        <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="parent">Parent</SelectItem>
                            <SelectItem value="child">Child</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>

                    {/* Role */}
                    <div>
                        <Label htmlFor="role">Role</Label>
                        <Select
                            value={editedUser.role}
                            onValueChange={(value: "user" | "admin") =>
                                setEditedUser({ ...editedUser, role: value })
                            }
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
                </div>

                <div className="flex justify-end space-x-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            if (editedUser) onSave(editedUser);
                            onClose();
                        }}
                    >
                        Save
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditUserDialog;
