import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface LineChartProps {
  data: any[];
  title?: string;
}

export default function LineChart({ data, title }: LineChartProps) {
  if (!data || data.length === 0) {
    return <div className="flex h-[300px] items-center justify-center bg-white dark:bg-gray-800 rounded-lg p-4">No data available</div>;
  }

  // Get all keys from data except 'name'
  const dataKeys = Object.keys(data[0] || {}).filter(key => key !== 'name');

  // Get color for a data series
  const getSeriesColor = (key: string, index: number) => {
    return COLORS[index % COLORS.length];
  };

  return (
    <div className="w-full h-[350px] bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
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