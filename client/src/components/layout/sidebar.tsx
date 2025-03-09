import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  IconHome,
  IconWallet,
  IconChartBar,
  IconSettings,
  IconTarget,
  IconMenuDeep,
  IconMenuOrder
} from '@tabler/icons-react';
import { useState } from "react";

export default function Sidebar() {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: <IconHome /> },
    { href: "/wallet", label: "Wallet", icon: <IconWallet /> },
    { href: "/savings", label: "Savings", icon: <IconTarget /> },
    { href: "/analytics", label: "Analytics", icon: <IconChartBar /> },
    { href: "/settings", label: "Settings", icon: <IconSettings /> },
  ];

  return (
    <div className={cn(
      "bg-card h-screen p-4 border-r transition-all duration-300",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="flex items-center justify-between mb-8">
        {!collapsed && <h1 className="text-2xl font-bold">Centsible</h1>}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-accent"
        >
          {collapsed ? <IconMenuDeep /> : <IconMenuOrder />}
        </button>
      </div>

      <nav className="space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
          >
            <a className={cn(
              "flex items-center px-4 py-3 rounded-lg transition-colors hover:bg-accent",
              collapsed ? "justify-center" : "",
              location === link.href ? "bg-primary text-primary-foreground" : "bg-transparent"
            )}>
              <span className={collapsed ? "" : "mr-3"}>{link.icon}</span>
              {!collapsed && <span>{link.label}</span>}
            </a>
          </Link>
        ))}
      </nav>
    </div>
  );
}