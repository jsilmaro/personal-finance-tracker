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
