import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { SavingsGoal } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { getCurrencySymbol } from "@/lib/utils";

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  onContribute?: (amount: number) => void;
}

export default function SavingsGoalCard({ goal, onContribute }: SavingsGoalCardProps) {
  const { user } = useAuth();
  const [contributionAmount, setContributionAmount] = useState("10");
  const [isContributing, setIsContributing] = useState(false);
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const currencySymbol = getCurrencySymbol(user?.currency || "USD");

  const handleContribute = () => {
    const amount = parseFloat(contributionAmount);
    if (!isNaN(amount) && amount > 0 && onContribute) {
      onContribute(amount);
      setIsContributing(false);
      setContributionAmount("10");
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
                  />
                  <Button onClick={handleContribute}>Add</Button>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setIsContributing(false)}
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
