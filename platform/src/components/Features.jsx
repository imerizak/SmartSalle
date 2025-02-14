import { FiCalendar, FiUsers, FiDollarSign, FiBarChart2 } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

export default function Features() {
  const { t } = useTranslation();

  const features = [
    {
      name: t('features.memberManagement.title'),
      description: t('features.memberManagement.description'),
      icon: FiUsers,
    },
    {
      name: t('features.classScheduling.title'),
      description: t('features.classScheduling.description'),
      icon: FiCalendar,
    },
    {
      name: t('features.paymentProcessing.title'),
      description: t('features.paymentProcessing.description'),
      icon: FiDollarSign,
    },
    {
      name: t('features.analytics.title'),
      description: t('features.analytics.description'),
      icon: FiBarChart2,
    },
  ];

  return (
    <div id="features" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {t('features.title')}
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{feature.name}</h3>
                    <p className="mt-5 text-base text-gray-500">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
