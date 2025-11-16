import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import UserManagement from './UserManagement';
import SpecializationManagement from './SpecializationManagement';
import AdminStats from './AdminStats';
import { ChartBarIcon, UserGroupIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const { user } = useAuth();

  const tabs = [
    { id: 'stats', name: 'الإحصائيات', icon: ChartBarIcon },
    { id: 'users', name: 'إدارة المستخدمين', icon: UserGroupIcon },
    { id: 'specializations', name: 'إدارة التخصصات', icon: BuildingOfficeIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* الهيدر */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center py-6 gap-4 md:gap-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                لوحة تحكم المدير
              </h1>
              <p className="text-gray-600 mt-1 text-base sm:text-lg">
                مرحباً بك، {user?.name}
              </p>
            </div>
            <div className="text-right md:text-left">
              <p className="text-xs sm:text-sm text-gray-600">دور: مدير النظام</p>
            </div>
          </div>

          {/* التبويبات */}
          <div className="flex flex-wrap justify-center md:justify-start space-x-reverse rtl:space-x-reverse gap-2 sm:gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 sm:px-4 py-2 text-sm font-medium rounded-t-lg transition-colors focus:outline-none
                  ${activeTab === tab.id
                    ? 'bg-white text-primary-600 border-t-2 border-primary-600 shadow'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
                `}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                {React.createElement(tab.icon, { className: "w-5 h-5 ml-2" })}
                <span className="truncate">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* المحتوى */}
      <div className="max-w-7xl mx-auto py-4 px-2 sm:py-6 sm:px-6 lg:px-8">
        <div className="px-0 sm:px-4 py-4 sm:py-6">
          <div className="rounded-xl bg-white shadow-sm p-3 sm:p-6 min-h-[350px]">
            {activeTab === 'stats' && <AdminStats />}
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'specializations' && <SpecializationManagement />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;