import React from "react";
import { Home, Users, GroupIcon as Family, BarChart, ShoppingBag, Award, Shield } from 'lucide-react'

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
        <div></div>
    );
};

export default AdminSidebar;