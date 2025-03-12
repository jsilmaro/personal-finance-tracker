import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';

interface BarChartProps {
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

export default function BarChart({ data, title }: BarChartProps) {
  if (!data || data.length === 0) {
    return <div className="flex h-[300px] items-center justify-center">No data available</div>;
  }

  // Get color for a category, either from map or fallback to rotation
  const getCategoryColor = (category: string, index: number) => {
    return CATEGORY_COLORS[category] || COLORS[index % COLORS.length];
  };

  return (
    <div className="w-full h-[300px]">
      {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
          <Legend />
          <Bar dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name, index)} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}