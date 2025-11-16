import React, { useState, useEffect } from 'react';
import { patientAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const PatientStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line
  }, []);

  const fetchStats = async () => {
    try {
      const response = await patientAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
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

  const statCards = [
    {
      title: 'إجمالي المواعيد',
      value: stats.totalAppointments,
      color: 'bg-blue-500',
      icon: '📋'
    },
    {
      title: 'مواعيد قادمة',
      value: stats.upcomingAppointments,
      color: 'bg-green-500',
      icon: '⏳'
    },
    {
      title: 'مواعيد مجدولة',
      value: stats.scheduledAppointments,
      color: 'bg-purple-500',
      icon: '✅'
    },
    {
      title: 'مواعيد مكتملة',
      value: stats.completedAppointments,
      color: 'bg-teal-500',
      icon: '🎯'
    },
    {
      title: 'مواعيد ملغاة',
      value: stats.cancelledAppointments,
      color: 'bg-red-500',
      icon: '❌'
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-right">إحصائيات المواعيد</h2>

      {/* Responsive cards with smaller gaps and better col layout on breakpoints */}
      <div
        className="
          grid grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4 
          xl:grid-cols-5 
          gap-4 
          mb-8
        "
      >
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="
              card text-center flex flex-col items-center
              px-4 py-5
              shadow rounded-lg bg-white min-w-0
            "
            style={{ minWidth: 0 }}
          >
            <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center text-white text-2xl sm:text-xl mx-auto mb-3`}>
              {stat.icon}
            </div>
            <h3 className="text-2xl sm:text-xl font-bold text-gray-900 mb-1 truncate">
              {stat.value}
            </h3>
            <p className="text-gray-600 text-sm whitespace-nowrap truncate">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* نصائح للمريض: Improved responsiveness and padding */}
      <div className="card p-4 shadow rounded-lg bg-white">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-right">نصائح للمريض</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start gap-2 flex-row-reverse">
            <span className="text-green-500 mt-1">✓</span>
            <p className="flex-1 text-right">احرص على الحضور قبل موعدك بـ 15 دقيقة</p>
          </div>
          <div className="flex items-start gap-2 flex-row-reverse">
            <span className="text-green-500 mt-1">✓</span>
            <p className="flex-1 text-right">يمكنك إلغاء الموعد قبل 24 ساعة على الأقل</p>
          </div>
          <div className="flex items-start gap-2 flex-row-reverse">
            <span className="text-green-500 mt-1">✓</span>
            <p className="flex-1 text-right">احتفظ بسجل مواعيدك لمتابعة حالتك الصحية</p>
          </div>
          <div className="flex items-start gap-2 flex-row-reverse">
            <span className="text-green-500 mt-1">✓</span>
            <p className="flex-1 text-right">استخدم خاصية البحث للعثور على التخصص المناسب</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientStats;