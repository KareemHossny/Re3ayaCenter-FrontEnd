import React, { useState, useEffect } from 'react';
import { patientAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const AppointmentBooking = ({ doctor, onClose, onSuccess }) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
    }
    // eslint-disable-next-line
  }, [selectedDate]);

  const fetchAvailableSlots = async () => {
    setLoading(true);
    try {
      const response = await patientAPI.getAvailableSlots(doctor._id, selectedDate);
      setAvailableSlots(response.data);
      setSelectedTime('');
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      alert('يرجى اختيار التاريخ والوقت');
      return;
    }

    setBooking(true);
    try {
      await patientAPI.bookAppointment({
        doctorId: doctor._id,
        specializationId: doctor.specialization?._id,
        date: selectedDate,
        time: selectedTime,
        notes: notes
      });

      alert('تم حجز الموعد بنجاح!');
      onSuccess();
    } catch (error) {
      alert(error.response?.data?.message || 'فشل في حجز الموعد');
    } finally {
      setBooking(false);
    }
  };

  // الحصول على تاريخ الغد لتحديد الحد الأدنى للتاريخ
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // الحصول على تاريخ بعد 30 يوم لتحديد الحد الأقصى للتاريخ
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center sm:p-4 p-1 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-lg
                      sm:max-w-md sm:rounded-2xl
                      xs:max-w-sm xs:rounded-xl
                      ">
        {/* الهيدر */}
        <div className="flex items-center justify-between sm:p-6 p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">حجز موعد</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* معلومات الطبيب */}
        <div className="sm:p-6 p-4 border-b">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
              {doctor.profileImage ? (
                <img
                  src={`http://localhost:5000/${doctor.profileImage}`}
                  alt={doctor.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <span className="text-xl">👨‍⚕️</span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{doctor.name}</h3>
              <p className="text-primary-600 text-sm sm:text-base">{doctor.specialization?.name}</p>
            </div>
          </div>
        </div>

        {/* نموذج الحجز */}
        <div className="sm:p-6 p-4 space-y-4">
          {/* اختيار التاريخ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اختر التاريخ
            </label>
            <input
              type="date"
              min={getTomorrowDate()}
              max={getMaxDate()}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="form-input w-full text-base px-2 py-2"
            />
          </div>

          {/* اختيار الوقت */}
          {selectedDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اختر الوقت
              </label>
              {loading ? (
                <div className="flex justify-center py-4">
                  <LoadingSpinner size="md" />
                </div>
              ) : availableSlots.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`p-2 sm:p-3 border rounded-lg text-xs sm:text-sm font-medium transition-colors break-words ${
                        selectedTime === slot
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4 text-sm sm:text-base">
                  لا توجد مواعيد متاحة في هذا التاريخ
                </p>
              )}
            </div>
          )}

          {/* ملاحظات */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ملاحظات (اختياري)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              className="form-input w-full text-base px-2 py-2"
              placeholder="أي ملاحظات تريد إضافتها..."
            />
          </div>
        </div>

        {/* الأزرار */}
        <div className="flex flex-col sm:flex-row gap-3 sm:p-6 p-4 border-t">
          <button
            onClick={onClose}
            className="btn-secondary flex-1 min-w-0"
            disabled={booking}
          >
            إلغاء
          </button>
          <button
            onClick={handleBookAppointment}
            disabled={!selectedTime || booking}
            className="btn-primary flex-1 min-w-0"
          >
            {booking ? <LoadingSpinner size="sm" /> : 'تأكيد الحجز'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;