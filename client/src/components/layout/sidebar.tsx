import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { logout } from "@/hooks/use-auth";
import { Link } from "wouter";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { 
  HomeIcon, 
  LineChart, 
  BarChart4, 
  PiggyBank, 
  CreditCard, 
  Settings,
  LogOut 
} from "lucide-react";

export default function AppSidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={location === '/dashboard'}>
                <Link href="/dashboard">
                  <HomeIcon />
                  <span>Overview</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={location === '/transactions'}>
                <Link href="/transactions">
                  <BarChart4 />
                  <span>Transactions</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={location === '/analytics'}>
                <Link href="/analytics">
                  <LineChart />
                  <span>Analytics</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={location === '/budget'}>
                <Link href="/budget">
                  <PiggyBank />
                  <span>Budget</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={location === '/accounts'}>
                <Link href="/accounts">
                  <CreditCard />
                  <span>Accounts</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={location === '/settings'}>
                <Link href="/settings">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild onClick={() => user && logout()}>
                <Link href="/auth">
                  <LogOut />
                  <span>Logout</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}