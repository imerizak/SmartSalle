import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FiSearch, FiX, FiCheckCircle, FiClock, FiLoader } from "react-icons/fi";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { paymentService } from "../../services/paymentService"; // Importer le service
import toast from "react-hot-toast";

export default function PaymentsPanel() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // "all", "paid", "pending"
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
    totalTransactions: 0,
  });
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filterStatus !== "all") {
        params.status = filterStatus.toUpperCase(); // Le backend attend PENDING ou PAID
      }
      // Ajouter d'autres filtres si nécessaire (searchTerm côté backend, date ranges)
      const data = await paymentService.getAllPayments(params);
      // Adapter les données du backend (Page<Payment>)
      // Payment: id, user (User), membership (Membership), amount, dueDate, paymentDate, paymentMethod, status
      const adaptedPayments = data.content.map(p => ({
        id: p.id,
        memberName: `${p.user.firstname} ${p.user.lastname}`,
        memberEmail: p.user.email,
        amount: p.amount,
        dueDate: p.dueDate, // Format YYYY-MM-DD
        status: p.status.toLowerCase(), // Le frontend utilise lowercase
        paidAt: p.paymentDate, // Format ISO DateTime
        membershipType: p.membership?.name || "N/A", // Supposant que membership a un nom
      }));
      setPayments(adaptedPayments);
    } catch (err) {
      setError(err.message);
      toast.error(`${t("payments.fetchError")}: ${err.message}`);
    }
    setLoading(false);
  }, [t, filterStatus]);

  const fetchPaymentStats = useCallback(async () => {
    try {
      const statsData = await paymentService.getPaymentStats();
      // statsData: { totalAmount, paidAmount, pendingAmount, totalTransactions }
      setStats(statsData);

      const newPieData = [
        { name: t("payments.status.paid"), value: statsData.paidAmount || 0, color: "#10B981" },
        { name: t("payments.status.pending"), value: statsData.pendingAmount || 0, color: "#F59E0B" },
      ];
      setPieData(newPieData);

    } catch (err) {
      console.error("Failed to fetch payment stats:", err);
      toast.error(`${t("payments.fetchStatsError")}: ${err.message}`);
    }
  }, [t]);

  useEffect(() => {
    fetchPayments();
    fetchPaymentStats();
  }, [fetchPayments, fetchPaymentStats]);

  // Le filtrage par nom/email est pour l'instant côté client.
  // Pourrait être déplacé côté backend pour la performance sur de grands datasets.
  const filteredPaymentsClientSide = payments.filter(payment => {
    const matchesSearch = payment.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.memberEmail.toLowerCase().includes(searchTerm.toLowerCase());
    // Le filtre par statut est déjà géré par l'appel API (param.status)
    return matchesSearch;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {t("payments.title")}
        </h2>
        <p className="text-sm text-gray-500">
          {t("payments.subtitle")}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">{t("payments.totalAmount")}</h3>
          <p className="text-3xl font-semibold text-gray-900">${stats.totalAmount.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">{t("payments.paidAmount")}</h3>
          <p className="text-3xl font-semibold text-green-600">${stats.paidAmount.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">{t("payments.pendingAmount")}</h3>
          <p className="text-3xl font-semibold text-primary">${stats.pendingAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Payment Status Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t("payments.statusDistribution")}
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
                label={({ percent, name, value }) => value > 0 ? `${(percent * 100).toFixed(0)}%` : ""}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`$${value.toFixed(2)}`, name]}/>
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
              placeholder={t("payments.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded-md ${
              filterStatus === "all"
                ? "bg-gray-200 text-gray-800"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {t("payments.all")}
          </button>
          <button
            onClick={() => setFilterStatus("paid")}
            className={`px-4 py-2 rounded-md ${
              filterStatus === "paid"
                ? "bg-green-100 text-green-800"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {t("payments.paid")}
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={`px-4 py-2 rounded-md ${
              filterStatus === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {t("payments.pending")}
          </button>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="flex justify-center items-center p-4">
          <FiLoader className="animate-spin text-primary text-3xl" />
          <p className="ml-2">{t("loading")}</p>
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">{t("error.title")} </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Payments Table */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("payments.table.member")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("payments.table.amount")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("payments.table.dueDate")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("payments.table.status")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("payments.table.membership")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPaymentsClientSide.map((payment) => (
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
                      <div className="text-sm text-gray-900">${payment.amount.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {payment.dueDate ? new Date(payment.dueDate + "T00:00:00").toLocaleDateString() : "N/A"} 
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        payment.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : payment.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {payment.status === "paid" ? (
                          <FiCheckCircle className="mr-1" />
                        ) : payment.status === "pending" ? (
                          <FiClock className="mr-1" />
                        ) : null}
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
      )}
    </div>
  );
}

