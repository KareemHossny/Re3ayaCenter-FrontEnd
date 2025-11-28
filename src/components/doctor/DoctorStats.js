import React, { useState, useEffect } from 'react';
import { doctorAPI } from '../../services/api';
import { useTranslation } from 'react-i18next';
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
  
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

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
        <p className="text-gray-600">{t('error_loading_data')}</p>
      </div>
    );
  }

  const statCards = [
    {
      title: t('total_appointments'),
      value: stats.totalAppointments,
      color: 'bg-blue-500',
      icon: ClipboardDocumentIcon
    },
    {
      title: t('today_appointments_stat'),
      value: stats.todayAppointments,
      color: 'bg-green-500',
      icon: CalendarIcon
    },
    {
      title: t('scheduled_appointments'),
      value: stats.scheduledAppointments,
      color: 'bg-purple-500',
      icon: ClockIcon
    },
    {
      title: t('completed_appointments'),
      value: stats.completedAppointments,
      color: 'bg-teal-500',
      icon: CheckCircleIcon
    },
    {
      title: t('cancelled_appointments'),
      value: stats.cancelledAppointments,
      color: 'bg-red-500',
      icon: XCircleIcon
    }
  ];

  return (
    <div className="px-2 sm:px-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <h2 className={`text-2xl font-bold text-gray-900 mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        {t('clinic_statistics')}
      </h2>
      
      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-8">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className="card flex flex-col items-center text-center p-4 sm:p-6 bg-white rounded-lg shadow transition-all duration-300"
            >
              <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center text-white mb-3`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600 text-sm min-h-[40px] flex items-center justify-center">
                {stat.title}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
        {/* Doctor Tips */}
        <div className="card p-4 sm:p-6">
          <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('doctor_tips')}
          </h3>
          <div className={`space-y-3 text-sm text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <span className="text-green-500 mt-1 flex-shrink-0">✓</span>
              <p className="flex-1">{t('update_availability_regularly')}</p>
            </div>
            <div className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <span className="text-green-500 mt-1 flex-shrink-0">✓</span>
              <p className="flex-1">{t('inform_patients_changes')}</p>
            </div>
            <div className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <span className="text-green-500 mt-1 flex-shrink-0">✓</span>
              <p className="flex-1">{t('review_today_morning')}</p>
            </div>
            <div className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <span className="text-green-500 mt-1 flex-shrink-0">✓</span>
              <p className="flex-1">{t('use_cancel_emergency_only')}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card p-4 sm:p-6">
          <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('quick_stats')}
          </h3>
          <div className="space-y-4">
            <div>
              <div className={`flex justify-between items-center text-sm mb-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <span className="text-gray-600">{t('attendance_rate')}</span>
                <span className="font-medium text-gray-900">
                  {stats.totalAppointments > 0 
                    ? Math.round(((stats.totalAppointments - stats.cancelledAppointments) / stats.totalAppointments) * 100)
                    : 0
                  }%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500" 
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
              <div className={`flex justify-between items-center text-sm mb-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <span className="text-gray-600">{t('cancellation_rate')}</span>
                <span className="font-medium text-gray-900">
                  {stats.totalAppointments > 0 
                    ? Math.round((stats.cancelledAppointments / stats.totalAppointments) * 100)
                    : 0
                  }%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-500" 
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