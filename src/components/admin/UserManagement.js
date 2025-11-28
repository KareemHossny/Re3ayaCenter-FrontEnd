import React, { useState, useEffect } from 'react';
import { adminAPI, specializationAPI } from '../../services/api';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../common/LoadingSpinner';
import { ShieldCheckIcon, UserIcon } from "@heroicons/react/24/outline";
import toast from 'react-hot-toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    fetchUsers();
    fetchSpecializations();
    // eslint-disable-next-line
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers();
      // Handle different response structures
      const usersData = Array.isArray(response.data) ? response.data : 
                       response.data?.users || response.data?.data || [];
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error(t('error_loading_users'));
      setUsers([]); // Ensure it's always an array
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecializations = async () => {
    try {
      const response = await specializationAPI.getSpecializations();
      // Handle different response structures
      const specializationsData = Array.isArray(response.data) ? response.data : 
                                response.data?.specializations || response.data?.data || [];
      setSpecializations(specializationsData);
    } catch (error) {
      console.error('Error fetching specializations:', error);
      toast.error(t('error_loading_specializations'));
      setSpecializations([]); // Ensure it's always an array
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(t('confirm_role_change', { role: getRoleText(newRole) }))) {
      return;
    }

    setUpdating(userId);
    try {
      await adminAPI.updateUserRole(userId, newRole);

      setUsers(prev => prev.map(user =>
        user._id === userId
          ? {
            ...user,
            role: newRole,
            ...(newRole === 'patient' && { specialization: null, availability: [] })
          }
          : user
      ));
      toast.success(t('role_changed_success', { role: getRoleText(newRole) }));
    } catch (error) {
      toast.error(error?.response?.data?.message || t('error_changing_role'));
    } finally {
      setUpdating(null);
    }
  };

  // Placeholder for future API implementation
  const handleSpecializationChange = async (userId, specializationId) => {
    toast.loading(t('updating_doctor_specialization'));
    setTimeout(() => {
      toast.success(t('specialization_update_coming_soon'));
    }, 1000);
  };

  const getRoleText = (role) => {
    const roles = {
      patient: t('patient'),
      doctor: t('doctor'),
      admin: t('admin')
    };
    return roles[role] || role;
  };

  const getRoleColor = (role) => {
    const colors = {
      patient: 'bg-blue-100 text-blue-800',
      doctor: 'bg-green-100 text-green-800',
      admin: 'bg-purple-100 text-purple-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || user.role === filter;
    const matchesSearch =
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16 h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="px-2 md:px-6 py-2 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-snug">
          {t('user_management')}
        </h2>
        <div className="text-sm text-gray-600 bg-gray-100 rounded px-3 py-1">
          {t('total_users')}: <span className="font-bold">{users.length}</span>
        </div>
      </div>

      {/* الفلتر والبحث */}
      <div className="card mb-6 p-4 bg-white border border-gray-100 shadow-sm rounded-2xl">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="flex-1">
            <input
              type="text"
              placeholder={t('search_users_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input w-full rounded-md border-gray-200 focus:ring-primary-500 focus:border-primary-400 transition-all"
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="form-input w-full rounded-md border-gray-200 focus:ring-primary-500 focus:border-primary-400 transition-all"
            >
              <option value="all">{t('all_roles')}</option>
              <option value="patient">{t('patients')}</option>
              <option value="doctor">{t('doctors')}</option>
              <option value="admin">{t('admins')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* جدول المستخدمين */}
      <div className="card bg-white border border-gray-100 shadow-md rounded-2xl overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 md:px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                {t('user')}
              </th>
              <th className="px-3 md:px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                {t('email')}
              </th>
              <th className="px-3 md:px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                {t('role')}
              </th>
              <th className="px-3 md:px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                {t('specialization')}
              </th>
              <th className="px-3 md:px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                {t('actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-primary-50 transition-colors">
                <td className="px-3 md:px-6 py-3 min-w-[180px] whitespace-nowrap">
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center overflow-hidden shadow-sm border border-primary-100">
                      {user.role === 'doctor' ? (
                        <span className="text-lg">🥼</span>
                      ) : user.role === 'admin' ? (
                        <ShieldCheckIcon className="h-6 w-6 text-primary-600" />
                      ) : (
                        <UserIcon className="h-6 w-6 text-primary-500" />
                      )}
                    </div>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <div className="text-sm md:text-base font-semibold text-gray-900 break-all">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.phone || t('none')}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 md:px-6 py-3 whitespace-nowrap">
                  <div className="text-xs md:text-sm text-gray-800 break-all">{user.email}</div>
                </td>
                <td className="px-3 md:px-6 py-3 whitespace-nowrap">
                  <span className={`inline-flex min-w-[56px] justify-center px-2 py-1 text-xs font-bold rounded-full ${getRoleColor(user.role)}`}>
                    {getRoleText(user.role)}
                  </span>
                </td>
                <td className="px-3 md:px-6 py-3 whitespace-nowrap text-xs md:text-sm text-gray-900">
                  {user.specialization?.name || <span className="text-gray-400">---</span>}
                </td>
                <td className="px-3 md:px-6 py-3 whitespace-nowrap">
                  <div className={`flex flex-col 2xs:flex-row gap-2 w-full ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      disabled={updating === user._id}
                      className="text-xs md:text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-500 disabled:opacity-60"
                    >
                      <option value="patient">{t('patient')}</option>
                      <option value="doctor">{t('doctor')}</option>
                      <option value="admin">{t('admin')}</option>
                    </select>
                    {user.role === 'doctor' && (
                      <select
                        value={user.specialization?._id || ''}
                        onChange={(e) => handleSpecializationChange(user._id, e.target.value)}
                        className="text-xs md:text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-500"
                      >
                        <option value="">{t('choose_specialization')}</option>
                        {/* Safe array mapping */}
                        {Array.isArray(specializations) && specializations.map((spec) => (
                          <option key={spec._id} value={spec._id}>
                            {spec.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  {updating === user._id && (
                    <div className="mt-1">
                      <LoadingSpinner size="sm" />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('no_results')}
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? t('no_users_found')
                : t('no_users_available')}
            </p>
          </div>
        )}
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="card text-center bg-blue-50 border border-blue-100 rounded-2xl shadow-sm py-4">
          <div className="text-2xl font-extrabold text-blue-600 mb-1">
            {users.filter(u => u.role === 'patient').length}
          </div>
          <div className="text-sm text-gray-700">{t('patient')}</div>
        </div>
        <div className="card text-center bg-green-50 border border-green-100 rounded-2xl shadow-sm py-4">
          <div className="text-2xl font-extrabold text-green-600 mb-1">
            {users.filter(u => u.role === 'doctor').length}
          </div>
          <div className="text-sm text-gray-700">{t('doctor')}</div>
        </div>
        <div className="card text-center bg-purple-50 border border-purple-100 rounded-2xl shadow-sm py-4">
          <div className="text-2xl font-extrabold text-purple-600 mb-1">
            {users.filter(u => u.role === 'admin').length}
          </div>
          <div className="text-sm text-gray-700">{t('admin')}</div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;