import React, { useState, useEffect } from 'react';
import { doctorAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import {
  ClipboardDocumentIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const DoctorStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line
  }, []);

  const fetchStats = async () => {
    try {
      const response = await doctorAPI.getStats();
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
      icon: ClipboardDocumentIcon
    },
    {
      title: 'مواعيد اليوم',
      value: stats.todayAppointments,
      color: 'bg-green-500',
      icon: CalendarIcon
    },
    {
      title: 'مواعيد مجدولة',
      value: stats.scheduledAppointments,
      color: 'bg-purple-500',
      icon: ClockIcon
    },
    {
      title: 'مواعيد مكتملة',
      value: stats.completedAppointments,
      color: 'bg-teal-500',
      icon: CheckCircleIcon
    },
    {
      title: 'مواعيد ملغاة',
      value: stats.cancelledAppointments,
      color: 'bg-red-500',
      icon: XCircleIcon
    }
  ];

  return (
    <div className="px-2 sm:px-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center sm:text-right">إحصائيات العيادة</h2>
      
      {/* Cards grid - improves stacking and spacing for mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-8">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className="card flex flex-col items-center text-center p-4 sm:p-6 bg-white rounded-lg shadow"
            >
              <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center text-white mb-3`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
        {/* Doctor Tips */}
        <div className="card p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">نصائح للطبيب</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-2 flex-row-reverse">
              <span className="text-green-500 mt-1">✓</span>
              <p>حافظ على تحديث مواعيدك المتاحة بانتظام</p>
            </div>
            <div className="flex items-start gap-2 flex-row-reverse">
              <span className="text-green-500 mt-1">✓</span>
              <p>أبلغ المرضى بأي تغيير في المواعيد مسبقاً</p>
            </div>
            <div className="flex items-start gap-2 flex-row-reverse">
              <span className="text-green-500 mt-1">✓</span>
              <p>راجع مواعيد اليوم في الصباح للاستعداد</p>
            </div>
            <div className="flex items-start gap-2 flex-row-reverse">
              <span className="text-green-500 mt-1">✓</span>
              <p>استخدم خاصية الإلغاء في الحالات الطارئة فقط</p>
            </div>
          </div>
        </div>

        {/* Quick Stats - Responsive */}
        <div className="card p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">إحصائيات سريعة</h3>
          <div className="space-y-4">
            <div>
              <div className="flex flex-col xs:flex-row xs:justify-between text-sm mb-1 gap-1 xs:gap-0">
                <span className="text-gray-600">نسبة الحضور</span>
                <span className="font-medium text-gray-900">
                  {stats.totalAppointments > 0 
                    ? Math.round(((stats.totalAppointments - stats.cancelledAppointments) / stats.totalAppointments) * 100)
                    : 0
                  }%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ 
                    width: `${stats.totalAppointments > 0 
                      ? Math.round(((stats.totalAppointments - stats.cancelledAppointments) / stats.totalAppointments) * 100)
                      : 0
                    }%` 
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex flex-col xs:flex-row xs:justify-between text-sm mb-1 gap-1 xs:gap-0">
                <span className="text-gray-600">معدل الإلغاء</span>
                <span className="font-medium text-gray-900">
                  {stats.totalAppointments > 0 
                    ? Math.round((stats.cancelledAppointments / stats.totalAppointments) * 100)
                    : 0
                  }%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ 
                    width: `${stats.totalAppointments > 0 
                      ? Math.round((stats.cancelledAppointments / stats.totalAppointments) * 100)
                      : 0
                    }%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorStats;