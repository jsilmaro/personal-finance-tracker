import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { SavingsGoal } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { getCurrencySymbol } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  onContribute?: (amount: number) => void;
}

export default function SavingsGoalCard({ goal, onContribute }: SavingsGoalCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [contributionAmount, setContributionAmount] = useState("10");
  const [isContributing, setIsContributing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const currencySymbol = getCurrencySymbol(user?.currency || "PHP");

  const handleContribute = async () => {
    const amount = parseFloat(contributionAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid positive number",
        variant: "destructive",
      });
      return;
    }

    if (amount + goal.currentAmount > goal.targetAmount) {
      toast({
        title: "Amount too high",
        description: `Maximum contribution allowed is ${currencySymbol}${(goal.targetAmount - goal.currentAmount).toFixed(2)}`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      if (onContribute) {
        await onContribute(amount);
        setIsContributing(false);
        setContributionAmount("10");
        toast({
          title: "Success",
          description: "Contribution added successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add contribution",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {goal.name}
        </CardTitle>
        <span className="text-sm text-muted-foreground">
          {goal.completed ? "Completed!" : `${progress.toFixed(0)}%`}
        </span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {currencySymbol}{goal.currentAmount.toFixed(2)}
          <span className="text-sm text-muted-foreground">
            /{currencySymbol}{goal.targetAmount.toFixed(2)}
          </span>
        </div>
        <Progress
          value={progress}
          className="h-2 mt-2"
        />
        {onContribute && !goal.completed && (
          <>
            {!isContributing ? (
              <Button
                onClick={() => setIsContributing(true)}
                variant="outline"
                className="w-full mt-4"
              >
                Contribute
              </Button>
            ) : (
              <div className="mt-4 space-y-2">
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    placeholder="Amount"
                    className="flex-1"
                    step="0.01"
                    min="0"
                    max={goal.targetAmount - goal.currentAmount}
                  />
                  <Button 
                    onClick={handleContribute}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Add'
                    )}
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => {
                    setIsContributing(false);
                    setContributionAmount("10");
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}