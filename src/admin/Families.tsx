"use client"

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Progress } from "../components/ui/progress"
import { Button } from "../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { Textarea } from "../components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Users, Award, Mail, TrendingUp, ArrowUpDown } from 'lucide-react'
import StatCard from './StatCard'

interface Family {
    id: number;
    name: string;
    email: string;
    members: number;
    totalAchievements: number;
    overallProgress: number;
}

interface StatTrend {
    value: number;
    isPositive: boolean;
}

type SortField = 'members' | 'totalAchievements' | 'overallProgress';
type SortDirection = 'asc' | 'desc';

const initialFamilies: Family[] = [
    { id: 1, name: "Doe Family", email: "doe.family@example.com", members: 4, totalAchievements: 15, overallProgress: 80 },
    { id: 2, name: "Smith Family", email: "smith.family@example.com", members: 3, totalAchievements: 10, overallProgress: 65 },
    { id: 3, name: "Johnson Family", email: "johnson.family@example.com", members: 5, totalAchievements: 7, overallProgress: 90 },
    { id: 4, name: "Brown Family", email: "brown.family@example.com", members: 2, totalAchievements: 8, overallProgress: 55 },
];

const Families: React.FC = () => {
    const [families, setFamilies] = useState<Family[]>(initialFamilies);
    const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
    const [message, setMessage] = useState<string>("");
    const [search, setSearch] = useState<string>("");
    const [sortField, setSortField] = useState<SortField | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    const handleSendMessage = (): void => {
        if (!selectedFamily) return;
        console.log(`Sending message to ${selectedFamily.name} (${selectedFamily.email}): ${message}`);
        setMessage("");
        alert(`Message sent successfully to ${selectedFamily.name}!`);
    };

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            // If clicking the same field, toggle direction
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // If clicking a new field, set it and default to ascending
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
            family.name.toLowerCase().includes(search.toLowerCase())
        );

        if (!sortField) return filtered;

        return [...filtered].sort((a, b) => {
            const multiplier = sortDirection === 'asc' ? 1 : -1;
            return (a[sortField] - b[sortField]) * multiplier;
        });
    };

    const sortedFamilies = getSortedFamilies(families);
    const totalMembers = families.reduce((acc, family) => acc + family.members, 0);
    const totalAchievements = families.reduce((acc, family) => acc + family.totalAchievements, 0);
    const averageProgress = Math.round(families.reduce((acc, family) => acc + family.overallProgress, 0) / families.length);

    const getProgressColorClass = (progress: number): string => {
        if (progress >= 75) return 'text-green-600';
        if (progress >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

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
                    value={totalMembers.toString()}
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
                    title="Average Progress"
                    value={`${averageProgress}%`}
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
                                        Total Achievements
                                        <ArrowUpDown className={`h-4 w-4 ${getArrowStyle('totalAchievements')}`} />
                                    </div>
                                </TableHead>
                                <TableHead className="text-center cursor-pointer" onClick={() => handleSort('overallProgress')}>
                                    <div className="flex items-center justify-center gap-2">
                                        Overall Progress
                                        <ArrowUpDown className={`h-4 w-4 ${getArrowStyle('overallProgress')}`} />
                                    </div>
                                </TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedFamilies.map((family) => (
                                <TableRow key={family.id} className="cursor-pointer hover:bg-gray-100">
                                    <TableCell className="font-medium text-left">{family.name}</TableCell>
                                    <TableCell className="text-left">{family.email}</TableCell>
                                    <TableCell className="text-center">{family.members}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center">
                                            <Award className="h-4 w-4 mr-2 text-yellow-500" />
                                            {family.totalAchievements}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center">
                                            <Progress 
                                                value={family.overallProgress} 
                                                className="w-full mr-2"
                                            />
                                            <span className={`text-sm ${getProgressColorClass(family.overallProgress)}`}>
                                                {family.overallProgress}%
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="flex items-center gap-2 mx-auto"
                                                    onClick={() => setSelectedFamily(family)}
                                                >
                                                    <Mail className="h-4 w-4" />
                                                    Message
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        Send Message to {selectedFamily?.name}
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
                                                        className="w-full"
                                                    >
                                                        Send Message
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

export default Families;