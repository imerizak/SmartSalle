import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiX, FiLoader } from "react-icons/fi";
import MemberModal from "./MemberModal";
import toast from "react-hot-toast";
import { memberService } from "../../services/memberService"; // Importer le service

export default function MembersPanel() {
  const { t } = useTranslation();
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Le backend retourne une page, on accède à `content` pour la liste
      const data = await memberService.getAllMembers({ 
        // page: 0, size: 10, // Ajouter la pagination si nécessaire
        // searchTerm: searchTerm // Ajouter la recherche côté backend si implémentée
      });
      // Adapter les données du backend à la structure attendue par le frontend si besoin
      const adaptedMembers = data.content.map(user => ({
        id: user.id,
        name: `${user.firstname} ${user.lastname}`,
        email: user.email,
        phone: user.phone,
        // Les champs suivants peuvent nécessiter une adaptation ou provenir d'autres sources
        membership: user.membershipType || "N/A", // Supposant que le backend renvoie membershipType
        status: user.status || "active", // Supposant que le backend renvoie un status
        joinDate: user.createdAt || new Date().toISOString(), // Supposant un champ createdAt
      }));
      setMembers(adaptedMembers);
    } catch (err) {
      setError(err.message);
      toast.error(`${t("members.fetchError")}: ${err.message}`);
    }
    setLoading(false);
  }, [t]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleAddMember = async (newMemberData) => {
    setLoading(true);
    try {
      // newMemberData est ce qui vient du formulaire MemberModal
      // Il faut l'adapter à ce qu'attend memberService.createMember
      const memberToCreate = {
        name: newMemberData.name, // Le service s'attend à `name` et le splittera
        email: newMemberData.email,
        phone: newMemberData.phone,
        // membership et status sont gérés par le backend ou via d'autres logiques
      };
      await memberService.createMember(memberToCreate);
      toast.success(t("members.addSuccess"));
      fetchMembers(); // Recharger la liste
    } catch (err) {
      toast.error(`${t("members.addError")}: ${err.message}`);
    }
    setLoading(false);
    setIsModalOpen(false);
  };

  const handleEditMember = async (updatedMemberData) => {
    if (!editingMember) return;
    setLoading(true);
    try {
      // updatedMemberData est ce qui vient du formulaire MemberModal
      // Il faut l'adapter à ce qu'attend memberService.updateMember
      const memberToUpdate = {
        id: editingMember.id, // L'ID est crucial
        name: updatedMemberData.name,
        email: updatedMemberData.email,
        phone: updatedMemberData.phone,
      };
      await memberService.updateMember(editingMember.id, memberToUpdate);
      toast.success(t("members.updateSuccess"));
      fetchMembers(); // Recharger la liste
    } catch (err) {
      toast.error(`${t("members.updateError")}: ${err.message}`);
    }
    setLoading(false);
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const handleDeleteMember = async (id) => {
    if (window.confirm(t("members.deleteConfirm"))) {
      setLoading(true);
      try {
        await memberService.deleteMember(id);
        toast.success(t("members.deleteSuccess"));
        fetchMembers(); // Recharger la liste
      } catch (err) {
        toast.error(`${t("members.deleteError")}: ${err.message}`);
      }
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          {t("members.title")}
        </h2>
        <button
          onClick={() => {
            setEditingMember(null);
            setIsModalOpen(true);
          }}
          className="bg-gradient-primary text-secondary px-4 py-2 rounded-md hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <FiPlus className="w-5 h-5" />
          {t("members.addNew")}
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder={t("members.search")}
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

      {/* Members Table */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("members.table.name")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("members.table.contact")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("members.table.membership")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("members.table.status")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("members.table.joinDate")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("members.table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.email}</div>
                      <div className="text-sm text-gray-500">{member.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/10 text-primary">
                        {member.membership}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        member.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(member.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          // Pour l'édition, il faut s'assurer que `editingMember` a la structure attendue par MemberModal
                          // et que `member` (de la liste) a tous les champs nécessaires.
                          setEditingMember(member); 
                          setIsModalOpen(true);
                        }}
                        className="text-primary hover:text-primary-dark mr-3"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <MemberModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMember(null);
        }}
        onSubmit={(memberData) => {
          if (editingMember) {
            handleEditMember(memberData);
          } else {
            handleAddMember(memberData);
          }
        }}
        member={editingMember} // S'assurer que `editingMember` a la structure attendue par le modal (name, email, phone)
      />
    </div>
  );
}

