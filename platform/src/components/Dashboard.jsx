import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { FiHome, FiUsers, FiCalendar, FiDollarSign, FiBarChart2, FiSettings, FiLogOut } from 'react-icons/fi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success(t('auth.signOutSuccess'));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const menuItems = [
    { id: 'overview', icon: FiHome, label: t('dashboard.overview') },
    { id: 'members', icon: FiUsers, label: t('dashboard.members') },
    { id: 'schedule', icon: FiCalendar, label: t('dashboard.schedule') },
    { id: 'payments', icon: FiDollarSign, label: t('dashboard.payments') },
    { id: 'analytics', icon: FiBarChart2, label: t('dashboard.analytics') },
    { id: 'settings', icon: FiSettings, label: t('dashboard.settings') }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-primary">SmartSalle</h1>
        </div>
        
        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 w-full px-4 py-2 rounded-lg transition-colors ${
                  activeTab === item.id 
                    ? 'bg-primary text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
            
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FiLogOut className="w-5 h-5" />
              <span>{t('nav.signOut')}</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-4 px-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                {menuItems.find(item => item.id === activeTab)?.label}
              </h2>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">
                  {user?.user_metadata?.full_name || user?.email}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 px-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {t('dashboard.welcomeMessage')}
            </h3>
            <p className="text-gray-600">
              {t('dashboard.organizationInfo', { 
                organization: user?.user_metadata?.organization 
              })}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
