"use client"

import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Progress } from "../components/ui/progress"
import { Button } from "../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { Textarea } from "../components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Users, Award, Mail, TrendingUp, ArrowUpDown } from 'lucide-react'
import StatCard from './StatCard'
import { requestApi } from '../libs/requestApi'
import { requestMethods } from '../libs/enum/requestMethods'

interface Family {
    _id: string;
    familyName: string;
    email: string;
    members: any[];
    totalStars: number;
    achievements: any[];
    familyAvatar?: string;
}

interface StatTrend {
    value: number;
    isPositive: boolean;
}

type SortField = 'members' | 'totalAchievements' | 'totalStars';
type SortDirection = 'asc' | 'desc';

const Families: React.FC = () => {
    const [families, setFamilies] = useState<Family[]>([]);
    const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
    const [message, setMessage] = useState<string>("");
    const [search, setSearch] = useState<string>("");
    const [sortField, setSortField] = useState<SortField | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchFamilies();
    }, []);

    const fetchFamilies = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log("Fetching families...");
            
            const response = await requestApi({
                route: "/family/", // Using your existing backend endpoint
                method: requestMethods.GET
            });

            console.log("Families response:", response);

            if (response && response.families && response.families.length > 0) {
                console.log("Processing families data...");
                
                // Fetch members for each family to get accurate member count
                const familiesWithMembers = await Promise.all(
                    response.families.map(async (family: any) => {
                        try {
                            console.log(`Fetching members for family ${family._id}`);
                            const membersResponse = await requestApi({
                                route: "/family/FamilyMembers",
                                method: requestMethods.POST,
                                body: { familyId: family._id }
                            });
                            
                            const members = membersResponse?.familyWithMembers?.members || [];
                            console.log(`Family ${family.familyName} has ${members.length} members`);
                            
                            return {
                                ...family,
                                members: members
                            };
                        } catch (error) {
                            console.error(`Error fetching members for family ${family._id}:`, error);
                            return {
                                ...family,
                                members: []
                            };
                        }
                    })
                );
                
                console.log("Final families data:", familiesWithMembers);
                setFamilies(familiesWithMembers);
            } else {
                console.log("No families found in response");
                setFamilies([]);
                if (!response) {
                    setError("Failed to fetch families - no response");
                }
            }
        } catch (error) {
            console.error("Error fetching families:", error);
            setError("Failed to fetch families");
            setFamilies([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = (): void => {
        if (!selectedFamily) return;
        console.log(`Sending message to ${selectedFamily.familyName} (${selectedFamily.email}): ${message}`);
        setMessage("");
        alert(`Message sent successfully to ${selectedFamily.familyName}!`);
    };

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getArrowStyle = (field: SortField) => {
        return `transition-transform duration-200 ${
            sortField === field && sortDirection === 'desc' ? 'transform rotate-180' : ''
        }`;
    };

    const getSortedFamilies = (families: Family[]) => {
        const filtered = families.filter(family =>
            family.familyName.toLowerCase().includes(search.toLowerCase())
        );

        if (!sortField) return filtered;

        return [...filtered].sort((a, b) => {
            let aValue: number, bValue: number;
            
            switch (sortField) {
                case 'members':
                    aValue = a.members.length;
                    bValue = b.members.length;
                    break;
                case 'totalAchievements':
                    aValue = a.achievements.length;
                    bValue = b.achievements.length;
                    break;
                case 'totalStars':
                    aValue = a.totalStars || 0;
                    bValue = b.totalStars || 0;
                    break;
                default:
                    return 0;
            }
            
            const multiplier = sortDirection === 'asc' ? 1 : -1;
            return (aValue - bValue) * multiplier;
        });
    };

    const sortedFamilies = getSortedFamilies(families);
    const totalAchievements = families.reduce((acc, family) => acc + family.achievements.length, 0);
    const totalStars = families.reduce((acc, family) => acc + (family.totalStars || 0), 0);

    const getProgressPercentage = (stars: number, maxStars: number = 1000): number => {
        return Math.min((stars / maxStars) * 100, 100);
    };

    const getProgressColorClass = (progress: number): string => {
        if (progress >= 75) return 'text-green-600';
        if (progress >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    if (loading) {
        return (
            <div className="p-8 ml-10 mt-10 space-y-8 font-poppins">
                <h2 className="text-lg font-semibold">Families</h2>
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg">Loading families data...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 ml-10 mt-10 space-y-8 font-poppins">
                <h2 className="text-lg font-semibold">Families</h2>
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-red-600">{error}</div>
                    <button 
                        onClick={fetchFamilies}
                        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 ml-10 mt-10 space-y-8 font-poppins">
            <h2 className="text-lg font-semibold">Families</h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Families"
                    value={families.length.toString()}
                    icon={<Users className="h-5 w-5 text-primary" />}
                    trend={{ value: 12, isPositive: true } as StatTrend}
                    padding="pl-10"
                />
                <StatCard
                    title="Total Members"
                    value="18"
                    icon={<Users className="h-5 w-5 text-primary" />}
                    trend={{ value: 8, isPositive: true } as StatTrend}
                    padding="pl-10"
                />
                <StatCard
                    title="Total Achievements"
                    value={totalAchievements.toString()}
                    icon={<Award className="h-5 w-5 text-primary" />}
                    trend={{ value: 15, isPositive: true } as StatTrend}
                    padding="pl-10"
                />
                <StatCard
                    title="Total Stars"
                    value={totalStars.toLocaleString()}
                    icon={<TrendingUp className="h-5 w-5 text-primary" />}
                    trend={{ value: 5, isPositive: true } as StatTrend}
                    padding="pl-10"
                />
            </div>

            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="text-base">Family List</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between mb-4">
                        <Input
                            placeholder="Search families..."
                            value={search}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                            className="w-64"
                        />
                        <Button 
                            onClick={fetchFamilies}
                            variant="outline"
                            className="text-[#3A8EBA] border-[#3A8EBA] hover:bg-[#3A8EBA] hover:text-white"
                        >
                            Refresh
                        </Button>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-left">Family Name</TableHead>
                                <TableHead className="text-left">Email</TableHead>
                                <TableHead className="text-center cursor-pointer" onClick={() => handleSort('members')}>
                                    <div className="flex items-center justify-center gap-2">
                                        Members
                                        <ArrowUpDown className={`h-4 w-4 ${getArrowStyle('members')}`} />
                                    </div>
                                </TableHead>
                                <TableHead className="text-center cursor-pointer" onClick={() => handleSort('totalAchievements')}>
                                    <div className="flex items-center justify-center gap-2">
                                        Achievements
                                        <ArrowUpDown className={`h-4 w-4 ${getArrowStyle('totalAchievements')}`} />
                                    </div>
                                </TableHead>
                                <TableHead className="text-center cursor-pointer" onClick={() => handleSort('totalStars')}>
                                    <div className="flex items-center justify-center gap-2">
                                        Total Stars
                                        <ArrowUpDown className={`h-4 w-4 ${getArrowStyle('totalStars')}`} />
                                    </div>
                                </TableHead>
                                <TableHead className="text-center">Progress</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedFamilies.length > 0 ? (
                                sortedFamilies.map((family) => {
                                    const progressPercentage = getProgressPercentage(family.totalStars || 0);
                                    return (
                                        <TableRow key={family._id} className="cursor-pointer hover:bg-gray-100">
                                            <TableCell className="font-medium text-left">
                                                <div className="flex items-center gap-3">
                                                    {family.familyAvatar && (
                                                        <img 
                                                            src={family.familyAvatar} 
                                                            alt={family.familyName}
                                                            className="w-8 h-8 rounded-full object-cover"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.style.display = 'none';
                                                            }}
                                                        />
                                                    )}
                                                    {family.familyName}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-left">{family.email}</TableCell>
                                            <TableCell className="text-center">{family.members.length}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center">
                                                    <Award className="h-4 w-4 mr-2 text-yellow-500" />
                                                    {family.achievements.length}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className="font-medium">{family.totalStars || 0}</span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center">
                                                    <Progress 
                                                        value={progressPercentage} 
                                                        className="w-full mr-2"
                                                    />
                                                    <span className={`text-sm ${getProgressColorClass(progressPercentage)}`}>
                                                        {Math.round(progressPercentage)}%
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm" 
                                                            className="flex items-center gap-2 mx-auto text-[#3A8EBA] border-[#3A8EBA] hover:bg-[#3A8EBA] hover:text-white"
                                                            onClick={() => setSelectedFamily(family)}
                                                        >
                                                            <Mail className="h-4 w-4" />
                                                            Message
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Send Message to {selectedFamily?.familyName}
                                                            </DialogTitle>
                                                        </DialogHeader>
                                                        <div className="grid gap-4 py-4">
                                                            <div className="text-sm text-gray-500">
                                                                Sending to: {selectedFamily?.email}
                                                            </div>
                                                            <Textarea
                                                                placeholder="Type your message here..."
                                                                value={message}
                                                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                                                                className="min-h-[100px]"
                                                            />
                                                            <Button 
                                                                onClick={handleSendMessage}
                                                                className="w-full bg-[#3A8EBA] hover:bg-[#347ea5]"
                                                            >
                                                                Send Message
                                                            </Button>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8">
                                        <div className="text-gray-500">
                                            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                            <p>No families found</p>
                                            <Button 
                                                onClick={fetchFamilies}
                                                variant="outline"
                                                className="mt-2"
                                            >
                                                Refresh
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

export default Families;