import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Wallet,
  LineChart,
  PiggyBank,
  Settings,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Sidebar() {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Wallet", href: "/wallet", icon: Wallet },
    { name: "Analytics", href: "/analytics", icon: LineChart },
    { name: "Savings", href: "/savings", icon: PiggyBank },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col h-full border-r bg-card">
      <div className="p-6">
        <Link href="/dashboard">
          <h1 className="text-2xl font-bold">Centsible</h1>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3">
        <nav className="flex flex-col gap-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2",
                    location === item.href && "bg-accent"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-6 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => logoutMutation.mutate()}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Home,
  Settings,
  Wallet,
  CreditCard
} from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home, current: location === "/dashboard" },
    { name: "Wallet", href: "/wallet", icon: Wallet, current: location === "/wallet" },
    { name: "Analytics", href: "/analytics", icon: BarChart, current: location === "/analytics" },
    { name: "Savings", href: "/savings", icon: CreditCard, current: location === "/savings" },
    { name: "Settings", href: "/settings", icon: Settings, current: location === "/settings" },
  ];

  return (
    <div className="flex flex-col w-56 bg-sidebar border-r border-border">
      <div className="flex h-14 items-center px-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground">
            C
          </div>
          <span className="font-semibold text-lg">Centsible</span>
        </div>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center px-4 py-3 text-sm font-medium rounded-md",
              item.current 
                ? "bg-sidebar-selected text-primary" 
                : "text-muted-foreground hover:text-foreground hover:bg-sidebar-hover"
            )}
          >
            <item.icon
              className={cn(
                "mr-3 h-5 w-5",
                item.current ? "text-primary" : "text-muted-foreground"
              )}
              aria-hidden="true"
            />
            {item.name}
          </Link>
        ))}
      </nav>
      {user && (
        <div className="p-4 border-t border-border flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-medium mr-3">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col text-sm">
            <span className="font-medium">
              {user.username}
            </span>
            <span className="text-xs text-muted-foreground">{user.username.toLowerCase()}@example.com</span>
          </div>
        </div>
      )}
    </div>
  );
}
