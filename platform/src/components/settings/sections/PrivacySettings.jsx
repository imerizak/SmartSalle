import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch } from '@headlessui/react';
import toast from 'react-hot-toast';

export default function PrivacySettings() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({
    shareAnalytics: true,
    memberPhotos: true,
    publicProfile: false,
    dataRetention: '12months',
    marketing: false,
    thirdParty: false
  });

  const handleSave = () => {
    toast.success(t('settings.messages.saveSuccess'));
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {t('settings.privacy.title')}
        </h3>

        <div className="space-y-6">
          {/* Data Sharing */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">
              {t('settings.privacy.dataSharing')}
            </h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {t('settings.privacy.shareAnalytics')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t('settings.privacy.shareAnalyticsDescription')}
                  </p>
                </div>
                <Switch
                  checked={settings.shareAnalytics}
                  onChange={(checked) => setSettings({ ...settings, shareAnalytics: checked })}
                  className={`${
                    settings.shareAnalytics ? 'bg-primary' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      settings.shareAnalytics ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {t('settings.privacy.memberPhotos')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t('settings.privacy.memberPhotosDescription')}
                  </p>
                </div>
                <Switch
                  checked={settings.memberPhotos}
                  onChange={(checked) => setSettings({ ...settings, memberPhotos: checked })}
                  className={`${
                    settings.memberPhotos ? 'bg-primary' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      settings.memberPhotos ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>
            </div>
          </div>

          {/* Data Retention */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">
              {t('settings.privacy.dataRetention')}
            </h4>
            
            <select
              value={settings.dataRetention}
              onChange={(e) => setSettings({ ...settings, dataRetention: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="6months">{t('settings.privacy.retention.6months')}</option>
              <option value="12months">{t('settings.privacy.retention.12months')}</option>
              <option value="24months">{t('settings.privacy.retention.24months')}</option>
              <option value="forever">{t('settings.privacy.retention.forever')}</option>
            </select>
          </div>

          {/* Marketing Preferences */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">
              {t('settings.privacy.marketingPreferences')}
            </h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {t('settings.privacy.marketing')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t('settings.privacy.marketingDescription')}
                  </p>
                </div>
                <Switch
                  checked={settings.marketing}
                  onChange={(checked) => setSettings({ ...settings, marketing: checked })}
                  className={`${
                    settings.marketing ? 'bg-primary' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      settings.marketing ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {t('settings.privacy.thirdParty')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t('settings.privacy.thirdPartyDescription')}
                  </p>
                </div>
                <Switch
                  checked={settings.thirdParty}
                  onChange={(checked) => setSettings({ ...settings, thirdParty: checked })}
                  className={`${
                    settings.thirdParty ? 'bg-primary' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      settings.thirdParty ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            {t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
