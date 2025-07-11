import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProgressChartProps {
  data: any[];
  dataKey: string;
  color: string;
  title: string;
}

export default function ProgressChart({ data, dataKey, color, title }: ProgressChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data
      .filter(entry => entry[dataKey] !== null && entry[dataKey] !== undefined)
      .map(entry => ({
        date: new Date(entry.entryDate).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        value: parseFloat(entry[dataKey]),
        fullDate: entry.entryDate
      }))
      .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime())
      .slice(-10); // Show last 10 entries
  }, [data, dataKey]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gym-surface border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-sm text-gray-400">{label}</p>
          <p className="text-lg font-semibold" style={{ color }}>
            {title}: {payload[0].value.toFixed(1)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-2">No data available</div>
          <div className="text-sm text-gray-500">Start tracking your progress to see charts</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={3}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: color }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
