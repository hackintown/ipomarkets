"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import {
    Users,
    FileText,
    TrendingUp,
    Calendar,
    ArrowRight,
    Activity
} from "lucide-react";
import Link from "next/link";

interface DashboardMetric {
    title: string;
    value: number;
    change: number;
    icon: React.ReactNode;
    color: string;
}

export default function AdminDashboard() {
    const [metrics, setMetrics] = useState<DashboardMetric[]>([
        {
            title: "Total Users",
            value: 0,
            change: 12,
            icon: <Users className="w-6 h-6" />,
            color: "bg-blue-500/10 text-blue-500"
        },
        {
            title: "Active IPOs",
            value: 0,
            change: 8,
            icon: <Activity className="w-6 h-6" />,
            color: "bg-green-500/10 text-green-500"
        },
        {
            title: "Upcoming IPOs",
            value: 0,
            change: -3,
            icon: <Calendar className="w-6 h-6" />,
            color: "bg-purple-500/10 text-purple-500"
        },
        {
            title: "Total Applications",
            value: 0,
            change: 24,
            icon: <FileText className="w-6 h-6" />,
            color: "bg-orange-500/10 text-orange-500"
        }
    ]);

    // Simulating data fetch
    useEffect(() => {
        const fetchData = async () => {
            // Replace with actual API calls
            setMetrics(prev => prev.map(metric => ({
                ...metric,
                value: Math.floor(Math.random() * 1000)
            })));
        };

        fetchData();
    }, []);

    const quickActions = [
        {
            title: "Manage Hero Section",
            description: "Update homepage hero slides and content",
            href: "/admin/home/hero",
            icon: <TrendingUp className="w-5 h-5" />
        },
        {
            title: "Add New IPO",
            description: "Create a new IPO listing",
            href: "/admin/current-ipos/new",
            icon: <FileText className="w-5 h-5" />
        },
        {
            title: "User Management",
            description: "Manage user accounts and permissions",
            href: "/admin/users",
            icon: <Users className="w-5 h-5" />
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <div className="text-sm text-muted-foreground">
                    Last updated: {new Date().toLocaleString()}
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {metrics.map((metric, idx) => (
                    <Card key={idx} className="p-6">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${metric.color}`}>
                                {metric.icon}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {metric.title}
                                </p>
                                <h3 className="text-2xl font-bold">{metric.value}</h3>
                                <p className={`text-sm ${metric.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {metric.change > 0 ? '+' : ''}{metric.change}% from last month
                                </p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Quick Actions</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {quickActions.map((action, idx) => (
                        <Link key={idx} href={action.href}>
                            <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer group">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <div className="p-2 w-fit rounded-md bg-primary/10 text-primary">
                                            {action.icon}
                                        </div>
                                        <h3 className="font-semibold">{action.title}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {action.description}
                                        </p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}