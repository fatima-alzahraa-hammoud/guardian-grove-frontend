"use client"

import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../components/ui/dialog"
import { Card } from "../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { ArrowUpDown, Search, Plus, ImageIcon } from 'lucide-react'

interface StoreItem {
  id: number
  name: string
  price: number
  category: string
  image: string
}

// Mock data with image URLs
const initialItems: StoreItem[] = [
  { id: 1, name: 'Virtual Pet', price: 100, category: 'Pets', image: '/placeholder.svg?height=100&width=100' },
  { id: 2, name: 'Custom Avatar', price: 200, category: 'Customization', image: '/placeholder.svg?height=100&width=100' },
  { id: 3, name: 'Power-up', price: 50, category: 'Boosters', image: '/placeholder.svg?height=100&width=100' },
  { id: 4, name: 'Rare Background', price: 300, category: 'Customization', image: '/placeholder.svg?height=100&width=100' },
]

const AdminStore : React.FC = () => {
  const [items, setItems] = useState<StoreItem[]>(initialItems)
  const [newItem, setNewItem] = useState<Omit<StoreItem, 'id'>>({ name: '', price: 0, category: '', image: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{ key: keyof StoreItem | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' })
  const [selectedCategory, setSelectedCategory] = useState('all')

  const uniqueCategories = ['all', ...Array.from(new Set(items.map(item => item.category)))]

  const handleSort = (key: keyof StoreItem) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    setSortConfig({ key, direction })
  }

  const handleAddItem = () => {
    if (newItem.name && newItem.price && newItem.category) {
      setItems([...items, { 
        id: items.length + 1, 
        ...newItem,
        image: newItem.image || '/placeholder.svg?height=100&width=100'
      }])
      setNewItem({ name: '', price: 0, category: '', image: '' })
    }
  }

  const filteredAndSortedItems = items
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0
      
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      return sortConfig.direction === 'asc' 
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue))
    })

    return (
        <div className="p-8 ml-10 mt-10 space-y-8 font-poppins">

            <h2 className="font-poppins text-lg font-semibold">Store Management</h2>

                <Card className="p-6 w-[1000px]">
                    <div className="space-y-6">
                        <div className="flex justify-end items-center">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="bg-[#3A8EBA] hover:bg-[#347ea5]">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add New Item
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Add New Store Item</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="flex items-center gap-4">
                                            <ImageIcon className="h-12 w-12 text-gray-400" />
                                            <Input
                                                type='file'
                                                placeholder="Image URL"
                                                value={newItem.image}
                                                onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                                            />
                                        </div>
                                        <Input
                                            placeholder="Item Name"
                                            value={newItem.name}
                                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Price"
                                            value={newItem.price.toString()}
                                            onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                                        />
                                        <Input
                                            placeholder="Category"
                                            value={newItem.category}
                                            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleAddItem} className="bg-[#3A8EBA] hover:bg-[#347ea5]">
                                            Add Item
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="flex gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Search items..."
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
                                        <TableHead>Image</TableHead>
                                        <TableHead onClick={() => handleSort('name')} className="cursor-pointer hover:bg-gray-50">
                                            <div className="flex items-center">
                                                Name
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </div>
                                        </TableHead>
                                        <TableHead onClick={() => handleSort('price')} className="cursor-pointer hover:bg-gray-50">
                                            <div className="flex items-center">
                                                Price
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </div>
                                        </TableHead>
                                        <TableHead onClick={() => handleSort('category')} className="cursor-pointer hover:bg-gray-50">
                                            <div className="flex items-center">
                                                Category
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </div>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredAndSortedItems.map((item) => (
                                        <TableRow key={item.id} className="hover:bg-gray-50">
                                        <TableCell>
                                            <img
                                                src={item.image || "/placeholder.svg"}
                                                alt={item.name}
                                                width={48}
                                                height={48}
                                                className="rounded-md object-cover"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell>${item.price}</TableCell>
                                        <TableCell>{item.category}</TableCell>
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

export default AdminStore;