"use client"

import React, { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../components/ui/dialog"
import { Card } from "../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { ArrowUpDown, Search, Plus, ImageIcon, Edit, Trash2, Loader2 } from 'lucide-react'
import { requestApi } from '../libs/requestApi'
import { requestMethods } from '../libs/enum/requestMethods'

// Single Achievement interface based on API
interface Achievement {
    _id?: string
    id?: string | number
    title: string
    description: string
    criteria: string
    starsReward?: number
    coinsReward?: number
    photo?: string
    type?: string
}

interface AchievementsResponse {
    achievements?: Achievement[]
}

const AdminAchievements: React.FC = () => {
    const [achievements, setAchievements] = useState<Achievement[]>([])
    const [newAchievement, setNewAchievement] = useState<Omit<Achievement, '_id' | 'id'>>({ 
        title: '', 
        description: '', 
        criteria: '',
        starsReward: 0,
        coinsReward: 0,
        type: 'personal', 
        photo: '' 
    })
    const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortConfig, setSortConfig] = useState<{ key: keyof Achievement | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' })
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    // Fetch achievements from backend
    const fetchAchievements = async () => {
        try {
            setLoading(true)
            setError(null)
            console.log("Fetching achievements...")
            
            const response = await requestApi({
                route: "/achievements/",
                method: requestMethods.GET
            })
            
            console.log("Raw achievements response:", response)
            
            let apiAchievements: Achievement[] = []
            
            // Handle different response formats
            if (Array.isArray(response)) {
                apiAchievements = response
            } else if (response && typeof response === 'object' && 'achievements' in response) {
                apiAchievements = (response as AchievementsResponse).achievements || []
            } else if (response && typeof response === 'object') {
                apiAchievements = [response as Achievement]
            } else {
                console.warn("Unexpected response format:", response)
                apiAchievements = []
            }
            
            console.log("Extracted achievements:", apiAchievements)
            
            setAchievements(apiAchievements)
        } catch (error) {
            console.error("Error fetching achievements:", error)
            setError("Failed to fetch achievements. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    // Create new achievement
    const createAchievement = async (achievementData: Omit<Achievement, '_id' | 'id'>) => {
        try {
            setSubmitting(true)
            console.log("Creating achievement:", achievementData)
            
            const response = await requestApi({
                route: "/achievements/",
                method: requestMethods.POST,
                body: achievementData
            })
            
            console.log("Create response:", response)
            
            // Refresh achievements list
            await fetchAchievements()
            
            setIsAddDialogOpen(false)
            setNewAchievement({ title: '', description: '', criteria: '', starsReward: 0, coinsReward: 0, type: 'personal', photo: '' })
        } catch (error) {
            console.error("Error creating achievement:", error)
            setError("Failed to create achievement. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    // Update existing achievement
    const updateAchievement = async (achievementData: Achievement) => {
        try {
            setSubmitting(true)
            console.log("Updating achievement:", achievementData)
            
            const response = await requestApi({
                route: `/achievements/`,
                method: requestMethods.PUT,
                body: {
                    achievementId: achievementData._id || achievementData.id,
                    ...achievementData
                }
            })
            
            console.log("Update response:", response)
            
            // Refresh achievements list
            await fetchAchievements()
            
            setIsEditDialogOpen(false)
            setEditingAchievement(null)
        } catch (error) {
            console.error("Error updating achievement:", error)
            setError("Failed to update achievement. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    // Delete achievement
    const deleteAchievement = async (achievementId: string | number) => {
        try {
            console.log("Deleting achievement:", achievementId)
            
            const response = await requestApi({
                route: `/achievements/delete`,
                method: requestMethods.DELETE,
                body: { achievementId: achievementId }
            })
            
            console.log("Delete response:", response)
            
            // Refresh achievements list
            await fetchAchievements()
        } catch (error) {
            console.error("Error deleting achievement:", error)
            setError("Failed to delete achievement. Please try again.")
        }
    }

    useEffect(() => {
        fetchAchievements()
    }, [])

    const uniqueCategories = ['all', ...Array.from(new Set(achievements.map(achievement => achievement.type || 'general')))]

    const handleSort = (key: keyof Achievement) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
        setSortConfig({ key, direction })
    }

    const handleAddAchievement = () => {
        if (newAchievement.title && newAchievement.description && newAchievement.criteria && newAchievement.type) {
            createAchievement(newAchievement)
        }
    }

    const handleEditAchievement = (achievement: Achievement) => {
        setEditingAchievement(achievement)
        setIsEditDialogOpen(true)
    }

    const handleUpdateAchievement = () => {
        if (editingAchievement) {
            updateAchievement(editingAchievement)
        }
    }

    const handleDeleteAchievement = (achievementId: string | number) => {
        if (window.confirm('Are you sure you want to delete this achievement?')) {
            deleteAchievement(achievementId)
        }
    }

    const filteredAndSortedAchievements = achievements.filter(achievement => {
        const matchesSearch = (achievement.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (achievement.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (achievement.type || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory === 'all' || achievement.type === selectedCategory
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

    if (loading) {
        return (
            <div className="p-8 ml-10 mt-10 space-y-8 font-poppins">
                <h2 className="font-poppins text-lg font-semibold">Achievement Management</h2>
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2 text-lg">Loading achievements...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8 ml-10 mt-10 space-y-8 font-poppins">
            <h2 className="font-poppins text-lg font-semibold">Achievement Management</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                    <button 
                        onClick={() => setError(null)}
                        className="ml-2 text-red-900 hover:text-red-700"
                    >
                        ×
                    </button>
                </div>
            )}

            <Card className="p-6 w-[1080px]">
                <div className="space-y-6">
                    <div className="flex justify-end items-center">
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                                            placeholder="Image URL"
                                            value={newAchievement.photo}
                                            onChange={(e) => setNewAchievement({ ...newAchievement, photo: e.target.value })}
                                        />
                                    </div>
                                    <Input
                                        placeholder="Achievement Name"
                                        value={newAchievement.title}
                                        onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                                    />
                                    <Input
                                        placeholder="Description"
                                        value={newAchievement.description}
                                        onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                                    />
                                    <Input
                                        placeholder="Criteria"
                                        value={newAchievement.criteria}
                                        onChange={(e) => setNewAchievement({ ...newAchievement, criteria: e.target.value })}
                                    />
                                    <Select
                                        value={newAchievement.type}
                                        onValueChange={(value) => setNewAchievement({ ...newAchievement, type: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="personal">Personal</SelectItem>
                                            <SelectItem value="family">Family</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input
                                            type="number"
                                            placeholder="Stars Reward"
                                            value={newAchievement.starsReward || ''}
                                            onChange={(e) => setNewAchievement({ 
                                                ...newAchievement, 
                                                starsReward: e.target.value ? parseInt(e.target.value) : 0 
                                            })}
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Coins Reward"
                                            value={newAchievement.coinsReward || ''}
                                            onChange={(e) => setNewAchievement({ 
                                                ...newAchievement, 
                                                coinsReward: e.target.value ? parseInt(e.target.value) : 0 
                                            })}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button 
                                        onClick={handleAddAchievement} 
                                        className="bg-[#3A8EBA] hover:bg-[#347ea5]"
                                        disabled={submitting}
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Adding...
                                            </>
                                        ) : (
                                            'Add Achievement'
                                        )}
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
                                        {(category || 'Unknown').charAt(0).toUpperCase() + (category || 'Unknown').slice(1)}
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
                                    <TableHead onClick={() => handleSort('title')} className="cursor-pointer hover:bg-gray-50">
                                        <div className="flex items-center">
                                            Title
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </div>
                                    </TableHead>
                                    <TableHead onClick={() => handleSort('description')} className="cursor-pointer hover:bg-gray-50">
                                        <div className="flex items-center">
                                            Description
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </div>
                                    </TableHead>
                                    <TableHead onClick={() => handleSort('type')} className="cursor-pointer hover:bg-gray-50">
                                        <div className="flex items-center">
                                            Type
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </div>
                                    </TableHead>
                                    <TableHead>Criteria</TableHead>
                                    <TableHead>Stars Reward</TableHead>
                                    <TableHead>Coins Reward</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAndSortedAchievements.map((achievement) => (
                                    <TableRow key={achievement._id || achievement.id} className="hover:bg-gray-50">
                                        <TableCell>
                                            <img
                                                src={achievement.photo || "/placeholder.svg"}
                                                alt={achievement.title}
                                                width={48}
                                                height={48}
                                                className="rounded-md object-cover pl-4"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{achievement.title}</TableCell>
                                        <TableCell>{achievement.description}</TableCell>
                                        <TableCell>{achievement.type}</TableCell>
                                        <TableCell>{achievement.criteria}</TableCell>
                                        <TableCell>{achievement.starsReward || 0}</TableCell>
                                        <TableCell>{achievement.coinsReward || 0}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEditAchievement(achievement)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteAchievement(achievement._id || achievement.id || '')}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </Card>

            {/* Edit Achievement Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Achievement</DialogTitle>
                    </DialogHeader>
                    {editingAchievement && (
                        <div className="grid gap-4 py-4">
                            <div className="flex items-center gap-4">
                                <ImageIcon className="h-12 w-12 text-gray-400" />
                                <Input
                                    placeholder="Image URL"
                                    value={editingAchievement.photo || ''}
                                    onChange={(e) => setEditingAchievement({ ...editingAchievement, photo: e.target.value })}
                                />
                            </div>
                            <Input
                                placeholder="Achievement Name"
                                value={editingAchievement.title}
                                onChange={(e) => setEditingAchievement({ ...editingAchievement, title: e.target.value })}
                            />
                            <Input
                                placeholder="Description"
                                value={editingAchievement.description}
                                onChange={(e) => setEditingAchievement({ ...editingAchievement, description: e.target.value })}
                            />
                            <Input
                                placeholder="Criteria"
                                value={editingAchievement.criteria}
                                onChange={(e) => setEditingAchievement({ ...editingAchievement, criteria: e.target.value })}
                            />
                            <Select
                                value={editingAchievement.type}
                                onValueChange={(value) => setEditingAchievement({ ...editingAchievement, type: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="personal">Personal</SelectItem>
                                    <SelectItem value="family">Family</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="grid grid-cols-2 gap-2">
                                <Input
                                    type="number"
                                    placeholder="Stars Reward"
                                    value={editingAchievement.starsReward || ''}
                                    onChange={(e) => setEditingAchievement({ 
                                        ...editingAchievement, 
                                        starsReward: e.target.value ? parseInt(e.target.value) : 0 
                                    })}
                                />
                                <Input
                                    type="number"
                                    placeholder="Coins Reward"
                                    value={editingAchievement.coinsReward || ''}
                                    onChange={(e) => setEditingAchievement({ 
                                        ...editingAchievement, 
                                        coinsReward: e.target.value ? parseInt(e.target.value) : 0 
                                    })}
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button 
                            onClick={handleUpdateAchievement} 
                            className="bg-[#3A8EBA] hover:bg-[#347ea5]"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Update Achievement'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AdminAchievements