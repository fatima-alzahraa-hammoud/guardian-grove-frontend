"use client"
import React from 'react';

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
    return(
        <div className="p-8 ml-10 mt-10 space-y-8 font-poppins">

            <h2 className="font-poppins text-lg font-semibold">Users</h2>
        </div>
    );
}

export default Users