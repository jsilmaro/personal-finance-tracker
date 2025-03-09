import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTransactionSchema } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import { z } from "zod";
import { getCurrencySymbol } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth"; // Added import

const incomeCategories = [
  "Salary",
  "Freelance",
  "Investment",
  "Gift",
  "Other",
] as const;

type FormData = z.infer<typeof insertTransactionSchema>;

export default function IncomeDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  // Assuming useAuth hook provides user object with currency property
  const { data: user } = useAuth();


  const formSchema = insertTransactionSchema.extend({
    // Override the date field to accept string in yyyy-MM-dd format
    date: z.string(),
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      category: "Other",
      type: "INCOME",
      date: format(new Date(), "yyyy-MM-dd"),
      description: "",
    },
  });

  const incomeMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return apiRequest("POST", "/api/transactions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setOpen(false);
      form.reset();
    },
  });

  const onSubmit = (values: FormData) => {
    incomeMutation.mutate({
      ...values,
      amount: Number(values.amount),
      // Pass the date string directly as it's already in yyyy-MM-dd format
      date: values.date,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Income</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" aria-describedby="income-dialog-description">
        <DialogDescription id="income-dialog-description" className="sr-only">
          Add or edit income
        </DialogDescription>
        <DialogHeader>
          <DialogTitle>Add New Income</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount ({getCurrencySymbol(user?.currency || "USD")})</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {incomeCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={incomeMutation.isPending}
            >
              Add Income
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}