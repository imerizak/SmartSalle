import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiUsers, 
  FiDollarSign, 
  FiActivity,
  FiClock,
  FiUserCheck
} from 'react-icons/fi';
import StatsCard from './dashboard/StatsCard';
import MembershipGraph from './dashboard/MembershipGraph';

export default function Overview() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const stats = [
    {
      title: t('dashboard.stats.activeMembers'),
      value: '245',
      icon: FiUsers,
      trend: { direction: 'up', value: '+12.5%' }
    },
    {
      title: t('dashboard.stats.monthlyRevenue'),
      value: '$12.5k',
      icon: FiDollarSign,
      trend: { direction: 'up', value: '+8.2%' }
    },
    {
      title: t('dashboard.stats.classAttendance'),
      value: '85%',
      icon: FiActivity,
      trend: { direction: 'down', value: '-2.4%' }
    },
    {
      title: t('dashboard.stats.upcomingClasses'),
      value: '12',
      icon: FiClock,
      color: "warning"
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          {t('dashboard.welcomeMessage')}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {t('dashboard.organizationInfo', { 
            organization: user?.user_metadata?.organization 
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            color={stat.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <MembershipGraph />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('dashboard.activity.title')}
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <FiUsers className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {t('dashboard.activity.newMember')}
                  </p>
                  <p className="text-sm text-gray-500">
                    John Doe
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {t('dashboard.activity.timeAgo', { time: '2 min' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
