import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { getCurrencySymbol } from "@/lib/utils";

interface PieChartProps {
  data: Array<{ name: string; value: number }>;
  title: string;
}

// Extended color palette with different colors for various categories
const COLORS = [
  '#0088FE', // Blue
  '#00C49F', // Green
  '#FFBB28', // Yellow
  '#FF8042', // Orange
  '#FF6B6B', // Red
  '#8884D8', // Purple
  '#4CAF50', // Darker Green
  '#9C27B0', // Violet
  '#3F51B5', // Indigo
  '#795548', // Brown
  '#607D8B', // Blue Gray
  '#E91E63', // Pink
];

// Color map to ensure categories always get the same color
const CATEGORY_COLORS: Record<string, string> = {
  Food: '#FF8042',
  Entertainment: '#FFBB28',
  Housing: '#0088FE',
  Transportation: '#00C49F',
  Utilities: '#8884D8',
  Healthcare: '#FF6B6B',
  Shopping: '#4CAF50',
  Education: '#9C27B0',
  Travel: '#3F51B5',
  Personal: '#607D8B',
  Salary: '#4CAF50',
  Investments: '#0088FE',
  Gifts: '#E91E63',
  Other: '#795548',
};

export default function PieChart({ data, title }: PieChartProps) {
  const { user } = useAuth();
  const currencySymbol = getCurrencySymbol(user?.currency || "USD");

  if (!data || data.length === 0) {
    return <div className="flex h-[300px] items-center justify-center">No data available</div>;
  }

  // Get color for a category, either from map or fallback to rotation
  const getCategoryColor = (category: string, index: number) => {
    return CATEGORY_COLORS[category] || COLORS[index % COLORS.length];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[300px]">
          {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name, index)} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${currencySymbol}${Number(value).toFixed(2)}`} />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}