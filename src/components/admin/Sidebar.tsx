"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LucideIcon,
    LayoutDashboard,
    HomeIcon,
    TableProperties,
    DatabaseIcon,
    Building2,
    Paintbrush,
    Settings,
    ChevronFirst,
    ChevronLast
} from "lucide-react";
import { useState } from "react";

interface SidebarItem {
    title: string;
    href: string;
    icon: LucideIcon;
    submenu?: { title: string; href: string }[];
}

const sidebarItems: SidebarItem[] = [
    {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Home",
        href: "/admin/home",
        icon: HomeIcon,
        submenu: [
            { title: "Hero Section", href: "/admin/home/hero" },
            { title: "Features", href: "/admin/home/features" },
        ],
    },
    {
        title: "Create Table",
        href: "/admin/dashboard/create-table",
        icon: TableProperties,
    },
    {
        title: "Add Table Data",
        href: "/admin/dashboard/add-table-data",
        icon: DatabaseIcon,
    },
    {
        title: "Add Company Datails",
        href: "/admin/dashboard/add-company-details",
        icon: Building2,
    },
    {
        title: "Customize Datails",
        href: "/admin/dashboard/customize-details",
        icon: Paintbrush,
    },
    {
        title: "Settings",
        href: "/admin/dashboard/settings",
        icon: Settings,
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
    const [expanded, setExpanded] = useState(true);

    const toggleSubmenu = (title: string) => {
        setOpenSubmenu(openSubmenu === title ? null : title);
    };

    return (
        <>
            <aside className={cn(
                "relative h-screen bg-white dark:bg-gray-800 shadow-sm transition-all duration-300",
                expanded ? "w-64" : "w-20",
                "md:relative absolute z-20" // Mobile responsive
            )}>
                <div className="h-full px-3 py-4 overflow-y-auto">
                    {/* Toggle Button */}
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="absolute -right-3 top-10 rounded-full p-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        {expanded ?
                            <ChevronFirst className="w-4 h-4" /> :
                            <ChevronLast className="w-4 h-4" />
                        }
                    </button>

                    <Link href="/admin/dashboard" className={cn(
                        "flex items-center pl-2.5 mb-5",
                        expanded ? "justify-start" : "justify-center"
                    )}>
                        {expanded ? (
                            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                                Admin Panel
                            </span>
                        ) : (
                            <span className="self-center text-xl font-semibold dark:text-white">AP</span>
                        )}
                    </Link>

                    <ul className="space-y-2 font-medium">
                        {sidebarItems.map((item, idx) => (
                            <li key={idx}>
                                {item.submenu ? (
                                    <div>
                                        <button
                                            onClick={() => toggleSubmenu(item.title)}
                                            className={cn(
                                                "flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group transition-colors duration-200",
                                                openSubmenu === item.title && "bg-gray-100 dark:bg-gray-700",
                                                expanded ? "justify-between" : "justify-center"
                                            )}
                                        >
                                            <div className="flex items-center">
                                                <item.icon className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                                {expanded && <span className="ml-3">{item.title}</span>}
                                            </div>
                                            {expanded && (
                                                <svg
                                                    className={cn(
                                                        "w-4 h-4 transition-transform duration-200",
                                                        openSubmenu === item.title ? "transform rotate-180" : ""
                                                    )}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            )}
                                        </button>
                                        {expanded && (
                                            <ul
                                                className={cn(
                                                    "pl-6 mt-2 space-y-1 transition-all duration-300",
                                                    openSubmenu === item.title ? "max-h-40 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                                                )}
                                            >
                                                {item.submenu.map((subitem, subidx) => (
                                                    <li key={subidx}>
                                                        <Link
                                                            href={subitem.href}
                                                            className={cn(
                                                                "flex items-center p-2 text-sm text-gray-700 rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 group transition-colors duration-200",
                                                                pathname === subitem.href && "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                                                            )}
                                                        >
                                                            <div className="flex items-center">
                                                                <div className="w-2 h-2 rounded-full bg-gray-400 mr-3 relative">
                                                                    <div className="absolute -left-[3px] -top-[3px] w-3 h-3 rounded-full border-2 border-gray-300 dark:border-gray-600"></div>
                                                                </div>
                                                                <span>{subitem.title}</span>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group transition-colors duration-200",
                                            pathname === item.href && "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400",
                                            expanded ? "justify-start" : "justify-center"
                                        )}
                                        title={!expanded ? item.title : ""}
                                    >
                                        <item.icon className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                        {expanded && <span className="ml-3">{item.title}</span>}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {!expanded && (
                <div
                    className="fixed inset-0 bg-black/50 md:hidden z-10"
                    onClick={() => setExpanded(true)}
                />
            )}
        </>
    );
}
