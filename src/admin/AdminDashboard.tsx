'use client'
import React, { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { BarChart, Users, Star, Coins, Trophy, Target } from 'lucide-react'
import UserActivityChart from "./UserActivityChart"
import * as Progress from '@radix-ui/react-progress'
import StatCard from "./StatCard"
import { requestApi } from '../libs/requestApi'
import { requestMethods } from '../libs/enum/requestMethods'

interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    totalFamilies: number;
    totalStarsEarned: number;
    totalCoinsEarned: number;
    totalAchievements: number;
    totalStoreItems: number;
}

interface TopFamily {
    familyName: string;
    familyAvatar: string;
    totalStars: number;
    rank: number;
}

interface RecentActivity {
    user: string;
    action: string;
    time: string;
    avatar?: string;
}

// API Response Types
interface User {
    name?: string;
    stars?: number;
    coins?: number;
    status?: string;
    memberSince?: string;
    role?: string;
    avatar?: string;
}

interface Family {
    familyName?: string;
    familyAvatar?: string;
    totalStars?: number;
}

interface Achievement {
    id: string;
    name: string;
}

interface StoreItem {
    id: string;
    name: string;
}

interface LeaderboardEntry {
    familyName: string;
    familyAvatar: string;
    stars: number;
    rank: number;
}

interface LeaderboardResponse {
    weeklyTop10?: LeaderboardEntry[];
}

interface FamiliesResponse {
    families?: Family[];
}

interface AchievementsResponse {
    achievements?: Achievement[];
}

