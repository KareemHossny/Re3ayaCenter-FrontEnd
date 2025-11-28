import React, { useState, useEffect } from 'react';
import { doctorAPI } from '../../services/api';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const DoctorAvailability = () => {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const days = [
    { id: 'sunday', name: t('sunday') },
    { id: 'monday', name: t('monday') },
    { id: 'tuesday', name: t('tuesday') },
    { id: 'wednesday', name: t('wednesday') },
    { id: 'thursday', name: t('thursday') },
    { id: 'friday', name: t('friday') },
    { id: 'saturday', name: t('saturday') },
  ];

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  ];

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const response = await doctorAPI.getAvailability();
      setAvailability(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast.error(t('error_loading_availability'));
      setAvailability([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (dayId) => {
    setAvailability(prev => {
      const existingDay = prev.find(item => item.day === dayId);
      if (existingDay) {
        return prev.filter(item => item.day !== dayId);
      } else {
        return [...prev, { day: dayId, slots: [] }];
      }
    });
  };

  const toggleTimeSlot = (dayId, timeSlot) => {
    setAvailability(prev => prev.map(day => {
      if (day.day === dayId) {
        const slotExists = day.slots.includes(timeSlot);
        return {
          ...day,
          slots: slotExists
            ? day.slots.filter(slot => slot !== timeSlot)
            : [...day.slots, timeSlot].sort()
        };
      }
      return day;
    }));
  };

  const handleSaveAvailability = async () => {
    if (availability.length === 0) {
      toast.error(t('choose_at_least_one_day'));
      return;
    }

    const daysWithoutSlots = availability.filter(day => 
      !day.slots || day.slots.length === 0
    );

    if (daysWithoutSlots.length > 0) {
      toast.error(t('choose_times_for_days'));
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const response = await doctorAPI.updateAvailability(availability);
      toast.success(t('success_saved'));
      setAvailability(response.data.availability || []);
    } catch (error) {
      console.error('Error saving availability:', error);
      toast.error(error.response?.data?.message || t('error_saving_availability'));
    } finally {
      setSaving(false);
    }
  };

  const getDayAvailability = (dayId) => {
    return availability.find(item => item.day === dayId);
  };

  const isDayActive = (dayId) => {
    return !!getDayAvailability(dayId);
  };

  const isTimeSlotSelected = (dayId, timeSlot) => {
    const day = getDayAvailability(dayId);
    return day ? day.slots.includes(timeSlot) : false;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3 ${isRTL ? 'text-right' : 'text-left'}`}>
        <h2 className="text-2xl font-bold text-gray-900">{t('availability')}</h2>
      </div>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.includes('نجاح') 
            ? 'bg-green-100 text-green-700 border border-green-200' 
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <div className="card">
        <div className="mb-6">
          <h3 className={`text-lg font-semibold text-gray-900 mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('set_available_times')}
          </h3>
          <p className={`text-gray-600 text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('available_times_description')}
          </p>
        </div>

        {/* الأيام */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-8">
          {days.map(day => {
            const isActive = isDayActive(day.id);
            const dayData = getDayAvailability(day.id);
            const slotsCount = dayData ? dayData.slots.length : 0;

            return (
              <button
                key={day.id}
                type="button"
                onClick={() => toggleDay(day.id)}
                className={`p-3 xs:p-4 rounded-lg border-2 text-center transition-colors text-sm sm:text-base ${
                  isActive
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
                style={{ minWidth: 0, wordBreak: "break-word" }}
              >
                <div className="font-medium">{day.name}</div>
                {isActive && (
                  <div className="text-xs text-primary-600 mt-1">
                    {slotsCount} {t('slots_count')}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* الأوقات لكل يوم */}
        <div className="space-y-8">
          {days.map(day => {
            if (!isDayActive(day.id)) return null;

            return (
              <div key={day.id} className="border rounded-lg p-3 sm:p-6">
                <div className={`flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {t('times_for')} {day.name}
                  </h4>
                  <button
                    onClick={() => toggleDay(day.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium self-end sm:self-auto"
                  >
                    {t('remove_day')}
                  </button>
                </div>
                
                <div
                  className="
                    grid
                    grid-cols-3
                    xs:grid-cols-4
                    sm:grid-cols-6
                    md:grid-cols-8
                    gap-2
                  "
                >
                  {timeSlots.map(timeSlot => {
                    const isSelected = isTimeSlotSelected(day.id, timeSlot);
                    
                    return (
                      <button
                        key={timeSlot}
                        type="button"
                        onClick={() => toggleTimeSlot(day.id, timeSlot)}
                        className={`p-1 xs:p-2 text-xs sm:text-sm rounded border transition-colors ${
                          isSelected
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500'
                        }`}
                        style={{ minWidth: 0 }}
                      >
                        {timeSlot}
                      </button>
                    );
                  })}
                </div>

                {getDayAvailability(day.id) &&
                  getDayAvailability(day.id).slots.length === 0 && (
                  <p className="text-gray-500 text-sm mt-3 text-center">
                    {t('no_times_selected')}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {availability.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">⏰</div>
            <p className="text-gray-600 mb-4">
              {t('no_working_days')}
            </p>
            <p className="text-sm text-gray-500">
              {t('choose_days_then_times')}
            </p>
          </div>
        )}

        {/* زر الحفظ */}
        {availability.length > 0 && (
          <div className={`flex flex-col items-stretch sm:flex-row sm:justify-end pt-6 mt-6 border-t gap-3 ${isRTL ? 'sm:justify-start' : 'sm:justify-end'}`}>
            <button
              onClick={handleSaveAvailability}
              disabled={saving}
              className="btn-primary w-full sm:w-auto"
            >
              {saving ? <LoadingSpinner size="sm" /> : t('save_available_times')}
            </button>
          </div>
        )}
      </div>

      {/* نصائح */}
      <div className="card mt-6 bg-blue-50 border-blue-200">
        <h3 className={`text-lg font-semibold text-blue-900 mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>{t('important_tips')}</h3>
        <ul className={`text-blue-800 text-sm space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
          <li>• {t('choose_days_first')}</li>
          <li>• {t('choose_times_per_day')}</li>
          <li>• {t('remove_day_by_button')}</li>
          <li>• {t('save_changes_after_finish')}</li>
          <li>• {t('patients_see_only_selected')}</li>
        </ul>
      </div>
    </div>
  );
};

export default DoctorAvailability;