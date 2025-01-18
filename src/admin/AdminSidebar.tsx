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

const AdminSidebar : React.FC = () => {

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: Home },
        { name: 'Users', href: '/admin/users', icon: Users },
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
            
        </Sidebar>
    );
};

export default AdminSidebar;