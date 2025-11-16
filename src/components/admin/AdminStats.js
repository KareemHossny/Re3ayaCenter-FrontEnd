import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import {
  UserGroupIcon,
  UserIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[220px] py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">حدث خطأ في تحميل الإحصائيات</p>
      </div>
    );
  }

  const mainStats = [
    {
      title: 'إجمالي المرضى',
      value: stats.totalPatients,
      color: 'from-cyan-500 to-blue-500',
      icon: UserGroupIcon,
      description: 'عدد المرضى المسجلين في النظام'
    },
    {
      title: 'إجمالي الأطباء',
      value: stats.totalDoctors,
      color: 'from-green-400 to-green-600',
      icon: UserIcon,
      description: 'عدد الأطباء المسجلين في النظام'
    },
    {
      title: 'إجمالي المواعيد',
      value: stats.totalAppointments,
      color: 'from-purple-400 to-purple-600',
      icon: CalendarIcon,
      description: 'عدد المواعيد الكلي'
    },
    {
      title: 'إجمالي التخصصات',
      value: stats.totalSpecializations,
      color: 'from-orange-400 to-orange-600',
      icon: BuildingOfficeIcon,
      description: 'عدد التخصصات الطبية'
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-primary-900 mb-7 tracking-tight">نظرة عامة على النظام</h2>
      
      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-8 mb-8">
        {mainStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className="transition-all group bg-gradient-to-tr from-primary-50 to-white shadow-lg hover:shadow-xl rounded-2xl p-5 md:p-6 flex flex-col gap-3 h-full justify-between"
            >
              <div className="flex items-center gap-3 sm:gap-1 justify-between flex-row-reverse">
                <div
                  className={`
                    flex-shrink-0 w-16 h-16 bg-gradient-to-br ${stat.color}
                    shadow-xl rounded-2xl flex items-center justify-center relative group-hover:scale-105 transition
                  `}
                >
                  <IconComponent className="w-8 h-8 text-white drop-shadow" />
                </div>
                <div className="flex-1 text-left pr-2">
                  <p className="text-sm md:text-base text-gray-600 font-medium mb-1">{stat.title}</p>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1 tabular-nums">
                    {stat.value}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 font-light">{stat.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* المواعيد الأخيرة وإجراءات سريعة */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 md:gap-8">
        {/* آخر المواعيد */}
        <div className="xl:col-span-2 order-2 xl:order-1">
          <div className="bg-white rounded-2xl shadow-lg p-5 md:p-7 h-full flex flex-col">
            <h3 className="text-lg md:text-xl font-semibold text-primary-900 mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary-500 ml-1" /> آخر المواعيد
            </h3>
            <div className="flex-1 overflow-auto">
              <div className="space-y-4">
                {stats.recentAppointments && stats.recentAppointments.length > 0 ? (
                  stats.recentAppointments.map((appointment) => (
                    <div
                      key={appointment._id}
                      className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 p-3 border border-gray-100 hover:border-primary-200 rounded-xl transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 bg-gradient-to-tr from-primary-100 to-primary-50 rounded-full flex items-center justify-center shadow">
                          <UserIcon className="w-6 h-6 text-primary-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">
                            {appointment.patient?.name}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            مع د. {appointment.doctor?.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right md:text-left">
                        <p className="text-sm font-bold text-primary-700 tabular-nums">
                          {new Date(appointment.date).toLocaleDateString('ar-EG')}
                        </p>
                        <p className="text-xs text-gray-500">{appointment.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="flex justify-center mb-3">
                      <CalendarIcon className="w-10 h-10 text-gray-300" />
                    </div>
                    <p className="text-gray-400">لا توجد مواعيد حديثة</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* الشريط الجانبي (إجراءات سريعة ومعلومات النظام) */}
        <div className="order-1 xl:order-2 flex flex-col gap-5">
          <div className="bg-white rounded-2xl shadow-lg p-5 md:p-7">
            <h3 className="text-lg md:text-xl font-semibold text-primary-800 mb-4">إجراءات سريعة</h3>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => window.location.hash = '#users'}
                className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg bg-gradient-to-r from-white to-primary-50 hover:from-primary-50 hover:to-primary-100 transition group"
              >
                <span className="text-gray-800 font-medium group-hover:text-primary-600 transition">إدارة المستخدمين</span>
                <UserGroupIcon className="w-6 h-6 text-gray-500 group-hover:text-primary-600 transition" />
              </button>
              
              <button 
                onClick={() => window.location.hash = '#specializations'}
                className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg bg-gradient-to-r from-white to-green-50 hover:from-green-50 hover:to-green-100 transition group"
              >
                <span className="text-gray-800 font-medium group-hover:text-green-700 transition">إدارة التخصصات</span>
                <BuildingOfficeIcon className="w-6 h-6 text-gray-500 group-hover:text-green-700 transition" />
              </button>
              
              <button
                className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg bg-gradient-to-r from-white to-orange-50 hover:from-orange-50 hover:to-orange-100 transition group"
              >
                <span className="text-gray-800 font-medium group-hover:text-orange-600 transition">تقارير النظام</span>
                <ChartBarIcon className="w-6 h-6 text-gray-500 group-hover:text-orange-600 transition" />
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-tr from-primary-50 to-white border border-primary-100 rounded-2xl shadow p-5 md:p-6 mt-2">
            <h3 className="text-lg font-semibold text-primary-900 mb-3 flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5 text-primary-500 ml-1" />معلومات النظام
            </h3>
            <div className="space-y-2 text-sm text-primary-900 font-medium">
              <div className="flex justify-between">
                <span>الإصدار:</span>
                <span className="font-bold">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>الحالة:</span>
                <span className="font-bold text-green-600">نشط</span>
              </div>
              <div className="flex justify-between">
                <span>آخر تحديث:</span>
                <span className="font-bold">{new Date().toLocaleDateString('ar-EG')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;