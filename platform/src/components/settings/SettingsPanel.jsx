import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiGlobe, FiBell, FiLock, FiCreditCard, FiUsers, FiShield } from 'react-icons/fi';
import GeneralSettings from './sections/GeneralSettings';
import NotificationSettings from './sections/NotificationSettings';
import SecuritySettings from './sections/SecuritySettings';
import BillingSettings from './sections/BillingSettings';
import TeamSettings from './sections/TeamSettings';
import PrivacySettings from './sections/PrivacySettings';

export default function SettingsPanel() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', icon: FiGlobe, label: t('settings.tabs.general') },
    { id: 'notifications', icon: FiBell, label: t('settings.tabs.notifications') },
    { id: 'security', icon: FiLock, label: t('settings.tabs.security') },
    { id: 'billing', icon: FiCreditCard, label: t('settings.tabs.billing') },
    { id: 'team', icon: FiUsers, label: t('settings.tabs.team') },
    { id: 'privacy', icon: FiShield, label: t('settings.tabs.privacy') }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'billing':
        return <BillingSettings />;
      case 'team':
        return <TeamSettings />;
      case 'privacy':
        return <PrivacySettings />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          {t('settings.title')}
        </h2>
        <p className="text-sm text-gray-500">
          {t('settings.subtitle')}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow">
            <nav className="space-y-1 p-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className={`mr-3 h-5 w-5 ${
                    activeTab === tab.id ? 'text-white' : 'text-gray-400'
                  }`} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
