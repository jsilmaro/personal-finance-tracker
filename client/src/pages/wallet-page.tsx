import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import TransactionList from "@/components/finance/transaction-list";
import ExpenseDialog from "@/components/finance/expense-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Transaction, SavingsGoal } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import BarChart from "@/components/charts/bar-chart";
import PieChart from "@/components/charts/pie-chart";
import SavingsGoalCard from "@/components/finance/savings-goal-card";

const getCurrencySymbol = (currencyCode: string): string => {
  switch (currencyCode.toUpperCase()) {
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    // Add more currencies as needed
    default:
      return ""; // Or handle unsupported currencies appropriately
  }
};


export default function WalletPage() {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState("30");

  const { data: transactions, isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: savingsGoals, isLoading: goalsLoading } = useQuery<SavingsGoal[]>({
    queryKey: ["/api/savings-goals"],
  });

  if (transactionsLoading || goalsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const filteredTransactions = transactions?.filter(t => {
    const date = new Date(t.date);
    const daysAgo = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
    return daysAgo <= Number(timeframe);
  });

  const totalExpenses = filteredTransactions
    ?.filter(t => t.type === "EXPENSE")
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const totalIncome = filteredTransactions
    ?.filter(t => t.type === "INCOME")
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const totalSaved = totalIncome - totalExpenses;
  const totalBalance = user?.balance || 0; // Added to handle potential null user.balance


  // Prepare data for balance over time chart
  const dailyBalances = filteredTransactions?.reduce((acc, t) => {
    const date = new Date(t.date).toLocaleDateString();
    if (!acc[date]) acc[date] = 0;
    acc[date] += t.type === "INCOME" ? Number(t.amount) : -Number(t.amount);
    return acc;
  }, {} as Record<string, number>);

  const balanceChartData = Object.entries(dailyBalances || {}).map(
    ([name, value]) => ({ name, value })
  );

  // Prepare data for spending breakdown
  const expensesByCategory = filteredTransactions
    ?.filter(t => t.type === "EXPENSE")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const spendingBreakdownData = Object.entries(expensesByCategory || {}).map(
    ([name, value]) => ({ name, value })
  );

  return (
    <div className="min-h-screen bg-[linear-gradient(to_top,#a7a6cb_0%,#8989ba_52%,#8989ba_100%)]">
      <div className="flex h-screen">
        <div className="w-64 flex-none">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col">
          <Header />

          <main className="flex-1 overflow-y-auto p-6">
            <div className="flex gap-6">
              <div className="flex-1 space-y-6">
                <div className="flex justify-between items-center">
                  <Select value={timeframe} onValueChange={setTimeframe}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="60">Last 60 days</SelectItem>
                      <SelectItem value="90">Last 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-6 md:grid-cols-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {getCurrencySymbol(user?.currency || "USD")}{totalBalance.toFixed(2)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Income</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary">
                        {getCurrencySymbol(user?.currency || "USD")}{totalIncome.toFixed(2)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-destructive">
                        {getCurrencySymbol(user?.currency || "USD")}{totalExpenses.toFixed(2)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Saved</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {getCurrencySymbol(user?.currency || "USD")}{totalSaved.toFixed(2)}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <BarChart
                  data={balanceChartData}
                  title="Balance Over Time"
                />

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TransactionList
                      transactions={filteredTransactions || []}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="w-1/3 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Spending Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PieChart
                      data={spendingBreakdownData}
                      title=""
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Top Saving Goals</CardTitle>
                    <Button variant="ghost" size="sm">View All</Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {savingsGoals?.slice(0, 3).map(goal => (
                      <SavingsGoalCard key={goal.id} goal={goal} />
                    ))}
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button className="flex-1">Export Report</Button>
                  <ExpenseDialog />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}