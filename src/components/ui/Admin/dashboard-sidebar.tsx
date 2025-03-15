"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  CircleUser,
  Cog,
  DatabaseIcon,
  Eye,
  Building2,
  Home,
  LayoutDashboard,
  LifeBuoy,
  Package,
  TableProperties,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSidebar } from "@/components/ui/Admin/sidebar-provider";

interface NavItemProps {
  title: string;
  href: string;
  icon: React.ElementType;
  isActive?: boolean;
  children?: React.ReactNode;
  isCollapsed?: boolean;
}

function NavItem({
  title,
  href,
  icon: Icon,
  isActive,
  children,
  isCollapsed,
}: NavItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = Boolean(children);

  return (
    <li className="relative">
      {hasChildren ? (
        <Button
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex w-full items-center justify-between px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground",
            isActive && "bg-muted font-medium text-foreground",
            isCollapsed && "justify-center px-2"
          )}
          rightIcon={
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                isOpen && "rotate-180"
              )}
            />
          }
        >
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5" />
            {!isCollapsed && <span>{title}</span>}
          </div>
        </Button>
      ) : (
        <Link href={href}>
          <Button
            variant="ghost"
            leftIcon={<Icon className="h-5 w-5" />}
            className={cn(
              "flex w-full items-center justify-start px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground",
              isActive && "bg-muted font-medium text-foreground",
              isCollapsed && "justify-center px-2"
            )}
          >
            {!isCollapsed && <span className="ml-3">{title}</span>}
          </Button>
        </Link>
      )}
      {hasChildren && isOpen && !isCollapsed && (
        <ul className="ml-4 mt-1 border-l pl-2">{children}</ul>
      )}
    </li>
  );
}

function NavSubItem({
  title,
  href,
  isActive,
}: {
  title: string;
  href: string;
  isActive?: boolean;
}) {
  return (
    <li>
      <Link href={href}>
        <Button
          variant="ghost"
          className={cn(
            "flex w-full justify-start px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
            isActive && "bg-muted font-medium text-foreground"
          )}
        >
          {title}
        </Button>
      </Link>
    </li>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const { isOpen } = useSidebar();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r bg-background transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-14 items-center border-b px-4">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <Package className="h-6 w-6" />
          {isOpen && <span>IPO Markets</span>}
        </Link>
      </div>
      <ScrollArea className="flex-1 py-2">
        <nav className="space-y-1 px-2">
          <ul className="space-y-1">
            <NavItem
              title="Dashboard"
              href="/admin/dashboard"
              icon={LayoutDashboard}
              isActive={pathname === "/admin/dashboard"}
              isCollapsed={!isOpen}
            />
            <NavItem
              title="Home"
              href="#"
              icon={Home}
              isActive={pathname.startsWith("/admin/dashboard")}
              isCollapsed={!isOpen}
            >
              <NavSubItem
                title="Hero Section"
                href="/admin/home/hero"
                isActive={pathname === "/admin/home/hero"}
              />
            </NavItem>
            <NavItem
              title="Create Table"
              href="/admin/dashboard/create-table"
              icon={TableProperties}
              isActive={pathname.startsWith("/admin/dashboard/create-table")}
              isCollapsed={!isOpen}
            />
            <NavItem
              title="Add Table Data"
              href="/admin/dashboard/add-table-data"
              icon={DatabaseIcon}
              isActive={pathname.startsWith("/admin/dashboard/add-table-data")}
            />
            <NavItem
              title="Preview Tables"
              href="/admin/dashboard/preview-tables"
              icon={Eye}
              isActive={pathname.startsWith("/admin/dashboard/preview-tables")}
            />
            <NavItem
              title="Add Company Details"
              href="/admin/dashboard/company-details"
              icon={Building2}
              isActive={pathname.startsWith("/admin/dashboard/company-details")}
            />
          </ul>
          <div className="my-2 border-t" />
          <ul className="space-y-1">
            <NavItem
              title="Settings"
              href="/settings"
              icon={Cog}
              isActive={pathname === "/settings"}
              isCollapsed={!isOpen}
            />
            <NavItem
              title="Help & Support"
              href="/support"
              icon={LifeBuoy}
              isActive={pathname === "/support"}
              isCollapsed={!isOpen}
            />
            <NavItem
              title="Profile"
              href="/profile"
              icon={CircleUser}
              isActive={pathname === "/profile"}
              isCollapsed={!isOpen}
            />
          </ul>
        </nav>
      </ScrollArea>
    </aside>
  );
}
