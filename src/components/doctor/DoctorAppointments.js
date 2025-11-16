import React, { useState, useEffect } from 'react';
import { doctorAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import CompleteAppointment from './CompleteAppointment';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('today');
  const [cancelling, setCancelling] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showCompleteForm, setShowCompleteForm] = useState(false);

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line
  }, [filter, selectedDate]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter === 'today') {
        params.date = new Date().toISOString().split('T')[0];
      } else if (selectedDate) {
        params.date = selectedDate;
      }
      if (filter === 'upcoming') {
        params.status = 'scheduled';
      }
      const response = await doctorAPI.getAppointments(params);
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
      await doctorAPI.cancelAppointment(appointmentId, reason);
      alert('تم إلغاء الموعد بنجاح');
      fetchAppointments();
    } catch (error) {
      alert(error.response?.data?.message || 'فشل في إلغاء الموعد');
    } finally {
      setCancelling(null);
    }
  };

  const handleCompleteAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCompleteForm(true);
  };

  const handleCompletionSuccess = () => {
    setShowCompleteForm(false);
    setSelectedAppointment(null);
    fetchAppointments();
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

  const isPastAppointment = (appointmentDate, appointmentTime) => {
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    return appointmentDateTime < new Date();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="px-2 py-2 sm:px-4 sm:py-4 md:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
        <h2 className="text-2xl font-bold text-gray-900 text-center sm:text-right">مواعيد المرضى</h2>
      </div>

      {/* الفلتر والتاريخ */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Filter buttons - wrapped horizontally for small screens */}
          <div className="flex flex-col xs:flex-row xs:flex-wrap gap-2 flex-1 w-full">
            {[
              { value: 'today', label: 'مواعيد اليوم' },
              { value: 'upcoming', label: 'القادمة' },
              { value: 'all', label: 'جميع المواعيد' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setFilter(option.value);
                  setSelectedDate('');
                }}
                className={`w-full xs:w-auto px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === option.value && !selectedDate
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Responsive date input */}
          <div className="w-full xs:w-auto sm:w-48">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setFilter('all');
              }}
              className="form-input w-full"
            />
          </div>
        </div>
      </div>

      {/* قائمة المواعيد */}
      <div className="flex flex-col gap-4">
        {appointments.map((appointment) => (
          <div key={appointment._id} className="card p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
              {/* Appointment details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {appointment.patient?.name}
                    </h3>
                    <p className="text-primary-600 truncate">
                      {appointment.specialization?.name}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 space-x-reverse mt-2 sm:mt-0">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                      {getStatusText(appointment.status)}
                    </span>
                    {isPastAppointment(appointment.date, appointment.time) && appointment.status === 'scheduled' && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                        منتهي
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 w-full">
                  <div>
                    <span className="font-medium">التاريخ:</span>{' '}
                    {formatDate(appointment.date)}
                  </div>
                  <div>
                    <span className="font-medium">الوقت:</span> {appointment.time}
                  </div>
                  <div>
                    <span className="font-medium">البريد الإلكتروني:</span>{' '}
                    <span className="break-all">{appointment.patient?.email}</span>
                  </div>
                  <div>
                    <span className="font-medium">الهاتف:</span>{' '}
                    {appointment.patient?.phone || 'غير متوفر'}
                  </div>
                  {appointment.notes && (
                    <div className="md:col-span-2">
                      <span className="font-medium">ملاحظات المريض:</span>{' '}
                      {appointment.notes}
                    </div>
                  )}
                  {appointment.cancellationReason && (
                    <div className="md:col-span-2">
                      <span className="font-medium">سبب الإلغاء:</span>{' '}
                      {appointment.cancellationReason}
                    </div>
                  )}
                </div>

                {/* Prescription (if any) */}
                {appointment.status === 'completed' && appointment.prescription && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg overflow-x-auto">
                    <h4 className="font-semibold text-green-900 mb-2">الروشتة الطبية:</h4>
                    <p className="text-green-800 whitespace-pre-wrap break-all">{appointment.prescription}</p>
                    {appointment.notes && (
                      <div className="mt-2">
                        <h5 className="font-medium text-green-900 mb-1">ملاحظات إضافية:</h5>
                        <p className="text-green-700">{appointment.notes}</p>
                      </div>
                    )}
                    {appointment.completedAt && (
                      <p className="text-xs text-green-600 mt-2">
                        تم الإكمال في: {new Date(appointment.completedAt).toLocaleString('ar-EG')}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Action buttons - stack vertically on small, row on large */}
              <div className="mt-4 lg:mt-0 lg:mr-4 flex flex-row lg:flex-col gap-2 w-full lg:w-auto">
                {appointment.status === 'scheduled' && !isPastAppointment(appointment.date, appointment.time) && (
                  <>
                    <button
                      onClick={() => handleCompleteAppointment(appointment)}
                      className="w-full lg:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      تمت الزيارة
                    </button>
                    <button
                      onClick={() => handleCancelAppointment(appointment._id)}
                      disabled={cancelling === appointment._id}
                      className="w-full lg:w-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      {cancelling === appointment._id ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        'إلغاء الموعد'
                      )}
                    </button>
                  </>
                )}

                {appointment.status === 'completed' && (
                  <button
                    onClick={() => handleCompleteAppointment(appointment)}
                    className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    عرض/تعديل الروشتة
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {appointments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            لا توجد مواعيد
          </h3>
          <p className="text-gray-600">
            {filter === 'today'
              ? 'لا توجد مواعيد لليوم.'
              : selectedDate
              ? `لا توجد مواعيد في التاريخ المحدد.`
              : 'لا توجد مواعيد لعرضها.'}
          </p>
        </div>
      )}

      {/* نافذة إكمال الموعد */}
      {showCompleteForm && selectedAppointment && (
        <CompleteAppointment
          appointment={selectedAppointment}
          onClose={() => {
            setShowCompleteForm(false);
            setSelectedAppointment(null);
          }}
          onSuccess={handleCompletionSuccess}
        />
      )}
    </div>
  );
};

export default DoctorAppointments;