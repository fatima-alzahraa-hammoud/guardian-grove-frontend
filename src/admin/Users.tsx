"use client"

import React, { useState, useEffect } from 'react';
import StatCard from './StatCard';
import { UserCheck, UserPlus, UsersIcon, UserX, Star, Coins } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import UserManageDialog from '../components/common/UserManageDialog';
import EditUserDialog from '../components/common/EditUserDialog';
import { requestApi } from '../libs/requestApi';
import { requestMethods } from '../libs/enum/requestMethods';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'admin' | 'parent' | 'child';
    status: 'active' | 'banned';
    achievements: number;
    progress: number;
    stars: number;
    coins: number;
    avatar?: string;
}

// API Response User interface
interface ApiUser {
    _id?: string;
    id?: number;
    name: string;
    email: string;
    role: 'user' | 'admin' | 'parent' | 'child';
    status?: 'active' | 'banned';
    achievements?: Array<{
        _id: string;
        name: string;
        description?: string;
        points?: number;
        dateEarned?: string;
    }>;
    stars?: number;
    coins?: number;
    avatar?: string;
}

// API Response wrapper interface
interface UsersResponse {
    users?: ApiUser[];
}

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [filter, setFilter] = useState<'all' | 'parent' | 'child'>('all')
    const [search, setSearch] = useState('')
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Fetch users from backend
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log("Fetching users...");
            
            const response = await requestApi({
                route: "/users/", // Using your existing backend endpoint
                method: requestMethods.GET
            });
            
            console.log("Raw API response:", response);
            
            let apiUsers: ApiUser[] = [];
            
            // Handle different response formats
            if (Array.isArray(response)) {
                // If response is directly an array
                apiUsers = response;
            } else if (response && typeof response === 'object' && 'users' in response) {
                // If response is an object with users property
                apiUsers = (response as UsersResponse).users || [];
            } else if (response && typeof response === 'object') {
                // If response is an object but not wrapped in users property
                // This might be the case if your API returns a single object
                apiUsers = [response as ApiUser];
            } else {
                console.warn("Unexpected response format:", response);
                apiUsers = [];
            }
            
            console.log("Extracted API users:", apiUsers);
            
            if (apiUsers.length > 0) {
                // Transform backend data to match frontend interface
                const transformedUsers: User[] = apiUsers.map((user: ApiUser, index: number) => ({
                    id: user._id ? parseInt(user._id) : user.id || index + 1,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    status: user.status || 'active',
                    achievements: user.achievements?.length || 0,
                    progress: Math.round(((user.stars || 0) / 1000) * 100),
                    stars: user.stars || 0,
                    coins: user.coins || 0,
                    avatar: user.avatar
                }));
                
                console.log("Transformed users:", transformedUsers);
                setUsers(transformedUsers);
            } else {
                console.log("No users found in response");
                setUsers([]);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setError("Failed to fetch users. Please check your API connection.");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Calculate stats
    const activeUsers = users.filter(user => user.status === 'active').length;
    const parentUsers = users.filter(user => user.role === 'parent').length;
    const bannedUsers = users.filter(user => user.status === 'banned').length;

    const handleRowClick = (user: User) => {
        setSelectedUser(user);
        setIsDialogOpen(true);
    };

    const handleSave = (updatedUser: User) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        );
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || user.role === filter;
        return matchesSearch && matchesFilter;
    });

    const handleStatusChange = async (userId: number, newStatus: 'active' | 'banned') => {
        try {
            console.log(`Updating user ${userId} status to ${newStatus}`);
            
            // If you have admin endpoints in your backend, use them. Otherwise, this might need backend support
            // For now, just update locally and you can add backend call later
            setUsers(users.map(user =>
                user.id === userId ? { ...user, status: newStatus } : user
            ));
            
            // Uncomment when you have backend endpoint:
            /*
            const response = await requestApi({
                route: "/users/admin/status",
                method: requestMethods.PUT,
                body: { userId, status: newStatus }
            });
            */
            
            console.log(`User ${userId} status updated to ${newStatus}`);
        } catch (error) {
            console.error("Error updating user status:", error);
        }
    }

    const handleRoleChange = async (userId: number, newRole: 'child' | 'parent' | 'admin') => {
        try {
            console.log(`Updating user ${userId} role to ${newRole}`);
            
            // Update locally for now
            setUsers(users.map(user =>
                user.id === userId ? { ...user, role: newRole } : user
            ));
            
            // Uncomment when you have backend endpoint:
            /*
            const response = await requestApi({
                route: "/users/admin/role", 
                method: requestMethods.PUT,
                body: { userId, role: newRole }
            });
            */
            
            console.log(`User ${userId} role updated to ${newRole}`);
        } catch (error) {
            console.error("Error updating user role:", error);
        }
    }

    if (loading) {
        return (
            <div className="p-8 ml-10 mt-10 space-y-8 font-poppins">
                <h2 className="font-poppins text-lg font-semibold">Users</h2>
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg">Loading users...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 ml-10 mt-10 space-y-8 font-poppins">
                <h2 className="font-poppins text-lg font-semibold">Users</h2>
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-red-600">{error}</div>
                    <button 
                        onClick={fetchUsers}
                        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 ml-10 mt-10 space-y-8 font-poppins">
            <h2 className="font-poppins text-lg font-semibold">Users</h2>

            {/* Stats Cards Row */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Users"
                    value={users.length.toString()}
                    icon={<UsersIcon className="h-5 w-5 text-primary" />}
                    trend={{ value: 20, isPositive: true }}
                    padding={"pl-20"}
                />
                <StatCard
                    title="Active Users"
                    value={activeUsers.toString()}
                    icon={<UserCheck className="h-5 w-5 text-primary" />}
                    trend={{ value: 15, isPositive: true }}
                    padding={"pl-20"}
                />
                <StatCard
                    title="Parent Users"
                    value={parentUsers.toString()}
                    icon={<UserPlus className="h-5 w-5 text-primary" />}
                    trend={{ value: 10, isPositive: true }}
                    padding={"pl-20"}
                />
                <StatCard
                    title="Banned Users"
                    value={bannedUsers.toString()}
                    icon={<UserX className="h-5 w-5 text-primary" />}
                    trend={{ value: 5, isPositive: false }}
                    padding={"pl-20"}
                />
            </div>

            {/* Show message if no users */}
            {users.length === 0 && !loading && !error && (
                <Card>
                    <CardContent className="p-8 text-center">
                        <p className="text-gray-500">No users found. Please check your API connection or add some users.</p>
                    </CardContent>
                </Card>
            )}

            {/* User List */}
            {users.length > 0 && (
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base">User List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between mb-4">
                            <Input
                                placeholder="Search users..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-64"
                            />
                            <Select value={filter} onValueChange={(value: 'all' | 'parent' | 'child') => setFilter(value)}>
                                <SelectTrigger className="w-36">
                                    <SelectValue placeholder="Filter by role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Users</SelectItem>
                                    <SelectItem value="parent">Parents</SelectItem>
                                    <SelectItem value="child">Children</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Stars</TableHead>
                                    <TableHead>Coins</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow
                                        key={user.id}
                                        className="cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleRowClick(user)}
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#3A8EBA] flex items-center justify-center overflow-hidden">
                                                    {user.avatar ? (
                                                        <img 
                                                            src={user.avatar} 
                                                            alt={user.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.style.display = 'none';
                                                                const parent = target.parentElement;
                                                                if (parent) {
                                                                    parent.innerHTML = `<span class="text-white text-sm font-semibold">${user.name[0]}</span>`;
                                                                }
                                                            }}
                                                        />
                                                    ) : (
                                                        <span className="text-white text-sm font-semibold">{user.name[0]}</span>
                                                    )}
                                                </div>
                                                <span className="font-medium">{user.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell className="capitalize">{user.role}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                            user.status === 'active' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {user.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4 text-yellow-500" />
                                                <span className="font-medium">{user.stars}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Coins className="h-4 w-4 text-amber-500" />
                                                <span className="font-medium">{user.coins}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell> 
                                            <UserManageDialog
                                                user={{
                                                    ...user,
                                                    role: user.role === "admin" ? "admin" : "user",
                                                    type: user.role === "parent" ? "parent" : "child"
                                                }}
                                                onStatusChange={handleStatusChange}
                                                onRoleChange={handleRoleChange}
                                            />    
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            <EditUserDialog
                user={selectedUser ? { 
                    ...selectedUser, 
                    role: selectedUser.role === "admin" ? "admin" : "user",
                    type: selectedUser.role === "parent" ? "parent" : "child"
                } : null}
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSave={handleSave}
            />
        </div>
    );
}

export default Users