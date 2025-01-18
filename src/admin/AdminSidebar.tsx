import React from "react";
import { Home, Users, GroupIcon as Family, BarChart, ShoppingBag, Award, Shield } from 'lucide-react'
import { 
    Sidebar, 
    SidebarHeader, 
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton
  } from "../components/ui/sidebar"

interface AdminSidebarProps {
    setActiveSection: React.Dispatch<React.SetStateAction<string>>;
}

const AdminSidebar : React.FC<AdminSidebarProps> = ({setActiveSection}) => {

    const navItems = [
        { name: 'Dashboard', href: '/admin/', icon: Home },
        { name: 'users', href: '/admin/users', icon: Users },
        { name: 'Families', href: '/admin/families', icon: Family },
        { name: 'Analytics', href: '/admin/analytics', icon: BarChart },
        { name: 'Store', href: '/admin/store', icon: ShoppingBag },
        { name: 'Achievements', href: '/admin/achievements', icon: Award },
        { name: 'Manage Admins', href: '/admin/manage-admins', icon: Shield },
      ]

    return(
        <Sidebar className="shadow-md bg-[#3A8EBA] text-white font-poppins">
            <SidebarHeader className="p-6 bg-[#3A8EBA] pt-20">
                <h1 className="text-2xl font-bold text-white">Guardian Grove</h1>
                <p className="text-sm text-white">Admin Dashboard</p>
            </SidebarHeader>
            <SidebarContent className="pt-6 px-6 bg-[#3A8EBA] text-lg">
                <SidebarMenu>
                {navItems.map((item) => (
                    <SidebarMenuItem key={item.name} className="text-base hover:text-black">
                        <SidebarMenuButton onClick={() => setActiveSection(item.name.toLowerCase())} className="flex items-center px-2 py-5 text-white text-sm hover:text-black">
                            <item.icon className="w-6 h-6 mr-1" />
                                <span className="flex items-center px-1 py-3 text-white text-sm hover:text-black">
                                {item.name}
                            </span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    );
};

export default AdminSidebar;