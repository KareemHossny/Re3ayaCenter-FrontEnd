import React, { useState, useEffect } from 'react';
import { patientAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line
  }, [filter]);

  const fetchAppointments = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await patientAPI.getAppointments(params);
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    const reason = prompt('يرجى كتابة سبب الإلغاء:');
    if (!reason) return;

    setCancelling(appointmentId);
    try {
      await patientAPI.cancelAppointment(appointmentId, reason);
      alert('تم إلغاء الموعد بنجاح');
      fetchAppointments();
    } catch (error) {
      alert(error.response?.data?.message || 'فشل في إلغاء الموعد');
    } finally {
      setCancelling(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'scheduled':
        return 'مجدول';
      case 'completed':
        return 'مكتمل';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
      {/* فلتر الحالة */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'جميع المواعيد' },
            { value: 'scheduled', label: 'المجدولة' },
            { value: 'completed', label: 'المكتملة' },
            { value: 'cancelled', label: 'الملغاة' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-3 py-2 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                filter === option.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* قائمة المواعيد */}
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div key={appointment._id} className="card">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:justify-between">
              {/* معلومات الموعد */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                      د. {appointment.doctor?.name}
                    </h3>
                    <p className="text-primary-600 text-xs sm:text-sm truncate">
                      {appointment.specialization?.name}
                    </p>
                  </div>
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${getStatusColor(appointment.status)}`}>
                    {getStatusText(appointment.status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 text-xs sm:text-sm text-gray-600">
                  <div>
                    <span className="font-medium">التاريخ:</span>{' '}
                    {formatDate(appointment.date)}
                  </div>
                  <div>
                    <span className="font-medium">الوقت:</span> {appointment.time}
                  </div>
                  {appointment.notes && (
                    <div className="sm:col-span-2">
                      <span className="font-medium">ملاحظاتك:</span> {appointment.notes}
                    </div>
                  )}
                  {appointment.cancellationReason && (
                    <div className="sm:col-span-2">
                      <span className="font-medium">سبب الإلغاء:</span>{' '}
                      {appointment.cancellationReason}
                    </div>
                  )}
                </div>

                {/* عرض الروشتة إذا كانت موجودة */}
                {appointment.status === 'completed' && appointment.prescription && (
                  <div className="mt-4 p-2 sm:p-3 bg-green-50 border border-green-200 rounded-lg overflow-x-auto">
                    <h4 className="font-semibold text-green-900 mb-2 text-xs sm:text-base">الروشتة الطبية من د. {appointment.doctor?.name}:</h4>
                    <p className="text-green-800 whitespace-pre-wrap break-words text-xs sm:text-sm">{appointment.prescription}</p>
                    {appointment.notes && (
                      <div className="mt-2">
                        <h5 className="font-medium text-green-900 mb-1 text-xs sm:text-sm">ملاحظات الطبيب:</h5>
                        <p className="text-green-700 text-xs sm:text-sm">{appointment.notes}</p>
                      </div>
                    )}
                    {appointment.completedAt && (
                      <p className="text-xs text-green-600 mt-2">
                        تمت الزيارة في: {new Date(appointment.completedAt).toLocaleString('ar-EG')}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* أزرار الإجراءات */}
              {appointment.status === 'scheduled' && (
                <div className="flex items-center justify-end mt-2 sm:mt-4 lg:mt-0 lg:mr-4">
                  <button
                    onClick={() => handleCancelAppointment(appointment._id)}
                    disabled={cancelling === appointment._id}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 w-full sm:w-auto"
                  >
                    {cancelling === appointment._id ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      'إلغاء الموعد'
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {appointments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl sm:text-6xl mb-4">📅</div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
            لا توجد مواعيد
          </h3>
          <p className="text-xs sm:text-sm text-gray-600">
            {filter === 'all' 
              ? 'لم تقم بحجز أي مواعيد بعد.'
              : `لا توجد مواعيد ${getStatusText(filter)}.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;