import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/hooks/use-theme";
import { Settings, Moon, Sun } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[linear-gradient(to_top,#a7a6cb_0%,#8989ba_52%,#8989ba_100%)]">
      <div className="flex h-screen">
        <div className="w-64 flex-none">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col">
          <Header />

          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center gap-4">
                <Settings className="h-8 w-8" />
                <h1 className="text-3xl font-bold">Settings</h1>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback>
                        {user?.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-2xl font-semibold">{user?.username}</h3>
                      <p className="text-sm text-muted-foreground">Member since {new Date().getFullYear()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                      <Label>Dark Mode</Label>
                    </div>
                    <Switch
                      checked={theme === 'dark'}
                      onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data & Privacy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full">
                    Export Data
                  </Button>
                  <Button variant="destructive" className="w-full">
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

export default function SettingsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedCurrency, setSelectedCurrency] = useState(user?.currency || "USD");

  const currencies = [
    { value: "USD", label: "US Dollar ($)" },
    { value: "EUR", label: "Euro (€)" },
    { value: "GBP", label: "British Pound (£)" },
    { value: "JPY", label: "Japanese Yen (¥)" },
    { value: "CAD", label: "Canadian Dollar (CA$)" },
    { value: "AUD", label: "Australian Dollar (A$)" },
    { value: "CNY", label: "Chinese Yuan (¥)" },
  ];

  const updateCurrencyMutation = useMutation({
    mutationFn: async (currency: string) => {
      const res = await apiRequest("PATCH", "/api/user/settings", { currency });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Currency Updated",
        description: "Your currency preference has been updated.",
      });
    },
  });

  const handleUpdateCurrency = () => {
    updateCurrencyMutation.mutate(selectedCurrency);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground">Manage your account preferences.</p>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Currency Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Default Currency</label>
                    <Select
                      value={selectedCurrency}
                      onValueChange={setSelectedCurrency}
                    >
                      <SelectTrigger className="w-full md:w-[240px]">
                        <SelectValue placeholder="Select a currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.value} value={currency.value}>
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={handleUpdateCurrency} 
                    disabled={updateCurrencyMutation.isPending}
                  >
                    {updateCurrencyMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Currency Preference
                  </Button>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
