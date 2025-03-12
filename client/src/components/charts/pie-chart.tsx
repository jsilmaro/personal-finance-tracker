import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useAuth } from "@/hooks/use-auth";
import { getCurrencySymbol } from "@/lib/utils";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B', '#4CAF50', '#9C27B0', '#3F51B5'];

interface PieChartProps {
  data: { name: string; value: number }[];
  title?: string;
}

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
  Other: '#795548',
};

export default function PieChart({ data, title }: PieChartProps) {
  const { user } = useAuth();
  const currencySymbol = getCurrencySymbol(user?.currency || "USD");

  if (!data || data.length === 0) {
    return <div className="flex h-[300px] items-center justify-center bg-white dark:bg-gray-800 rounded-lg p-4">No data available</div>;
  }

  // Get color for a category
  const getCategoryColor = (category: string, index: number) => {
    return CATEGORY_COLORS[category] || COLORS[index % COLORS.length];
  };

  return (
    <div className="w-full h-[300px] bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
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
  );
}