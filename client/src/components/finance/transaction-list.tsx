import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { Link } from "wouter";
import { ArrowDown, ArrowUp, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Transaction } from "@shared/schema";

export default function TransactionList({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const [transactionToDelete, setTransactionToDelete] = useState<
    Transaction | undefined
  >(undefined);
  const queryClient = useQueryClient();

  const { mutate: deleteTransaction } = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/transactions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/transactions"],
      });
    },
  });

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold mb-2">No transactions yet</h3>
        <p className="text-muted-foreground mb-4">
          Start by adding a new transaction to track your finances
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="px-4 py-3 grid grid-cols-4 items-center text-sm"
        >
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-4 h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href={`/transaction/${transaction.id}`}>Edit</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setTransactionToDelete(transaction)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}

      <AlertDialog
        open={!!transactionToDelete}
        onOpenChange={(open) => {
          if (!open) setTransactionToDelete(undefined);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (transactionToDelete) {
                  deleteTransaction(transactionToDelete.id);
                  setTransactionToDelete(undefined);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}