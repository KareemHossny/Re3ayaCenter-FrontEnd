import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import DoctorProfile from './DoctorProfile';
import DoctorAppointments from './DoctorAppointments';
import DoctorAvailability from './DoctorAvailability';
import DoctorStats from './DoctorStats';
import { CalendarIcon, ClockIcon, UserIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const { user } = useAuth();

  const tabs = [
    { id: 'appointments', name: 'المواعيد', icon: CalendarIcon },
    { id: 'availability', name: 'المواعيد المتاحة', icon: ClockIcon },
    { id: 'profile', name: 'الملف الشخصي', icon: UserIcon },
    { id: 'stats', name: 'الإحصائيات', icon: ChartBarIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* الهيدر */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center py-6 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                لوحة تحكم الطبيب
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                مرحباً بك، د. {user?.name}
                {user?.specialization && (
                  <span className="text-primary-600"> - {user.specialization.name}</span>
                )}
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-xs sm:text-sm text-gray-600">دور: طبيب</p>
            </div>
          </div>

          {/* التبويبات */}
          <div className="flex flex-wrap gap-2 md:gap-1 md:space-x-1 md:space-x-reverse mt-4 md:mt-0 overflow-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-primary-600 border-t-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {React.createElement(tab.icon, { className: "w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2" })}
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* المحتوى */}
      <div className="max-w-7xl mx-auto py-3 sm:py-6 px-2 sm:px-6 lg:px-8">
        <div className="px-0 md:px-4 py-4 sm:py-6">
          {activeTab === 'appointments' && <DoctorAppointments />}
          {activeTab === 'availability' && <DoctorAvailability />}
          {activeTab === 'profile' && <DoctorProfile />}
          {activeTab === 'stats' && <DoctorStats />}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;