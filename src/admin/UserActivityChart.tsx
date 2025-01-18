'use client'

import React from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

const data = [
    { name: "Jan", activeUsers: 400, newUsers: 240 },
    { name: "Feb", activeUsers: 300, newUsers: 139 },
    { name: "Mar", activeUsers: 200, newUsers: 980 },
    { name: "Apr", activeUsers: 278, newUsers: 390 },
    { name: "May", activeUsers: 189, newUsers: 480 },
    { name: "Jun", activeUsers: 239, newUsers: 380 },
    { name: "Jul", activeUsers: 349, newUsers: 430 },
]

const UserActivityChart : React.FC = () => {
  return (
    <Card>
        <CardHeader>
            <CardTitle>User Activity Overview</CardTitle>
        </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={300} className="text-xs">
                <LineChart data={data}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                    <Tooltip />
                    <Line type="monotone" dataKey="activeUsers" stroke="#3A8EBA" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="newUsers" stroke="#dddddd" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
  )
};

export default UserActivityChart;
