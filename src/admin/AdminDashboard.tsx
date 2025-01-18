'use client'
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { BarChart, Users, Star, Coins } from 'lucide-react'
import UserActivityChart from "./UserActivityChart"
import * as Progress from '@radix-ui/react-progress'
import StatCard from "./StatCard"

const AdminDashboard: React.FC = () => {
    return (
        <div className="p-8 ml-10 mt-10 space-y-8 font-poppins">

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

            {/* Bottom Cards Row */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Top Performing Families Card */}
                <Card className="w-full">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base">Top Performing Families</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-10 mt-6">
                            {['Smith Family', 'Johnson Family', 'Williams Family'].map((family, index) => (
                                <div key={family} className="flex items-end justify-center space-x-4">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full  bg-[#3A8EBA]">
                                        <span className="text-lg font-bold text-white">{index + 1}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm font-medium">{family}</span>
                                            <span className="text-sm font-medium">{90 - index * 5}%</span>
                                        </div>
                                        <Progress.Root className="h-2.5 w-full bg-secondary overflow-hidden rounded-full">
                                            <Progress.Indicator
                                                className="h-full bg-[#028E4D] transition-all duration-500 ease-in-out"
                                                style={{ width: `${90 - index * 5}%` }}
                                            />
                                        </Progress.Root>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity Card */}
                <Card className="w-full">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {[
                                { user: 'Alice', action: 'completed a task', time: '2 minutes ago' },
                                { user: 'Bob', action: 'earned 50 coins', time: '15 minutes ago' },
                                { user: 'Charlie', action: 'added a new family member', time: '1 hour ago' },
                            ].map((activity, index) => (
                                <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-[#3A8EBA] flex items-center justify-center">
                                        <span className="text-primary-foreground text-lg font-semibold">{activity.user[0]}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{activity.user} {activity.action}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default AdminDashboard