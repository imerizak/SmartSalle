import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { 
  FiHome, 
  FiUsers, 
  FiCalendar, 
  FiDollarSign, 
  FiBarChart2, 
  FiSettings, 
  FiLogOut,
  FiBell,
  FiHelpCircle,
  FiActivity,
  FiClock,
  FiUserCheck,
  FiUser,
  FiUserPlus,
  FiPlus
} from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Logo from './Logo';
import MembershipGraph from './dashboard/MembershipGraph';
import StatsCard from './dashboard/StatsCard';
import MembersPanel from './members/MembersPanel';
import PaymentsPanel from './payments/PaymentsPanel';
import AttendancePanel from './attendance/AttendancePanel';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const langMenuRef = useRef(null);
  const profileMenuRef = useRef(null);

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

  const menuItems = [
    { id: 'overview', icon: FiHome, label: t('dashboard.overview') },
    { id: 'members', icon: FiUsers, label: t('dashboard.members') },
    { id: 'attendance', icon: FiUserCheck, label: t('dashboard.attendance') },
    { id: 'schedule', icon: FiCalendar, label: t('dashboard.schedule') },
    { id: 'payments', icon: FiDollarSign, label: t('dashboard.payments') },
    { id: 'analytics', icon: FiBarChart2, label: t('dashboard.analytics') },
    { id: 'settings', icon: FiSettings, label: t('dashboard.settings') }
  ];

  const profileMenu = [
    { id: 'profile', icon: FiUser, label: t('dashboard.profile.viewProfile') },
    { id: 'settings', icon: FiSettings, label: t('dashboard.profile.settings') },
    { id: 'help', icon: FiHelpCircle, label: t('dashboard.profile.help') }
  ];

  const quickActions = [
    { id: 'addMember', icon: FiUserPlus, label: t('dashboard.quickActions.addMember') },
    { id: 'createClass', icon: FiPlus, label: t('dashboard.quickActions.createClass') },
    { id: 'recordPayment', icon: FiDollarSign, label: t('dashboard.quickActions.recordPayment') },
    { id: 'sendAnnouncement', icon: FiBell, label: t('dashboard.quickActions.sendAnnouncement') }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setShowLangMenu(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success(t('auth.signOutSuccess'));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'members':
        return <MembersPanel />;
      case 'payments':
        return <PaymentsPanel />;
      case 'attendance':
        return <AttendancePanel />;
      case 'overview':
        return (
          <>
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
          </>
        );
      default:
        return <div className="p-6">Content for {activeTab}</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="w-64 bg-secondary text-white shadow-lg">
        <div className="p-4">
          <Logo />
        </div>
        
        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 w-full px-4 py-2 rounded-lg transition-colors ${
                  activeTab === item.id 
                    ? 'bg-primary text-secondary font-medium' 
                    : 'text-gray-300 hover:text-primary-light'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-secondary-light">
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 w-full px-4 py-2 text-red-400 hover:text-red-300 rounded-lg transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            <span>{t('nav.signOut')}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-4 px-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-secondary">
                {menuItems.find(item => item.id === activeTab)?.label}
              </h2>
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-600 hover:text-gray-900 relative">
                  <FiBell className="w-6 h-6" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <span className="text-gray-600">
                  {user?.user_metadata?.full_name || user?.email}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 px-4">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
