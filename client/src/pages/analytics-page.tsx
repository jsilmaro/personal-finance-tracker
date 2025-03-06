import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Transaction, SavingsGoal } from "@shared/schema";
import { Loader2 } from "lucide-react";
import BarChart from "@/components/charts/bar-chart";
import PieChart from "@/components/charts/pie-chart";
import LineChart from "@/components/charts/line-chart";

export default function AnalyticsPage() {
  const { user } = useAuth();
  
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

  const totalExpenses = transactions
    ?.filter(t => t.type === "EXPENSE")
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const totalIncome = transactions
    ?.filter(t => t.type === "INCOME")
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  // Prepare data for savings goals bar chart
  const savingsGoalsData = savingsGoals?.map(goal => ({
    name: goal.name,
    value: Number(goal.currentAmount)
  })) || [];

  // Prepare data for spending breakdown pie chart
  const expensesByCategory = transactions
    ?.filter(t => t.type === "EXPENSE")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const spendingBreakdownData = Object.entries(expensesByCategory || {}).map(
    ([name, value]) => ({ name, value })
  );

  // Prepare data for spending vs savings line chart
  const monthlyData = transactions?.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleString('default', { month: 'short' });
    if (!acc[month]) {
      acc[month] = { expenses: 0, savings: 0 };
    }
    if (t.type === "EXPENSE") {
      acc[month].expenses += Number(t.amount);
    } else {
      acc[month].savings += Number(t.amount);
    }
    return acc;
  }, {} as Record<string, { expenses: number; savings: number }>);

  const spendingVsSavingsData = Object.entries(monthlyData || {}).map(
    ([name, data]) => ({ name, ...data })
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
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      Total Balance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${user?.balance.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      Total Expenses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-destructive">
                      ${totalExpenses.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      Total Income
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">
                      ${totalIncome.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <BarChart
                  data={savingsGoalsData}
                  title="Progress Tracker"
                />
                <PieChart
                  data={spendingBreakdownData}
                  title="Spending Breakdown"
                />
                <LineChart
                  data={spendingVsSavingsData}
                  title="Spending vs. Savings"
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
