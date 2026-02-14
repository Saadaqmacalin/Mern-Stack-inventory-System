import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useAppContext } from '../../contexts/AppContext';
import Card from '../ui/Card';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const SalesTrendChart = ({ data }) => {
  const { theme } = useAppContext();
  const isDark = theme === 'dark';
  const gridColor = isDark ? '#374151' : '#f0f0f0';
  const textColor = isDark ? '#9ca3af' : '#6b7280';
  const tooltipBg = isDark ? '#1f2937' : '#ffffff';
  const tooltipText = isDark ? '#f3f4f6' : '#1f2937';

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: textColor, fontSize: 10, fontWeight: 700 }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: textColor, fontSize: 10, fontWeight: 700 }} 
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', backgroundColor: tooltipBg, color: tooltipText }}
            itemStyle={{ color: '#4f46e5', fontWeight: 900 }}
            formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
            cursor={{ stroke: gridColor }}
          />
          <Area 
            type="monotone" 
            dataKey="amount" 
            stroke="#4f46e5" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const TopProductsChart = ({ data }) => {
  const { theme } = useAppContext();
  const isDark = theme === 'dark';
  const gridColor = isDark ? '#374151' : '#f0f0f0';
  const textColor = isDark ? '#9ca3af' : '#374151';
  const tooltipBg = isDark ? '#1f2937' : '#ffffff';
  const cursorFill = isDark ? '#374151' : '#f3f4f6';

  return (
    <Card title="Top Selling Products" subtitle="Top 5 products by quantity">
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={gridColor} />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={100}
              tick={{ fill: textColor, fontSize: 12 }} 
            />
            <Tooltip 
              cursor={{ fill: cursorFill }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', backgroundColor: tooltipBg, color: textColor }}
            />
            <Bar dataKey="quantity" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export const OrderStatusChart = ({ data }) => {
  const { theme } = useAppContext();
  const isDark = theme === 'dark';
  const tooltipBg = isDark ? '#1f2937' : '#ffffff';
  
  return (
    <Card title="Order Status" subtitle="Distribution of current orders">
      <div className="h-80 w-full flex justify-center items-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
               contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', backgroundColor: tooltipBg }}
            />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
