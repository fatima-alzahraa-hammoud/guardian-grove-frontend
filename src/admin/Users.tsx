"use client"

import React, { useState } from 'react';
import StatCard from './StatCard';
import { Coins, UserCheck, UserPlus, UsersIcon, UserX } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import UserManageDialog from '../components/common/UserManageDialog';
import EditUserDialog from '../components/common/EditUserDialog';


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

// Mock data
const initialUsers: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', type: 'parent', role: 'user', status: 'active', achievements: 5, progress: 75, stars: 100, coins: 500 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', type: 'child', role: 'user', status: 'active', achievements: 3, progress: 60, stars: 75, coins: 300 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', type: 'parent', role: 'admin', status: 'active', achievements: 7, progress: 90, stars: 150, coins: 750 },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', type: 'child', role: 'user', status: 'banned', achievements: 2, progress: 40, stars: 50, coins: 200 },
  ]

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>(initialUsers);

    const activeUsers = users.filter(user => user.status === 'active').length;
    const parentUsers = users.filter(user => user.type === 'parent').length;
    const bannedUsers = users.filter(user => user.status === 'banned').length;

    const [filter, setFilter] = useState<'all' | 'parent' | 'child'>('all')
    const [search, setSearch] = useState('')
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleRowClick = (user: User) => {
      setSelectedUser(user);
      setIsDialogOpen(true);
    };
  
    const handleSave = (updatedUser: User) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
    };
  
    const filteredUsers = users.filter(user =>
        (filter === 'all' || user.type === filter) &&
        user.name.toLowerCase().includes(search.toLowerCase())
    )

    const handleStatusChange = (userId: number, newStatus: 'active' | 'banned') => {
        setUsers(users.map(user =>
            user.id === userId ? { ...user, status: newStatus } : user
        ))
      }
    
    const handleRoleChange = (userId: number, newRole: 'user' | 'admin') => {
        setUsers(users.map(user =>
            user.id === userId ? { ...user, role: newRole } : user
        ))
    }


    return(
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
                                <SelectValue placeholder="Filter by type" />
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
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
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
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell className="capitalize">{user.type}</TableCell>
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
                                        <UserManageDialog
                                            user={user}
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

            <EditUserDialog
                user={selectedUser}
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSave={handleSave}
            />
        </div>
    );
}

export default Users