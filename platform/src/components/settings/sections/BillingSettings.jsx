
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