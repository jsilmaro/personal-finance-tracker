import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LineChartProps {
  data: Array<{
    name: string;
    expenses: number;
    savings: number;
  }>;
  title: string;
}

export default function LineChart({ data, title }: LineChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="savings"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
