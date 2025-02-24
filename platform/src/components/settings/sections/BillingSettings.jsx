import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiCreditCard, FiDownload } from 'react-icons/fi';

export default function BillingSettings() {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState('premium');

  const plans = [
    {
      id: 'basic',
      name: t('settings.billing.plans.basic.name'),
      price: '$29',
      features: [
        t('settings.billing.plans.basic.feature1'),
        t('settings.billing.plans.basic.feature2'),
        t('settings.billing.plans.basic.feature3')
      ]
    },
    {
      id: 'premium',
      name: t('settings.billing.plans.premium.name'),
      price: '$99',
      features: [
        t('settings.billing.plans.premium.feature1'),
        t('settings.billing.plans.premium.feature2'),
        t('settings.billing.plans.premium.feature3')
      ]
    },
    {
      id: 'enterprise',
      name: t('settings.billing.plans.enterprise.name'),
      price: '$299',
      features: [
        t('settings.billing.plans.enterprise.feature1'),
        t('settings.billing.plans.enterprise.feature2'),
        t('settings.billing.plans.enterprise.feature3')
      ]
    }
  ];

  const recentInvoices = [
    {
      id: 1,
      date: '2024-02-01',
      amount: '$99.00',
      status: 'paid'
    },
    {
      id: 2,
      date: '2024-01-01',
      amount: '$99.00',
      status: 'paid'
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Current Plan */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {t('settings.billing.currentPlan')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`border rounded-lg p-4 ${
                selectedPlan === plan.id
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium">{plan.name}</h4>
                <span className="text-2xl font-bold">{plan.price}</span>
              </div>
              <ul className="space-y-2 mb-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center">
                    <span className="mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setSelectedPlan(plan.id)}
                className={`w-full py-2 rounded-md text-center ${
                  selectedPlan === plan.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {selectedPlan === plan.id
                  ? t('settings.billing.currentPlanButton')
                  : t('settings.billing.switchPlanButton')}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {t('settings.billing.paymentMethod')}
        </h3>
        <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <FiCreditCard className="text-gray-400 w-6 h-6 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">•••• •••• •••• 4242</p>
              <p className="text-sm text-gray-500">Expires 12/24</p>
            </div>
          </div>
          <button className="text-primary hover:text-primary-dark">
            {t('settings.billing.updateCard')}
          </button>
        </div>
      </div>

      {/* Billing History */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {t('settings.billing.history')}
        </h3>
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t('settings.billing.date')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t('settings.billing.amount')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {t('settings.billing.status')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    {t('settings.billing.download')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(invoice.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button className="text-primary hover:text-primary-dark flex items-center justify-end gap-1">
                        <FiDownload className="w-4 h-4" />
                        {t('settings.billing.downloadInvoice')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
