import React, { useState, useEffect } from 'react';
import { adminAPI, specializationAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { ShieldCheckIcon, UserIcon } from "@heroicons/react/24/outline";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchSpecializations();
    // eslint-disable-next-line
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecializations = async () => {
    try {
      const response = await specializationAPI.getSpecializations();
      setSpecializations(response.data);
    } catch (error) {
      console.error('Error fetching specializations:', error);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`هل أنت متأكد من تغيير دور المستخدم إلى ${getRoleText(newRole)}؟`)) {
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
      alert('تم تغيير دور المستخدم بنجاح');
    } catch (error) {
      alert(error?.response?.data?.message || 'فشل في تغيير دور المستخدم');
    } finally {
      setUpdating(null);
    }
  };

  // Placeholder for future API implementation
  const handleSpecializationChange = async (userId, specializationId) => {
    alert('سيتم تحديث تخصص الطبيب في الخطوة القادمة');
  };

  const getRoleText = (role) => {
    const roles = {
      patient: 'مريض',
      doctor: 'طبيب',
      admin: 'مدير'
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
    <div className="px-2 md:px-6 py-2 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-snug">إدارة المستخدمين</h2>
        <div className="text-sm text-gray-600 bg-gray-100 rounded px-3 py-1">
          إجمالي المستخدمين: <span className="font-bold">{users.length}</span>
        </div>
      </div>

      {/* الفلتر والبحث */}
      <div className="card mb-6 p-4 bg-white border border-gray-100 shadow-sm rounded-2xl">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="flex-1">
            <input
              type="text"
              placeholder="ابحث عن مستخدم بالاسم أو البريد الإلكتروني..."
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
              <option value="all">جميع الأدوار</option>
              <option value="patient">المرضى</option>
              <option value="doctor">الأطباء</option>
              <option value="admin">المدراء</option>
            </select>
          </div>
        </div>
      </div>

      {/* جدول المستخدمين */}
      <div className="card bg-white border border-gray-100 shadow-md rounded-2xl overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 md:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">المستخدم</th>
              <th className="px-3 md:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">البريد الإلكتروني</th>
              <th className="px-3 md:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">الدور</th>
              <th className="px-3 md:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">التخصص</th>
              <th className="px-3 md:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-primary-50 transition-colors">
                <td className="px-3 md:px-6 py-3 min-w-[180px] whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center overflow-hidden shadow-sm border border-primary-100">
                      {user.role === 'doctor' ? (
                        <span className="text-lg">🥼</span>
                      ) : user.role === 'admin' ? (
                        <ShieldCheckIcon className="h-6 w-6 text-primary-600" />
                      ) : (
                        <UserIcon className="h-6 w-6 text-primary-500" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm md:text-base font-semibold text-gray-900 break-all">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.phone || 'لا يوجد'}</div>
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
                  <div className="flex flex-col 2xs:flex-row gap-2 w-full">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      disabled={updating === user._id}
                      className="text-xs md:text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-500 disabled:opacity-60"
                    >
                      <option value="patient">مريض</option>
                      <option value="doctor">طبيب</option>
                      <option value="admin">مدير</option>
                    </select>
                    {user.role === 'doctor' && (
                      <select
                        value={user.specialization?._id || ''}
                        onChange={(e) => handleSpecializationChange(user._id, e.target.value)}
                        className="text-xs md:text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-500"
                      >
                        <option value="">اختر التخصص</option>
                        {specializations.map((spec) => (
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
              لا توجد نتائج
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? 'لم نتمكن من العثور على مستخدمين يتطابقون مع بحثك.'
                : 'لا توجد مستخدمين لعرضهم.'}
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
          <div className="text-sm text-gray-700">مريض</div>
        </div>
        <div className="card text-center bg-green-50 border border-green-100 rounded-2xl shadow-sm py-4">
          <div className="text-2xl font-extrabold text-green-600 mb-1">
            {users.filter(u => u.role === 'doctor').length}
          </div>
          <div className="text-sm text-gray-700">طبيب</div>
        </div>
        <div className="card text-center bg-purple-50 border border-purple-100 rounded-2xl shadow-sm py-4">
          <div className="text-2xl font-extrabold text-purple-600 mb-1">
            {users.filter(u => u.role === 'admin').length}
          </div>
          <div className="text-sm text-gray-700">مدير</div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;