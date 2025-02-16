import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiSearch, FiX, FiAlertCircle, FiCheckCircle, FiClock } from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Mock data - replace with actual data from your backend
const mockPayments = [
  {
    id: 1,
    memberName: 'John Doe',
    memberEmail: 'john@example.com',
    amount: 299.99,
    dueDate: '2023-08-15',
    status: 'paid',
    paidAt: '2023-08-14',
    membershipType: 'Premium'
  },
  {
    id: 2,
    memberName: 'Jane Smith',
    memberEmail: 'jane@example.com',
    amount: 199.99,
    dueDate: '2023-08-20',
    status: 'pending',
    paidAt: null,
    membershipType: 'Basic'
  },
  // Add more mock data...
];

export default function PaymentsPanel() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Calculate statistics for the pie chart
  const paidCount = mockPayments.filter(p => p.status === 'paid').length;
  const pendingCount = mockPayments.filter(p => p.status === 'pending').length;
  const totalCount = mockPayments.length;

  const pieData = [
    { name: t('payments.status.paid'), value: paidCount, color: '#10B981' },
    { name: t('payments.status.pending'), value: pendingCount, color: '#F59E0B' }
  ];

  const filteredPayments = mockPayments.filter(payment => {
    const matchesSearch = payment.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.memberEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalAmount = mockPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const paidAmount = mockPayments
    .filter(payment => payment.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = totalAmount - paidAmount;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {t('payments.title')}
        </h2>
        <p className="text-sm text-gray-500">
          {t('payments.subtitle')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">{t('payments.totalAmount')}</h3>
          <p className="text-3xl font-semibold text-gray-900">${totalAmount.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">{t('payments.paidAmount')}</h3>
          <p className="text-3xl font-semibold text-green-600">${paidAmount.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">{t('payments.pendingAmount')}</h3>
          <p className="text-3xl font-semibold text-primary">${pendingAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Payment Status Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('payments.statusDistribution')}
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder={t('payments.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-md ${
              filterStatus === 'all' 
                ? 'bg-gray-200 text-gray-800' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t('payments.all')}
          </button>
          <button
            onClick={() => setFilterStatus('paid')}
            className={`px-4 py-2 rounded-md ${
              filterStatus === 'paid' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t('payments.paid')}
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2 rounded-md ${
              filterStatus === 'pending' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t('payments.pending')}
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('payments.table.member')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('payments.table.amount')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('payments.table.dueDate')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('payments.table.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('payments.table.membership')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {payment.memberName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.memberEmail}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${payment.amount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(payment.dueDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      payment.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payment.status === 'paid' ? (
                        <FiCheckCircle className="mr-1" />
                      ) : (
                        <FiClock className="mr-1" />
                      )}
                      {t(`payments.status.${payment.status}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.membershipType}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
