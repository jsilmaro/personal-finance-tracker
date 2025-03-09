import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import TransactionList from "@/components/finance/transaction-list";
import ExpenseDialog from "@/components/finance/expense-dialog";
import IncomeDialog from "@/components/finance/income-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Transaction } from "@shared/schema";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [transactionFilter, setTransactionFilter] = useState<"ALL" | "EXPENSE" | "INCOME">("ALL");

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  if (isLoading) {
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
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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

              <div className="flex justify-between items-center">
                <Tabs
                  value={transactionFilter}
                  onValueChange={(value) => setTransactionFilter(value as typeof transactionFilter)}
                >
                  <TabsList>
                    <TabsTrigger value="ALL">All</TabsTrigger>
                    <TabsTrigger value="EXPENSE">Expenses</TabsTrigger>
                    <TabsTrigger value="INCOME">Income</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex gap-2">
                  <ExpenseDialog />
                  <IncomeDialog />
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <TransactionList
                    transactions={transactions || []}
                    filter={transactionFilter}
                  />
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
