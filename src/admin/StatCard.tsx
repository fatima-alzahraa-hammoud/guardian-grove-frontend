import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

interface StatCardProps {
    title: string
    value: string
    icon: React.ReactNode
    trend: { value: number; isPositive: boolean }
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend }) => (
    <Card className="hover:shadow-lg transition-shadow px-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">{title}</CardTitle>
            <div className="p-2 rounded-full bg-primary/10">{icon}</div>
        </CardHeader>
        <CardContent>
            <div className="text-3xl font-bold mb-2">{value}</div>
            <div className={`text-sm flex items-center ${ trend.isPositive ? 'text-green-500' : 'text-red-500' }`}>
                {trend.isPositive ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                )}
                <span>{trend.value}% from last month</span>
            </div>
        </CardContent>
    </Card>
);

export default StatCard;