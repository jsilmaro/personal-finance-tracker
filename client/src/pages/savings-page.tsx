import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { SavingsGoal } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSavingsGoalSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import PieChart from "@/components/charts/pie-chart";
import SavingsGoalCard from "@/components/finance/savings-goal-card";

export default function SavingsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  
  const { data: savingsGoals, isLoading } = useQuery<SavingsGoal[]>({
    queryKey: ["/api/savings-goals"],
  });

  const form = useForm({
    resolver: zodResolver(insertSavingsGoalSchema),
    defaultValues: {
      name: "",
      targetAmount: 0,
    },
  });

  const createGoalMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/savings-goals", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/savings-goals"] });
      setIsAddingGoal(false);
      form.reset();
    },
  });

  const contributeToGoalMutation = useMutation({
    mutationFn: async ({ goalId, amount }: { goalId: number; amount: number }) => {
      const res = await apiRequest("PATCH", `/api/savings-goals/${goalId}`, { amount });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/savings-goals"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const completedGoals = savingsGoals?.filter(g => g.completed) || [];
  const activeGoals = savingsGoals?.filter(g => !g.completed) || [];

  const goalsBreakdown = savingsGoals?.reduce((acc, goal) => {
    acc.push({
      name: goal.name,
      value: Number(goal.currentAmount)
    });
    return acc;
  }, [] as { name: string; value: number }[]) || [];

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
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Savings Goals</h1>
                <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
                  <DialogTrigger asChild>
                    <Button>Add New Goal</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Savings Goal</DialogTitle>
                    </DialogHeader>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit((data) => createGoalMutation.mutate(data))} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Goal Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="targetAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Target Amount</FormLabel>
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

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={createGoalMutation.isPending}
                        >
                          Create Goal
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PieChart
                      data={goalsBreakdown}
                      title=""
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Goals</p>
                      <p className="text-2xl font-bold">{activeGoals.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Completed Goals</p>
                      <p className="text-2xl font-bold">{completedGoals.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Saved</p>
                      <p className="text-2xl font-bold">
                        ${savingsGoals?.reduce((sum, goal) => sum + Number(goal.currentAmount), 0).toFixed(2)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Active Goals</h2>
                <div className="grid gap-6 md:grid-cols-3">
                  {activeGoals.map(goal => (
                    <SavingsGoalCard
                      key={goal.id}
                      goal={goal}
                      onContribute={(amount) =>
                        contributeToGoalMutation.mutate({ goalId: goal.id, amount })
                      }
                    />
                  ))}
                </div>
              </div>

              {completedGoals.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Completed Goals</h2>
                  <div className="grid gap-6 md:grid-cols-3">
                    {completedGoals.map(goal => (
                      <SavingsGoalCard
                        key={goal.id}
                        goal={goal}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
