import React, { useState, useEffect } from 'react';
import { doctorAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const DoctorAvailability = () => {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const days = [
    { id: 'sunday', name: 'الأحد' },
    { id: 'monday', name: 'الإثنين' },
    { id: 'tuesday', name: 'الثلاثاء' },
    { id: 'wednesday', name: 'الأربعاء' },
    { id: 'thursday', name: 'الخميس' },
    { id: 'friday', name: 'الجمعة' },
    { id: 'saturday', name: 'السبت' },
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
      setMessage('يرجى اختيار يوم واحد على الأقل');
      return;
    }

    const daysWithoutSlots = availability.filter(day => 
      !day.slots || day.slots.length === 0
    );

    if (daysWithoutSlots.length > 0) {
      setMessage('يرجى اختيار مواعيد للأيام المحددة');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const response = await doctorAPI.updateAvailability(availability);
      setMessage('تم حفظ المواعيد المتاحة بنجاح');
      setAvailability(response.data.availability || []);
    } catch (error) {
      console.error('Error saving availability:', error);
      setMessage(error.response?.data?.message || 'فشل في حفظ المواعيد المتاحة');
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
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
        <h2 className="text-2xl font-bold text-gray-900">المواعيد المتاحة</h2>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            تعيين الأيام والأوقات المتاحة
          </h3>
          <p className="text-gray-600 text-sm">
            اختر الأيام والأوقات التي تكون متاحاً فيها لاستقبال المرضى
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
                    {slotsCount} موعد
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
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    أوقات {day.name}
                  </h4>
                  <button
                    onClick={() => toggleDay(day.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium self-end sm:self-auto"
                  >
                    إزالة اليوم
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
                    لم يتم اختيار أي أوقات لهذا اليوم
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
              لم يتم اختيار أي أيام عمل بعد
            </p>
            <p className="text-sm text-gray-500">
              اختر الأيام من الأعلى ثم حدد الأوقات المتاحة
            </p>
          </div>
        )}

        {/* زر الحفظ */}
        {availability.length > 0 && (
          <div className="flex flex-col items-stretch sm:flex-row sm:justify-end pt-6 mt-6 border-t gap-3">
            <button
              onClick={handleSaveAvailability}
              disabled={saving}
              className="btn-primary w-full sm:w-auto"
            >
              {saving ? <LoadingSpinner size="sm" /> : 'حفظ المواعيد المتاحة'}
            </button>
          </div>
        )}
      </div>

      {/* نصائح */}
      <div className="card mt-6 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">نصائح مهمة</h3>
        <ul className="text-blue-800 text-sm space-y-2">
          <li>• اختر الأيام أولاً من بين الأيام بالأعلى</li>
          <li>• لكل يوم، اختر الأوقات المتاحة من القائمة</li>
          <li>• يمكنك إزالة يوم بالضغط على "إزالة اليوم"</li>
          <li>• يجب حفظ التغييرات بعد الانتهاء</li>
          <li>• المرضى سيشاهدون فقط الأوقات المحددة</li>
        </ul>
      </div>
    </div>
  );
};

export default DoctorAvailability;