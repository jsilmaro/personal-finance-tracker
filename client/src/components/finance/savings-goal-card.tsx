import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { SavingsGoal } from "@shared/schema";

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  onContribute?: (amount: number) => void;
}

export default function SavingsGoalCard({ goal, onContribute }: SavingsGoalCardProps) {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;

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
          ${goal.currentAmount.toFixed(2)}
          <span className="text-sm text-muted-foreground">
            /${goal.targetAmount.toFixed(2)}
          </span>
        </div>
        <Progress
          value={progress}
          className="h-2 mt-2"
        />
        {onContribute && !goal.completed && (
          <Button
            onClick={() => onContribute(10)}
            variant="outline"
            className="w-full mt-4"
          >
            Contribute
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
