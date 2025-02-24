import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiSearch, FiX, FiUserCheck, FiUsers, FiClock, FiPlus } from 'react-icons/fi';
import QRScanner from './QRScanner';
import toast from 'react-hot-toast';

export default function AttendancePanel() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [showScanner, setShowScanner] = useState(false);
  const [attendance, setAttendance] = useState([
    {
      id: 1,
      memberId: 'MEM001',
      memberName: 'John Doe',
      checkIn: '2024-02-15T09:00:00',
      checkOut: '2024-02-15T10:30:00',
      duration: 90,
      type: 'Gym Session'
    },
    {
      id: 2,
      memberId: 'MEM002',
      memberName: 'Jane Smith',
      checkIn: '2024-02-15T10:00:00',
      checkOut: null,
      duration: null,
      type: 'Yoga Class'
    }
  ]);

  // Calculate stats
  const averageStayTime = Math.round(
    attendance
      .filter(record => record.duration)
      .reduce((sum, record) => sum + record.duration, 0) / 
    attendance.filter(record => record.duration).length
  );

  const stats = [
    {
      icon: FiUserCheck,
      title: t('dashboard.attendance.stats.totalVisits'),
      value: attendance.length,
      color: 'primary'
    },
    {
      icon: FiUsers,
      title: t('dashboard.attendance.stats.uniqueVisitors'),
      value: new Set(attendance.map(record => record.memberId)).size,
      color: 'success'
    },
    {
      icon: FiClock,
      title: t('dashboard.attendance.stats.averageVisitDuration'),
      value: `${averageStayTime} min`,
      color: 'warning'
    }
  ];

  const handleScan = (memberId) => {
    const member = attendance.find(record => 
      record.memberId === memberId && !record.checkOut
    );

    if (member) {
      // Check-out
      const updatedAttendance = attendance.map(record =>
        record.id === member.id
          ? {
              ...record,
              checkOut: new Date().toISOString(),
              duration: 90 // Mock duration - calculate actual in real app
            }
          : record
      );
      setAttendance(updatedAttendance);
      toast.success(t('dashboard.attendance.messages.success.checkOut'));
    } else {
      // Check-in
      const newRecord = {
        id: Date.now(),
        memberId,
        memberName: 'John Doe', // Mock - get actual member name in real app
        checkIn: new Date().toISOString(),
        checkOut: null,
        duration: null,
        type: 'Gym Session'
      };
      setAttendance([newRecord, ...attendance]);
      toast.success(t('dashboard.attendance.messages.success.checkIn'));
    }
    setShowScanner(false);
  };

  const filteredAttendance = attendance.filter(record => {
    const matchesSearch = 
      record.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.memberId.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesFilter = true;
    const now = new Date();
    const recordDate = new Date(record.checkIn);

    switch (currentFilter) {
      case 'today':
        matchesFilter = recordDate.toDateString() === now.toDateString();
        break;
      case 'thisWeek':
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        matchesFilter = recordDate >= weekAgo;
        break;
      case 'thisMonth':
        matchesFilter = 
          recordDate.getMonth() === now.getMonth() &&
          recordDate.getFullYear() === now.getFullYear();
        break;
      default:
        matchesFilter = true;
    }

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {t('dashboard.attendance.title')}
          </h2>
          <p className="text-sm text-gray-500">
            {t('dashboard.attendance.subtitle')}
          </p>
        </div>
        <button
          onClick={() => setShowScanner(true)}
          className="bg-gradient-primary text-secondary px-4 py-2 rounded-md hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <FiPlus className="w-5 h-5" />
          {t('dashboard.attendance.scanQR')}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-full ${stat.color === 'primary' ? 'bg-primary/10' : 'bg-gray-100'}`}>
                <stat.icon className={`w-6 h-6 ${
                  stat.color === 'primary' ? 'text-primary' :
                  stat.color === 'success' ? 'text-green-500' :
                  'text-yellow-500'
                }`} />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder={t('dashboard.attendance.search')}
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
          {['all', 'today', 'thisWeek', 'thisMonth'].map((filter) => (
            <button
              key={filter}
              onClick={() => setCurrentFilter(filter)}
              className={`px-4 py-2 rounded-md ${
                currentFilter === filter 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t(`dashboard.attendance.filters.${filter}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('dashboard.attendance.table.member')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('dashboard.attendance.table.checkIn')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('dashboard.attendance.table.checkOut')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('dashboard.attendance.table.duration')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('dashboard.attendance.table.type')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAttendance.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {record.memberName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {record.memberId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(record.checkIn).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {record.checkOut 
                        ? new Date(record.checkOut).toLocaleString()
                        : t('dashboard.attendance.active')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {record.duration 
                        ? `${record.duration} min`
                        : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.type}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showScanner && (
        <QRScanner
          onClose={() => setShowScanner(false)}
          onScan={handleScan}
        />
      )}
    </div>
  );
}
