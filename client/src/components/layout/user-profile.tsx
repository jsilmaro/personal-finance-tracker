import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, UserCircle, ChevronUp } from "lucide-react";
import { useLocation } from "wouter";

export default function UserProfile() {
  const { user, logoutMutation } = useAuth();
  const [, navigate] = useLocation();
  const [open, setOpen] = useState(false);

  // Mock data for multiple accounts - replace with actual data later
  const accounts = [
    { id: 1, username: "personal", email: "personal@example.com" },
    { id: 2, username: "business", email: "business@example.com" },
  ];

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    navigate("/auth");
  };

  const handleSwitchAccount = (accountId: number) => {
    // TODO: Implement account switching logic
    console.log(`Switching to account ${accountId}`);
  };

  if (!user) return null;

  return (
    <div className="p-4 border-t">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 px-2"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium leading-none">{user.username}</p>
              <p className="text-xs text-muted-foreground">View profile</p>
            </div>
            <ChevronUp className={`h-4 w-4 transition-transform ${open ? "rotate-0" : "rotate-180"}`} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {accounts.map((account) => (
            <DropdownMenuItem 
              key={account.id}
              onClick={() => handleSwitchAccount(account.id)}
              className="gap-2"
            >
              <Avatar className="h-6 w-6">
                <AvatarFallback>
                  {account.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm">{account.username}</p>
                <p className="text-xs text-muted-foreground">{account.email}</p>
              </div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/settings")} className="gap-2">
            <UserCircle className="h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/settings")} className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="gap-2 text-destructive">
            <LogOut className="h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}