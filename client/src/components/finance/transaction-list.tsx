import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@shared/schema";
import { format } from "date-fns";

interface TransactionListProps {
  transactions: Transaction[];
  filter?: "ALL" | "EXPENSE" | "INCOME";
}

export default function TransactionList({ transactions, filter = "ALL" }: TransactionListProps) {
  const filteredTransactions = transactions.filter((tx) => {
    if (filter === "ALL") return true;
    return tx.type === filter;
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredTransactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>
              {format(new Date(transaction.date), "MMM d, yyyy")}
            </TableCell>
            <TableCell>{transaction.description}</TableCell>
            <TableCell>{transaction.category}</TableCell>
            <TableCell>
              ${transaction.amount.toFixed(2)}
            </TableCell>
            <TableCell>
              <Badge variant={transaction.type === "EXPENSE" ? "destructive" : "default"}>
                {transaction.type}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
        {filteredTransactions.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8">
              No transactions found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
