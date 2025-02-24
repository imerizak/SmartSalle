import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch } from '@headlessui/react';
import toast from 'react-hot-toast';
import { requestNotificationPermission } from '../../../utils/notifications';

export default function NotificationSettings() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({
    browser: true,
    email: {
      newMembers: true,
      payments: true,
      classBookings: true,
      systemUpdates: false
    },
    push: {
      checkIns: true,
      lowAttendance: true,
      membershipExpiry: true,
      dailyReport: false
    }
  });

  const handleSave = async () => {
    if (settings.browser) {
      const permission = await requestNotificationPermission();
      if (!permission) {
        toast.error(t('settings.notifications.browserPermissionDenied'));
        return;
      }
    }
    toast.success(t('settings.messages.saveSuccess'));
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {t('settings.notifications.title')}
        </h3>

        <div className="space-y-6">
          {/* Browser Notifications */}
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  {t('settings.notifications.browser')}
                </h4>
                <p className="text-sm text-gray-500">
                  {t('settings.notifications.browserDescription')}
                </p>
              </div>
              <Switch
                checked={settings.browser}
                onChange={(checked) => setSettings({ ...settings, browser: checked })}
                className={`${
                  settings.browser ? 'bg-primary' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
              >
                <span
                  className={`${
                    settings.browser ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>
          </div>

          {/* Email Notifications */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">
              {t('settings.notifications.email')}
            </h4>
            <div className="space-y-4">
              {Object.entries(settings.email).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      {t(`settings.notifications.email${key.charAt(0).toUpperCase() + key.slice(1)}`)}
                    </p>
                  </div>
                  <Switch
                    checked={value}
                    onChange={(checked) => 
                      setSettings({
                        ...settings,
                        email: { ...settings.email, [key]: checked }
                      })
                    }
                    className={`${
                      value ? 'bg-primary' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        value ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
              ))}
            </div>
          </div>

          {/* Push Notifications */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">
              {t('settings.notifications.push')}
            </h4>
            <div className="space-y-4">
              {Object.entries(settings.push).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      {t(`settings.notifications.push${key.charAt(0).toUpperCase() + key.slice(1)}`)}
                    </p>
                  </div>
                  <Switch
                    checked={value}
                    onChange={(checked) => 
                      setSettings({
                        ...settings,
                        push: { ...settings.push, [key]: checked }
                      })
                    }
                    className={`${
                      value ? 'bg-primary' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        value ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          {t('common.save')}
        </button>
      </div>
    </div>
  );
}
