'use client'
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { BarChart, Users, Star, Coins } from 'lucide-react'
import UserActivityChart from "./UserActivityChart"
import * as Progress from '@radix-ui/react-progress'
import StatCard from "./StatCard"

const AdminDashboard: React.FC = () => {
    return (
        <div className="p-8 ml-10 mt-10 space-y-8">

            <h2 className="font-poppins text-lg font-semibold">Admin Dashboard</h2>

            {/* Stats Cards Row */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Users"
                    value="1,234"
                    icon={<Users className="h-5 w-5 text-primary" />}
                    trend={{ value: 20, isPositive: true }}
                />
                <StatCard
                    title="Active Families"
                    value="567"
                    icon={<BarChart className="h-5 w-5 text-primary" />}
                    trend={{ value: 15, isPositive: true }}
                />
                <StatCard
                    title="Total Stars Earned"
                    value="50,234"
                    icon={<Star className="h-5 w-5 text-primary" />}
                    trend={{ value: 25, isPositive: true }}
                />
                <StatCard
                    title="Total Coins Earned"
                    value="100,567"
                    icon={<Coins className="h-5 w-5 text-primary" />}
                    trend={{ value: 30, isPositive: true }}
                />
            </div>

            {/* Chart Section */}
            <div className="w-full">
                <UserActivityChart />
            </div>

        </div>
    )
}

export default AdminDashboard