interface StoreResponse {
    items?: StoreItem[];
}

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        activeUsers: 0,
        totalFamilies: 0,
        totalStarsEarned: 0,
        totalCoinsEarned: 0,
        totalAchievements: 0,
        totalStoreItems: 0
    });
    const [topFamilies, setTopFamilies] = useState<TopFamily[]>([]);
    const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async (): Promise<User[]> => {
        try {
            const response = await requestApi({
                route: "/users/",
                method: requestMethods.GET
            });
            return response || [];
        } catch (error) {
            console.error("Error fetching users:", error);
            return [];
        }
    };

    const fetchFamilies = async (): Promise<Family[]> => {
        try {
            const response: FamiliesResponse = await requestApi({
                route: "/family/",
                method: requestMethods.GET
            });
            return response?.families || [];
        } catch (error) {
            console.error("Error fetching families:", error);
            return [];
        }
    };

    const fetchAchievements = async (): Promise<Achievement[]> => {
        try {
            const response: AchievementsResponse = await requestApi({
                route: "/achievements/",
                method: requestMethods.GET
            });
            return response?.achievements || [];
        } catch (error) {
            console.error("Error fetching achievements:", error);
            return [];
        }
    };

    const fetchStoreItems = async (): Promise<StoreItem[]> => {
        try {
            const response: StoreResponse = await requestApi({
                route: "/store/",
                method: requestMethods.GET
            });
            return response?.items || [];
        } catch (error) {
            console.error("Error fetching store items:", error);
            return [];
        }
    };

    const fetchLeaderboard = async (): Promise<LeaderboardResponse | null> => {
        try {
            const response: LeaderboardResponse = await requestApi({
                route: "/family/leaderboard",
                method: requestMethods.GET
            });
            return response || null;
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
            return null;
        }
    };

    const generateRecentActivities = useCallback((users: User[], families: Family[]) => {
        const activities: RecentActivity[] = [];
        
        if (users.length > 0) {
            // Sort users by memberSince (most recent first)
            const recentUsers = users
                .filter(user => user.memberSince)
                .sort((a, b) => {
                    const dateA = a.memberSince ? new Date(a.memberSince).getTime() : 0;
                    const dateB = b.memberSince ? new Date(b.memberSince).getTime() : 0;
                    return dateB - dateA;
                })
                .slice(0, 3);

            recentUsers.forEach((user) => {
                if (user.memberSince) {
                    const timeAgo = getTimeAgo(new Date(user.memberSince));
                    activities.push({
                        user: user.name || 'Unknown User',
                        action: user.role === 'parent' ? 'joined as a parent' : 'joined the family',
                        time: timeAgo,
                        avatar: user.avatar
                    });
                }
            });
        }

        // Add some family-related activities
        if (families.length > 0) {
            const recentFamilies = families.slice(0, 2);
            recentFamilies.forEach((family, index) => {
                activities.push({
                    user: family.familyName || 'Unknown Family',
                    action: 'created a new family',
                    time: `${index + 1} day${index > 0 ? 's' : ''} ago`,
                    avatar: family.familyAvatar
                });
            });
        }

        setRecentActivities(activities.slice(0, 4));
    }, []);

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            
            // Fetch all required data in parallel
            const [
                usersResponse,
                familiesResponse,
                achievementsResponse,
                storeResponse,
                leaderboardResponse
            ] = await Promise.all([
                fetchUsers(),
                fetchFamilies(),
                fetchAchievements(),
                fetchStoreItems(),
                fetchLeaderboard()
            ]);

            // Calculate stats from the responses
            const totalUsers = usersResponse?.length || 0;
            const activeUsers = usersResponse?.filter((user: User) => user.status !== 'banned')?.length || 0;
            const totalFamilies = familiesResponse?.length || 0;
            
            // Calculate total stars and coins from all users
            const totalStarsEarned = usersResponse?.reduce((sum: number, user: User) => sum + (user.stars || 0), 0) || 0;
            const totalCoinsEarned = usersResponse?.reduce((sum: number, user: User) => sum + (user.coins || 0), 0) || 0;
            
            const totalAchievements = achievementsResponse?.length || 0;
            const totalStoreItems = storeResponse?.length || 0;

            setStats({
                totalUsers,
                activeUsers,
                totalFamilies,
                totalStarsEarned,
                totalCoinsEarned,
                totalAchievements,
                totalStoreItems
            });

            // Set top families from leaderboard - get first 3 families from weekly leaderboard
            if (leaderboardResponse?.weeklyTop10 && leaderboardResponse.weeklyTop10.length > 0) {
                const topThree = leaderboardResponse.weeklyTop10.slice(0, 3).map((family: LeaderboardEntry) => ({
                    familyName: family.familyName,
                    familyAvatar: family.familyAvatar,
                    totalStars: family.stars,
                    rank: family.rank
                }));
                setTopFamilies(topThree);
            } else if (familiesResponse && familiesResponse.length > 0) {
                // Fallback: sort families by totalStars if leaderboard is not available
                const sortedFamilies = familiesResponse
                    .sort((a: Family, b: Family) => (b.totalStars || 0) - (a.totalStars || 0))
                    .slice(0, 3)
                    .map((family: Family, index: number) => ({
                        familyName: family.familyName || 'Unknown Family',
                        familyAvatar: family.familyAvatar || '',
                        totalStars: family.totalStars || 0,
                        rank: index + 1
                    }));
                setTopFamilies(sortedFamilies);
            }

            // Generate some recent activities based on real data
            generateRecentActivities(usersResponse, familiesResponse);

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    }, [generateRecentActivities]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const getTimeAgo = (date: Date): string => {
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInDays > 0) {
            return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        } else if (diffInHours > 0) {
            return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        } else {
            return 'Less than an hour ago';
        }
    };

    const getProgressPercentage = (stars: number, maxStars: number = 1000): number => {
        return Math.min((stars / maxStars) * 100, 100);
    };

    if (loading) {
        return (
            <div className="p-8 ml-10 mt-10 space-y-8 font-poppins">
                <h2 className="font-poppins text-lg font-semibold">Admin Dashboard</h2>
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg">Loading dashboard data...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 ml-10 mt-10 space-y-8 font-poppins">
            <h2 className="font-poppins text-lg font-semibold">Admin Dashboard</h2>

            {/* Stats Cards Row */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers.toString()}
                    icon={<Users className="h-5 w-5 text-primary" />}
                    trend={{ value: 12, isPositive: true }}
                    padding={"pl-10"}
                />
                <StatCard
                    title="Active Families"
                    value={stats.totalFamilies.toString()}
                    icon={<BarChart className="h-5 w-5 text-primary" />}
                    trend={{ value: 8, isPositive: true }}
                    padding={"pl-10"}
                />
                <StatCard
                    title="Total Stars Earned"
                    value={stats.totalStarsEarned.toLocaleString()}
                    icon={<Star className="h-5 w-5 text-primary" />}
                    trend={{ value: 25, isPositive: true }}
                    padding={"pl-10"}
                />
                <StatCard
                    title="Total Coins Earned"
                    value={stats.totalCoinsEarned.toLocaleString()}
                    icon={<Coins className="h-5 w-5 text-primary" />}
                    trend={{ value: 30, isPositive: true }}
                    padding={"pl-10"}
                />
            </div>

            {/* Additional Stats Row */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title="Active Users"
                    value={stats.activeUsers.toString()}
                    icon={<Users className="h-5 w-5 text-green-600" />}
                    trend={{ value: 15, isPositive: true }}
                    padding={"pl-10"}
                />
                <StatCard
                    title="Total Achievements"
                    value={stats.totalAchievements.toString()}
                    icon={<Trophy className="h-5 w-5 text-yellow-600" />}
                    trend={{ value: 5, isPositive: true }}
                    padding={"pl-10"}
                />
                <StatCard
                    title="Store Items"
                    value={stats.totalStoreItems.toString()}
                    icon={<Target className="h-5 w-5 text-blue-600" />}
                    trend={{ value: 10, isPositive: true }}
                    padding={"pl-10"}
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
                            {topFamilies.length > 0 ? (
                                topFamilies.map((family, index) => (
                                    <div key={index} className="flex items-end justify-center space-x-4">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#3A8EBA]">
                                            <span className="text-lg font-bold text-white">{family.rank}</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-sm font-medium">{family.familyName}</span>
                                                <span className="text-sm font-medium">{family.totalStars} stars</span>
                                            </div>
                                            <Progress.Root className="h-2.5 w-full bg-secondary overflow-hidden rounded-full">
                                                <Progress.Indicator
                                                    className="h-full bg-[#028E4D] transition-all duration-500 ease-in-out"
                                                    style={{ width: `${getProgressPercentage(family.totalStars)}%` }}
                                                />
                                            </Progress.Root>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-500">No family data available</div>
                            )}
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
                            {recentActivities.length > 0 ? (
                                recentActivities.map((activity, index) => (
                                    <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-[#3A8EBA] flex items-center justify-center overflow-hidden">
                                            {activity.avatar ? (
                                                <img 
                                                    src={activity.avatar} 
                                                    alt={activity.user} 
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                        const parent = target.parentElement;
                                                        if (parent) {
                                                            parent.innerHTML = `<span class="text-primary-foreground text-lg font-semibold">${activity.user[0]}</span>`;
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <span className="text-primary-foreground text-lg font-semibold">{activity.user[0]}</span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{activity.user} {activity.action}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-500">No recent activity</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default AdminDashboard