export default function StatsCard({ title, value, icon: Icon, trend, color = "primary" }) {
  const colors = {
    primary: "text-primary",
    success: "text-green-500",
    warning: "text-yellow-500",
    danger: "text-red-500"
  };

  const trendColors = {
    up: "text-green-500",
    down: "text-red-500"
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-full ${color === 'primary' ? 'bg-primary/10' : 'bg-gray-100'}`}>
          <Icon className={`w-6 h-6 ${colors[color]}`} />
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trendColors[trend.direction]}`}>
            {trend.value}
          </span>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
