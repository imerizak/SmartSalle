// Update translation usage in the component
// Add these lines where stats are displayed:

const stats = [
  {
    icon: FiUserCheck,
    title: t('attendance.stats.totalVisits'),
    value: attendance.length,
    color: 'primary'
  },
  {
    icon: FiUsers,
    title: t('attendance.stats.uniqueVisitors'),
    value: new Set(attendance.map(record => record.memberId)).size,
    color: 'success'
  },
  {
    icon: FiClock,
    title: t('attendance.stats.averageVisitDuration'),
    value: `${averageStayTime} min`,
    color: 'warning'
  }
];

// Update filter buttons
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
      {t(`attendance.filters.${filter}`)}
    </button>
  ))}
</div>

// Update error messages
const handleError = (errorKey) => {
  toast.error(t(`attendance.messages.error.${errorKey}`));
};

// Update success messages
const handleSuccess = (messageKey, params = {}) => {
  toast.success(t(`attendance.messages.success.${messageKey}`, params));
};
