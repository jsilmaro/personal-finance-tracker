
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
import { Loader2, RefreshCcw, Plus, MoreVertical } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [transactionFilter, setTransactionFilter] = useState<"All" | "Expenses" | "Income">("All");

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

  const filteredTransactions = transactions?.filter(t => {
    if (transactionFilter === "All") return true;
    if (transactionFilter === "Expenses") return t.type === "EXPENSE";
    if (transactionFilter === "Income") return t.type === "INCOME";
    return true;
  });

  const totalExpenses = transactions
    ?.filter(t => t.type === "EXPENSE")
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const totalIncome = transactions
    ?.filter(t => t.type === "INCOME")
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;
    
  const totalBalance = totalIncome - totalExpenses;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
            <p className="text-muted-foreground text-sm">Track your spending and manage your finances</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Total Balance Card */}
            <Card className="bg-card">
              <CardContent className="pt-6">
                <div className="mb-2">
                  <span className="text-sm font-medium">Total Balance</span>
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold">${totalBalance.toFixed(2)}</h3>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Total Income Card */}
            <Card className="bg-card">
              <CardContent className="pt-6">
                <div className="mb-2">
                  <span className="text-sm font-medium">Total Income</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <h3 className="text-2xl font-bold">${totalIncome.toFixed(2)}</h3>
                    <span className="text-xs text-green-500 flex items-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                        <polyline points="16 7 22 7 22 13" />
                      </svg>
                      Income
                    </span>
                  </div>
                  <Button size="sm" variant="ghost" className="text-xs bg-muted/50 hover:bg-muted" onClick={() => document.getElementById('add-income-dialog-trigger')?.click()}>
                    Add Income
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Total Expenses Card */}
            <Card className="bg-card">
              <CardContent className="pt-6">
                <div className="mb-2">
                  <span className="text-sm font-medium">Total Expenses</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <h3 className="text-2xl font-bold">${totalExpenses.toFixed(2)}</h3>
                    <span className="text-xs text-red-500 flex items-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
                        <polyline points="16 17 22 17 22 11" />
                      </svg>
                      Expense
                    </span>
                  </div>
                  <Button size="sm" variant="ghost" className="text-xs bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive" onClick={() => document.getElementById('add-expense-dialog-trigger')?.click()}>
                    Add Expense
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for filtering transactions */}
          <Tabs
            value={transactionFilter}
            onValueChange={(value) => setTransactionFilter(value as typeof transactionFilter)}
            className="mb-6"
          >
            <TabsList className="bg-muted/50">
              <TabsTrigger value="All" className="px-8">All</TabsTrigger>
              <TabsTrigger value="Expenses" className="px-8">Expenses</TabsTrigger>
              <TabsTrigger value="Income" className="px-8">Income</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Recent Transactions */}
          <div className="mb-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Recent Transactions</h2>
              <Button className="bg-primary text-primary-foreground" size="sm" onClick={() => document.getElementById('add-expense-dialog-trigger')?.click()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </div>
            
            <div className="overflow-hidden rounded-lg border">
              <div className="bg-muted/30 px-4 py-3 grid grid-cols-4 text-sm font-medium text-muted-foreground">
                <div>Description</div>
                <div>Category</div>
                <div>Date</div>
                <div className="text-right">Amount</div>
              </div>
              
              <div className="divide-y divide-border">
                {filteredTransactions && filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <div key={transaction.id} className="px-4 py-3 grid grid-cols-4 items-center text-sm">
                      <div className="font-medium">{transaction.description}</div>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.category === 'Salary' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400' : 
                          transaction.category === 'Investment' ? 'bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-400' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400'
                        }`}>
                          {transaction.category === 'Salary' && (
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                          {transaction.category === 'Investment' && (
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                          )}
                          {transaction.category}
                        </span>
                      </div>
                      <div>{new Date(transaction.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: '2-digit' 
                      })}</div>
                      <div className={`text-right ${transaction.type === 'INCOME' ? 'text-green-500' : 'text-red-500'}`}>
                        {transaction.type === 'INCOME' ? '+' : '-'}${Number(transaction.amount).toFixed(2)}
                        <button className="ml-4 text-muted-foreground hover:text-foreground">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-muted-foreground">
                    No transactions found. Add a new transaction to get started.
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Hidden triggers for dialogs */}
      <div className="hidden">
        <ExpenseDialog />
        <IncomeDialog />
      </div>
    </div>
  );
}
