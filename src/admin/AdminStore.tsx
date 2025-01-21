"use client"

import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../components/ui/dialog"
import { Card } from "../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { ArrowUpDown, Search, Plus, ImageIcon, Pencil, Trash2 } from 'lucide-react'
import { requestApi } from '../libs/requestApi'
import { requestMethods } from '../libs/enum/requestMethods'
import { toast, ToastContainer } from 'react-toastify'

interface StoreItem {
  _id: string;
  name: string
  price: number
  type: string
  image: string
}

const AdminStore : React.FC = () => {
    const [items, setItems] = useState<StoreItem[]>([]);
    const [newItem, setNewItem] = useState<Omit<StoreItem, '_id'>>({ name: '', price: 0, type: '', image: '' });
    const [editingItem, setEditingItem] = useState<StoreItem | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortConfig, setSortConfig] = useState<{ key: keyof StoreItem | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' })
    const [selectedtype, setSelectedtype] = useState('all')
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    const uniqueCategories = ['all', ...Array.from(new Set(items.map(item => item.type)))]

    const handleSort = (key: keyof StoreItem) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
        setSortConfig({ key, direction })
    }

    useEffect(() => {
        fetchStoreItems();
    }, []);

    const handleEdit = (item: StoreItem) => {
        setEditingItem(item)
        setIsEditDialogOpen(true)
    }

    const fetchStoreItems = async () =>{
        try {
            const response = await requestApi({
                route: "/store/",
                method: requestMethods.GET
            });
            if(response && response.items){
                setItems(response.items);
            }
            else{
                toast.error("Failed to get store items", response.message);
            }
        } catch (error) {
            console.log("Somthing wrong happend", error)
        }
    }

    const AddStoreItem = async () => {
        try {
            if (newItem.name && newItem.price && newItem.type && newItem.image) {
                const data = { name: newItem.name, price: newItem.price, type: newItem.type, image: newItem.image };

                const response = await requestApi({
                    route: "/store/",
                    method: requestMethods.POST,
                    body: data
                });
                if(response && response.StoreItem){
                    setItems((prev) => [...prev, response.StoreItem]);
                }
                else{
                    toast.error("Failed to create store item", response.message);
                }
            }
        } catch (error) {
            console.log("Somthing wrong happend", error)
        }
    }

    const handleDelete = async (itemId: string) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                const response = await requestApi({
                    route: `/store/${itemId}`,
                    method: requestMethods.DELETE,
                });
                
                if (response) {
                    setItems(items.filter(item => item._id !== itemId));
                    toast.success('Item deleted successfully');
                } else {
                    toast.error("Failed to delete item", response.message);
                }
            } catch (error) {
                console.log("Something wrong happened", error);
                toast.error("Error deleting item");
            }
        }
    }

    const filteredAndSortedItems = items
        .filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.type.toLowerCase().includes(searchTerm.toLowerCase())
        const matchestype = selectedtype === 'all' || item.type === selectedtype
        return matchesSearch && matchestype
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
            <ToastContainer className="text-xs"/>

            <h2 className="font-poppins text-lg font-semibold">Store Management</h2>

                <Card className="p-6 w-[1080px]">
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
                                        <Select
                                            value={newItem.type}
                                            onValueChange={(value) => setNewItem({ ...newItem, type: value })}
                                        >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {uniqueCategories.filter(cat => cat !== 'all').map(type => (
                                                <SelectItem key={type} value={type}>
                                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={AddStoreItem} className="bg-[#3A8EBA] hover:bg-[#347ea5]">
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
                                value={selectedtype}
                                onValueChange={setSelectedtype}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {uniqueCategories.map(type => (
                                        <SelectItem key={type} value={type}>
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
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
                                        <TableHead onClick={() => handleSort('price')} className="cursor-pointer hover:bg-gray-50">
                                            <div className="flex items-center">
                                                Price
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </div>
                                        </TableHead>
                                        <TableHead onClick={() => handleSort('type')} className="cursor-pointer hover:bg-gray-50">
                                            <div className="flex items-center">
                                                type
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </div>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                {filteredAndSortedItems.map((item) => (
                                    <TableRow key={item._id} className="hover:bg-gray-50">
                                        <TableCell>
                                            <img
                                                src={item.image || "/placeholder.svg"}
                                                alt={item.name}
                                                width={48}
                                                height={48}
                                                className="rounded-md object-cover pl-4"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell>${item.price}</TableCell>
                                        <TableCell>{item.type}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => handleDelete(item._id)}
                                                    size="icon"
                                                    className="h-8 w-8 text-red-500 hover:text-red-600"
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
        </div>
    )
}

export default AdminStore;