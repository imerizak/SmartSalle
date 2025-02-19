import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { 
  FiHome, 
  FiUsers, 
  FiCalendar, 
  FiDollarSign, 
  FiSettings,
  FiLogOut,
  FiBell,
  FiUser,
  FiUserCheck
} from 'react-icons/fi';
import Logo from './Logo';
import MembershipGraph from './dashboard/MembershipGraph';
import StatsCard from './dashboard/StatsCard';
import MembersPanel from './members/MembersPanel';
import PaymentsPanel from './payments/PaymentsPanel';
import AttendancePanel from './attendance/AttendancePanel';
import EventsPanel from './events/EventsPanel';
import CoachesPanel from './coaches/CoachesPanel';
import ProfileDropdown from './profile/ProfileDropdown';
import Overview from './Overview';

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the current active tab from the URL path
  const getCurrentTab = () => {
    const path = location.pathname.split('/')[2] || 'overview';
    return path;
  };

  const [activeTab, setActiveTab] = useState(getCurrentTab());

  const menuItems = [
    { id: 'overview', icon: FiHome, label: t('dashboard.overview') },
    { id: 'members', icon: FiUsers, label: t('dashboard.members') },
    { id: 'coaches', icon: FiUser, label: t('dashboard.coaches') },
    { id: 'attendance', icon: FiUserCheck, label: t('dashboard.attendance') },
    { id: 'events', icon: FiCalendar, label: t('dashboard.events') },
    { id: 'payments', icon: FiDollarSign, label: t('dashboard.payments') },
    { id: 'settings', icon: FiSettings, label: t('dashboard.settings') }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/dashboard/${tabId}`);
  };

  return (
    <div className="flex h-screen bg-gray-100" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <div className="w-64 bg-secondary text-white shadow-lg relative">
        <div className="p-4">
          <Logo />
        </div>
        
        {/* Navigation Menu */}
        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors ${
                  activeTab === item.id 
                    ? 'bg-primary text-secondary font-medium' 
                    : 'text-gray-300 hover:text-primary-light'
                }`}
              >
                <item.icon className={`w-5 h-5 ${i18n.language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-4 px-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-secondary">
                {menuItems.find(item => item.id === activeTab)?.label}
              </h2>
              <div className="flex items-center gap-4">
                <button className="p-2 text-gray-600 hover:text-gray-900 relative">
                  <FiBell className="w-6 h-6" />
                  <span className={`absolute top-1 ${i18n.language === 'ar' ? 'left-1' : 'right-1'} w-2 h-2 bg-red-500 rounded-full`}></span>
                </button>
                <ProfileDropdown />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/members" element={<MembersPanel />} />
            <Route path="/coaches" element={<CoachesPanel />} />
            <Route path="/attendance" element={<AttendancePanel />} />
            <Route path="/events" element={<EventsPanel />} />
            <Route path="/payments" element={<PaymentsPanel />} />
            <Route path="/settings" element={<div className="p-6">Settings Content</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
