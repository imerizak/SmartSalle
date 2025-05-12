import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FiSearch, FiX, FiUserCheck, FiUsers, FiClock, FiPlus, FiLoader } from "react-icons/fi";
import QRScanner from "./QRScanner"; // Supposons que ce composant reste tel quel pour la logique de scan
import toast from "react-hot-toast";
import { attendanceService } from "../../services/attendanceService"; // Importer le service

export default function AttendancePanel() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all"); // "all", "today", "thisWeek", "thisMonth"
  const [showScanner, setShowScanner] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState({
    totalVisits: 0,
    uniqueVisitors: 0,
    averageVisitDuration: "0 min",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAttendanceRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      // Le backend pourrait supporter des filtres par date, à implémenter si besoin
      // if (currentFilter !== "all") params.period = currentFilter;
      const data = await attendanceService.getAllAttendanceRecords(params);
      // Adapter les données du backend si nécessaire
      // Le backend renvoie une Page<AttendanceRecord>
      // AttendanceRecord: id, user (User), checkInTime, checkOutTime, durationMinutes, type
      const adaptedRecords = data.content.map(record => ({
        id: record.id,
        memberId: record.user.id, // ou un autre identifiant unique de l'utilisateur
        memberName: `${record.user.firstname} ${record.user.lastname}`,
        checkIn: record.checkInTime,
        checkOut: record.checkOutTime,
        duration: record.durationMinutes,
        type: record.type || "Gym Session", // Assurer une valeur par défaut
      }));
      setAttendance(adaptedRecords);
    } catch (err) {
      setError(err.message);
      toast.error(`${t("dashboard.attendance.messages.error.fetch")}: ${err.message}`);
    }
    setLoading(false);
  }, [t]); // currentFilter si le backend le gère

  const fetchAttendanceStats = useCallback(async () => {
    // setLoading(true); // Peut être géré séparément ou avec fetchAttendanceRecords
    try {
      const statsData = await attendanceService.getAttendanceStats();
      // Adapter les statsData à la structure attendue par le frontend
      setStats({
        totalVisits: statsData.totalCheckIns || 0,
        uniqueVisitors: statsData.uniqueMembersCheckedInToday || 0, // Adapter selon ce que le backend renvoie
        averageVisitDuration: `${statsData.averageDurationMinutes || 0} min`,
      });
    } catch (err) {
      // Gérer l'erreur de chargement des stats, peut-être moins critique
      console.error("Failed to fetch attendance stats:", err);
      toast.error(`${t("dashboard.attendance.messages.error.fetchStats")}: ${err.message}`);
    }
    // setLoading(false);
  }, [t]);

  useEffect(() => {
    fetchAttendanceRecords();
    fetchAttendanceStats();
  }, [fetchAttendanceRecords, fetchAttendanceStats]);

  const handleScan = async (scannedMemberId) => {
    setLoading(true);
    // Tenter un check-out d'abord si le membre est déjà check-in
    // Le backend gère la logique de check-in/check-out via des endpoints distincts
    // ou un endpoint unique qui détermine l'action.
    // Ici, on suppose que le backend a un endpoint pour check-in et un pour check-out.
    // Le QR code contient l'ID du membre.

    // Pour simplifier, on va appeler un endpoint générique "toggle" ou on essaie check-out puis check-in.
    // Le backend actuel a /check-in et /check-out.
    // On a besoin de savoir si l'utilisateur est déjà check-in pour décider.
    // Cette logique peut être complexe côté client sans état du backend.
    // Idéalement, le backend devrait avoir un endpoint unique pour le scan QR qui gère la logique.

    // Solution temporaire : on essaie de check-in. Si l'utilisateur est déjà check-in et que le backend le gère,
    // il pourrait renvoyer une erreur ou faire un check-out.
    // Ou, on appelle un endpoint spécifique pour le scan qui gère la logique.

    // Pour l'instant, on va simuler un check-in, le backend devra gérer la logique si déjà présent.
    // Le backend actuel a des endpoints séparés. Il faut donc choisir.
    // On va supposer que le scan est toujours un check-in pour l'instant, ou que le backend gère la bascule.
    // Le backend actuel ne semble pas avoir de logique de bascule sur un seul endpoint.

    // On va essayer de faire un check-in. Si le membre est déjà check-in, le backend devrait le gérer (ex: erreur ou mise à jour).
    // Ou, le frontend pourrait d'abord vérifier l'état du membre.

    // Ici, on va appeler checkIn. Le backend devrait idéalement gérer le cas où l'utilisateur est déjà là.
    // Ou le backend pourrait avoir un endpoint /scan-qr qui gère la logique.
    // Pour l'instant, on va juste appeler checkIn et espérer que le backend est intelligent.
    // Le backend actuel a /check-in et /check-out. Le frontend doit choisir.
    // On va supposer que le QR scan fait un check-in. Si l'utilisateur est déjà là, le backend devrait le gérer.

    // Pour une meilleure UX, on pourrait d'abord vérifier si l'utilisateur est déjà check-in (nécessite un endpoint)
    // ou le backend pourrait avoir un endpoint /scan qui gère la logique.
    // Pour l'instant, on va juste appeler checkIn.
    try {
      // Le backend attend { "memberId": "id" }
      await attendanceService.checkIn({ memberId: scannedMemberId });
      toast.success(t("dashboard.attendance.messages.success.checkIn")); // Ou un message générique de scan réussi
      fetchAttendanceRecords(); // Recharger les données
      fetchAttendanceStats();
    } catch (err) {
      // Si le check-in échoue (ex: déjà check-in et le backend ne fait pas de check-out auto),
      // on pourrait tenter un check-out.
      try {
        await attendanceService.checkOut({ memberId: scannedMemberId });
        toast.success(t("dashboard.attendance.messages.success.checkOut"));
        fetchAttendanceRecords();
        fetchAttendanceStats();
      } catch (err2) {
        toast.error(`${t("dashboard.attendance.messages.error.scan")}: ${err.message} / ${err2.message}`);
      }
    }
    setLoading(false);
    setShowScanner(false);
  };
  
  // Le filtrage par date est maintenant supposé être géré par le backend si params.period est envoyé.
  // Si le backend ne le gère pas, le filtrage client-side reste nécessaire.
  // Pour l'instant, on garde le filtrage client-side pour la recherche textuelle.
  const filteredAttendanceClientSide = attendance.filter(record => {
    const matchesSearch = 
      record.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.memberId && record.memberId.toString().toLowerCase().includes(searchTerm.toLowerCase()));

    // Le filtrage par période (today, thisWeek, thisMonth) devrait être fait côté backend.
    // Si ce n'est pas le cas, il faut le réactiver ici.
    let matchesFilter = true;
    if (currentFilter !== "all") {
        const now = new Date();
        const recordDate = new Date(record.checkIn);
        switch (currentFilter) {
          case 'today':
            matchesFilter = recordDate.toDateString() === now.toDateString();
            break;
          case 'thisWeek':
            const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
            weekStart.setHours(0,0,0,0);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            weekEnd.setHours(23,59,59,999);
            matchesFilter = recordDate >= weekStart && recordDate <= weekEnd;
            break;
          case 'thisMonth':
            matchesFilter = 
              recordDate.getMonth() === now.getMonth() &&
              recordDate.getFullYear() === now.getFullYear();
            break;
          default:
            matchesFilter = true;
        }
    }
    return matchesSearch && matchesFilter;
  });

  const statItems = [
    {
      icon: FiUserCheck,
      title: t("dashboard.attendance.stats.totalVisits"),
      value: stats.totalVisits,
      color: "primary",
    },
    {
      icon: FiUsers,
      title: t("dashboard.attendance.stats.uniqueVisitors"),
      value: stats.uniqueVisitors,
      color: "success",
    },
    {
      icon: FiClock,
      title: t("dashboard.attendance.stats.averageVisitDuration"),
      value: stats.averageVisitDuration,
      color: "warning",
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {t("dashboard.attendance.title")}
          </h2>
          <p className="text-sm text-gray-500">
            {t("dashboard.attendance.subtitle")}
          </p>
        </div>
        <button
          onClick={() => setShowScanner(true)}
          className="bg-gradient-primary text-secondary px-4 py-2 rounded-md hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <FiPlus className="w-5 h-5" />
          {t("dashboard.attendance.scanQR")}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statItems.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-full ${stat.color === "primary" ? "bg-primary/10" : stat.color === "success" ? "bg-green-100" : "bg-yellow-100"}`}>
                <stat.icon className={`w-6 h-6 ${
                  stat.color === "primary" ? "text-primary" :
                  stat.color === "success" ? "text-green-500" :
                  "text-yellow-500"
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
              placeholder={t("dashboard.attendance.search")}
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
          {["all", "today", "thisWeek", "thisMonth"].map((filter) => (
            <button
              key={filter}
              onClick={() => setCurrentFilter(filter)}
              className={`px-4 py-2 rounded-md ${
                currentFilter === filter
                  ? "bg-primary text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {t(`dashboard.attendance.filters.${filter}`)}
            </button>
          ))}
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

      {/* Attendance Table */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("dashboard.attendance.table.member")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("dashboard.attendance.table.checkIn")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("dashboard.attendance.table.checkOut")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("dashboard.attendance.table.duration")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("dashboard.attendance.table.type")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAttendanceClientSide.map((record) => (
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
                        {record.checkIn ? new Date(record.checkIn).toLocaleString() : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {record.checkOut
                          ? new Date(record.checkOut).toLocaleString()
                          : t("dashboard.attendance.active")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {record.duration
                          ? `${record.duration} min`
                          : "-"}
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
      )}

      {showScanner && (
        <QRScanner
          onClose={() => setShowScanner(false)}
          onScan={handleScan} // handleScan appelle maintenant le service backend
        />
      )}
    </div>
  );
}

