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
            <DialogContent className="max-w-lg bg-white rounded-lg shadow-lg border border-gray-200">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-[#3A8EBA]">
                        Edit User Details
                    </DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    {/* Name */}
                    <div>
                        <Label htmlFor="name" className="text-[#3A8EBA] font-medium">Name</Label>
                        <Input
                            id="name"
                            className="border border-[#3A8EBA] focus:ring-[#3A8EBA] focus:border-[#3A8EBA]"
                            value={editedUser.name}
                            onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <Label htmlFor="email" className="text-[#3A8EBA] font-medium">Email</Label>
                        <Input
                            id="email"
                            className="border border-[#3A8EBA] focus:ring-[#3A8EBA] focus:border-[#3A8EBA]"
                            value={editedUser.email}
                            onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                        />
                    </div>

                    {/* Type */}
                    <div>
                        <Label htmlFor="type" className="text-[#3A8EBA] font-medium">Type</Label>
                        <Select
                            value={editedUser.type}
                            onValueChange={(value: "parent" | "child") =>
                                setEditedUser({ ...editedUser, type: value })
                            }
                        >
                            <SelectTrigger className="border border-[#3A8EBA] focus:ring-[#3A8EBA] focus:border-[#3A8EBA]">
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
                        <Label htmlFor="role" className="text-[#3A8EBA] font-medium">Role</Label>
                        <Select
                            value={editedUser.role}
                            onValueChange={(value: "user" | "admin") =>
                                setEditedUser({ ...editedUser, role: value })
                            }
                        >
                            <SelectTrigger className="border border-[#3A8EBA] focus:ring-[#3A8EBA] focus:border-[#3A8EBA]">
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
                    <Button
                        variant="outline"
                        className="border border-[#3A8EBA] text-[#3A8EBA] hover:bg-[#3A8EBA] hover:text-white"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="bg-[#3A8EBA] text-white hover:bg-[#317799]"
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
