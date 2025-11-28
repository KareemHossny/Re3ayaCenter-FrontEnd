import React, { useState, useEffect } from 'react';
import { patientAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { useTranslation } from 'react-i18next';

const PatientStats = () => {
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
      <div className={`flex justify-center items-center py-12 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <LoadingSpinner size="lg" />
        <span className={isRTL ? 'mr-2' : 'ml-2'}>{t('loading')}</span>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={`text-center py-12 ${isRTL ? 'text-right' : 'text-left'}`}>
        <p className="text-gray-600">{t('error_loading_stats')}</p>
      </div>
    );
  }

  const statCards = [
    {
      title: t('total_appointments_stat'),
      value: stats.totalAppointments,
      color: 'bg-blue-500',
      icon: '📋'
    },
    {
      title: t('upcoming_appointments'),
      value: stats.upcomingAppointments,
      color: 'bg-green-500',
      icon: '⏳'
    },
    {
      title: t('scheduled_appointments'),
      value: stats.scheduledAppointments,
      color: 'bg-purple-500',
      icon: '✅'
    },
    {
      title: t('completed_appointments'),
      value: stats.completedAppointments,
      color: 'bg-teal-500',
      icon: '🎯'
    },
    {
      title: t('cancelled_appointments'),
      value: stats.cancelledAppointments,
      color: 'bg-red-500',
      icon: '❌'
    }
  ];

  return (
    <div className="rtl-support">
      <h2 className={`text-2xl font-bold text-gray-900 mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        {t('appointment_statistics')}
      </h2>

      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="card text-center flex flex-col items-center px-4 py-5 shadow rounded-lg bg-white min-w-0"
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

      {/* نصائح للمريض */}
      <div className="card p-4 shadow rounded-lg bg-white">
        <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('patient_tips')}
        </h3>
        <div className="space-y-3 text-sm text-gray-600">
          {[
            t('arrive_15_minutes_early'),
            t('cancel_24_hours_before'),
            t('keep_appointment_records'),
            t('use_search_feature')
          ].map((tip, index) => (
            <div key={index} className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
              <span className="text-green-500 mt-1">✓</span>
              <p className="flex-1">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientStats;