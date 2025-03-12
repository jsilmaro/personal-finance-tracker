import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface LineChartProps {
  data: Array<Record<string, any>>;
  title: string;
}

// Define colors for different line types
const LINE_COLORS: Record<string, string> = {
  expenses: '#FF6B6B',    // Red for expenses
  savings: '#4CAF50',     // Green for savings
  income: '#0088FE',      // Blue for income
  balance: '#8884D8',     // Purple for balance
  rent: '#FFBB28',        // Yellow for rent
  food: '#FF8042',        // Orange for food
  bills: '#607D8B',       // Blue Gray for bills
  transport: '#00C49F',   // Teal for transport
};

// Default colors for other series
const DEFAULT_COLORS = [
  '#8884D8', // Purple
  '#82CA9D', // Light Green
  '#FFC658', // Light Yellow
  '#FF8042', // Orange
  '#0088FE', // Blue
  '#00C49F', // Teal
];

export default function LineChart({ data, title }: LineChartProps) {
  if (!data || data.length === 0) {
    return <div className="flex h-[300px] items-center justify-center">No data available</div>;
  }

  // Get all keys except 'name'
  const dataKeys = Object.keys(data[0]).filter(key => key !== 'name');

  // Get color for a data series
  const getSeriesColor = (key: string, index: number) => {
    const normalizedKey = key.toLowerCase();
    return LINE_COLORS[normalizedKey] || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
  };

  return (
    <div className="w-full h-[300px]">
      {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
          <Legend />
          {dataKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              name={key.charAt(0).toUpperCase() + key.slice(1)} // Capitalize for display
              stroke={getSeriesColor(key, index)}
              activeDot={{ r: 8 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}