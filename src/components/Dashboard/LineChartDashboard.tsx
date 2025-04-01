import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    Legend,
    ResponsiveContainer,
  } from 'recharts';
  import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

  interface PerformanceChartProps {
    data: { month: string; mpm: number; ipm: number; target: number }[];
    title: string;
    description?: string;
  }
  
  export const PerformanceChart: React.FC<PerformanceChartProps> = ({ data, title, description }) => {
  
    return (
      <Card className="border-[#46B749] dark:border-[#1B6131] shadow-md">
        <CardHeader className="bg-gradient-to-r from-[#f0f9f0] to-[#e6f3e6] dark:from-[#0a2e14] dark:to-[#0a3419] pb-4">
          <CardTitle className="text-[#1B6131] dark:text-[#46B749] flex items-center">
            {title}
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="pt-5">
          <div className="flex flex-col md:flex-row items-center justify-end gap-4 mb-4">
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-[#1B6131] rounded-full mr-2"></span>
              <span className="text-sm">MPM Score</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-[#46B749] rounded-full mr-2"></span>
              <span className="text-sm">IPM Score</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
              <span className="text-sm">Target</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" tick={{ fill: '#666666' }} />
              <YAxis tick={{ fill: '#666666' }} domain={[50, 100]} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="mpm"
                stroke="#1B6131"
                strokeWidth={2}
                activeDot={{ r: 6 }}
                name="MPM Score"
              />
              <Line
                type="monotone"
                dataKey="ipm"
                stroke="#46B749"
                strokeWidth={2}
                activeDot={{ r: 6 }}
                name="IPM Score"
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#9CA3AF"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Target"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };
  