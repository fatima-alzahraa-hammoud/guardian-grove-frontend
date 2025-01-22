"use client"

import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../components/ui/dialog"
import { Card } from "../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { ArrowUpDown, Search, Plus, ImageIcon } from 'lucide-react'

interface Achievement {
    id: number
    name: string
    description: string
    category: string
    reward: string
    image: string
}

// Mock data with image URLs
const initialAchievements: Achievement[] = [
    { id: 1, name: 'First Steps', description: 'Complete your first task', category: 'Beginner', reward: '10 stars', image: '/placeholder.svg?height=100&width=100' },
    { id: 2, name: 'Team Player', description: 'Help a family member with their task', category: 'Collaboration', reward: '20 stars', image: '/placeholder.svg?height=100&width=100' },
    { id: 3, name: 'Consistency King', description: 'Complete tasks for 7 days in a row', category: 'Dedication', reward: '50 stars', image: '/placeholder.svg?height=100&width=100' },
    { id: 4, name: 'Super Saver', description: 'Save 100 coins', category: 'Financial', reward: 'Special avatar item', image: '/placeholder.svg?height=100&width=100' },
]

const AdminAchievements: React.FC = () => {
    const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements)
    const [newAchievement, setNewAchievement] = useState<Omit<Achievement, 'id'>>({ name: '', description: '', category: '', reward: '', image: '' })
    const [searchTerm, setSearchTerm] = useState('')
    const [sortConfig, setSortConfig] = useState<{ key: keyof Achievement | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' })
    const [selectedCategory, setSelectedCategory] = useState('all')

    const uniqueCategories = ['all', ...Array.from(new Set(achievements.map(achievement => achievement.category)))]

    const handleSort = (key: keyof Achievement) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
        setSortConfig({ key, direction })
    }

    const handleAddAchievement = () => {
        if (newAchievement.name && newAchievement.description && newAchievement.category && newAchievement.reward) {
            setAchievements([...achievements, { 
                id: achievements.length + 1, 
                ...newAchievement,
                image: newAchievement.image || '/placeholder.svg?height=100&width=100'
            }])
            setNewAchievement({ name: '', description: '', category: '', reward: '', image: '' })
        }
    }

    const filteredAndSortedAchievements = achievements.filter(achievement => {
        const matchesSearch = achievement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            achievement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            achievement.category.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory === 'all' || achievement.category === selectedCategory
        return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
        if (!sortConfig.key) return 0
        
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]
        
        return sortConfig.direction === 'asc' 
            ? String(aValue).localeCompare(String(bValue))
            : String(bValue).localeCompare(String(aValue))
    })

    return (
        <div className="p-8 ml-10 mt-10 space-y-8 font-poppins">
            <h2 className="font-poppins text-lg font-semibold">Achievement Management</h2>

            <Card className="p-6 w-[1080px]">
                <div className="space-y-6">
                    <div className="flex justify-end items-center">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="bg-[#3A8EBA] hover:bg-[#347ea5]">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add New Achievement
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Add New Achievement</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="flex items-center gap-4">
                                        <ImageIcon className="h-12 w-12 text-gray-400" />
                                        <Input
                                        type='file'
                                        placeholder="Image URL"
                                        value={newAchievement.image}
                                        onChange={(e) => setNewAchievement({ ...newAchievement, image: e.target.value })}
                                        />
                                    </div>
                                    <Input
                                        placeholder="Achievement Name"
                                        value={newAchievement.name}
                                        onChange={(e) => setNewAchievement({ ...newAchievement, name: e.target.value })}
                                    />
                                    <Input
                                        placeholder="Description"
                                        value={newAchievement.description}
                                        onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                                    />
                                    <Input
                                        placeholder="Reward"
                                        value={newAchievement.reward}
                                        onChange={(e) => setNewAchievement({ ...newAchievement, reward: e.target.value })}
                                    />
                                    <Select
                                        value={newAchievement.category}
                                        onValueChange={(value) => setNewAchievement({ ...newAchievement, category: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {uniqueCategories.filter(cat => cat !== 'all').map(category => (
                                                <SelectItem key={category} value={category}>
                                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleAddAchievement} className="bg-[#3A8EBA] hover:bg-[#347ea5]">
                                        Add Achievement
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="flex gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search achievements..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <Select
                                value={selectedCategory}
                                onValueChange={setSelectedCategory}
                            >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {uniqueCategories.map(category => (
                                <SelectItem key={category} value={category}>
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className='pl-4'>Image</TableHead>
                                    <TableHead onClick={() => handleSort('name')} className="cursor-pointer hover:bg-gray-50">
                                        <div className="flex items-center">
                                            Name
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </div>
                                    </TableHead>
                                    <TableHead onClick={() => handleSort('description')} className="cursor-pointer hover:bg-gray-50">
                                        <div className="flex items-center">
                                            Description
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </div>
                                    </TableHead>
                                    <TableHead onClick={() => handleSort('category')} className="cursor-pointer hover:bg-gray-50">
                                        <div className="flex items-center">
                                            Category
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </div>
                                    </TableHead>
                                    <TableHead onClick={() => handleSort('reward')} className="cursor-pointer hover:bg-gray-50">
                                        <div className="flex items-center">
                                            Reward
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </div>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAndSortedAchievements.map((achievement) => (
                                <TableRow key={achievement.id} className="hover:bg-gray-50">
                                    <TableCell>
                                    <img
                                        src={achievement.image || "/placeholder.svg"}
                                        alt={achievement.name}
                                        width={48}
                                        height={48}
                                        className="rounded-md object-cover pl-4"
                                    />
                                    </TableCell>
                                    <TableCell className="font-medium">{achievement.name}</TableCell>
                                    <TableCell>{achievement.description}</TableCell>
                                    <TableCell>{achievement.category}</TableCell>
                                    <TableCell>{achievement.reward}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default AdminAchievements

