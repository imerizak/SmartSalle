import { useTranslation } from 'react-i18next';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Sample data - replace with actual data from your backend
const generateData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month) => ({
    name: month,
    members: Math.floor(Math.random() * 50) + 100,
    newMembers: Math.floor(Math.random() * 20)
  }));
};

export default function MembershipGraph() {
  const { t } = useTranslation();
  const data = generateData();

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold text-secondary mb-4">
        {t('dashboard.graphs.membershipTrend')}
      </h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="name" 
              stroke="#6B7280"
              tick={{ fill: '#6B7280' }}
            />
            <YAxis 
              stroke="#6B7280"
              tick={{ fill: '#6B7280' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '0.375rem',
                color: '#F3F4F6'
              }}
              itemStyle={{ color: '#F3F4F6' }}
              labelStyle={{ color: '#F3F4F6' }}
            />
            <Area
              type="monotone"
              dataKey="members"
              stroke="#F59E0B"
              fill="url(#colorMembers)"
              name={t('dashboard.graphs.totalMembers')}
            />
            <Area
              type="monotone"
              dataKey="newMembers"
              stroke="#FCD34D"
              fill="url(#colorNewMembers)"
              name={t('dashboard.graphs.newMembers')}
            />
            <defs>
              <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorNewMembers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FCD34D" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#FCD34D" stopOpacity={0}/>
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
