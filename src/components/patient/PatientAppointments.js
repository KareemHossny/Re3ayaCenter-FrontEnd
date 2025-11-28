import React, { useState, useEffect } from 'react';
import { patientAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const PatientAppointments = () => {
  const { t, i18n } = useTranslation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cancelling, setCancelling] = useState(null);
  const [showPrescription, setShowPrescription] = useState(null);

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line
  }, [filter]);

  const fetchAppointments = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await patientAPI.getAppointments(params);
      let data = response.data;

      // Defensive: normalize to array
      if (Array.isArray(data)) {
        setAppointments(data);
      } else if (data && Array.isArray(data.appointments)) {
        setAppointments(data.appointments);
      } else if (data == null) {
        setAppointments([]);
      } else if (typeof data === 'object') {
        // Try to find array property in data
        const arr = Object.values(data).find(v => Array.isArray(v));
        setAppointments(arr || []);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error(t('error_loading_appointments'));
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    const reason = prompt(t('cancellation_reason_prompt'));
    if (!reason) return;

    setCancelling(appointmentId);
    try {
      await patientAPI.cancelAppointment(appointmentId, reason);
      toast.success(t('cancellation_success'));
      fetchAppointments();
    } catch (error) {
      toast.error(error?.response?.data?.message || t('cancellation_failed'));
    } finally {
      setCancelling(null);
    }
  };

  const handleShowPrescription = (appointment) => {
    setShowPrescription(appointment);
  };

  const parsePrescription = (prescriptionText) => {
    if (!prescriptionText) return {};
    
    const lines = prescriptionText.split('\n');
    const parsed = {
      diagnosis: '',
      medications: [],
      notes: '',
      followUpDate: ''
    };

    let currentSection = '';
    const isArabic = i18n.language === 'ar';
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      const diagnosisPrefix = isArabic ? 'التشخيص:' : 'Diagnosis:';
      const medicationsPrefix = isArabic ? 'الأدوية الموصوفة:' : 'Prescribed Medications:';
      const notesPrefix = isArabic ? 'ملاحظات إضافية:' : 'Additional Notes:';
      const followUpPrefix = isArabic ? 'موعد المتابعة:' : 'Follow-up Date:';
      
      if (trimmedLine.startsWith(diagnosisPrefix)) {
        currentSection = 'diagnosis';
        parsed.diagnosis = trimmedLine.replace(diagnosisPrefix, '').trim();
      } else if (trimmedLine.startsWith(medicationsPrefix)) {
        currentSection = 'medications';
      } else if (trimmedLine.startsWith(notesPrefix)) {
        currentSection = 'notes';
        parsed.notes = trimmedLine.replace(notesPrefix, '').trim();
      } else if (trimmedLine.startsWith(followUpPrefix)) {
        currentSection = 'followUpDate';
        parsed.followUpDate = trimmedLine.replace(followUpPrefix, '').trim();
      } else if (trimmedLine.match(/^\d+\./)) {
        // دواء برقم (مثل: 1. باراسيتامول...)
        const medication = trimmedLine.replace(/^\d+\.\s*/, '').trim();
        if (medication) {
          parsed.medications.push(medication);
        }
      } else if (trimmedLine && currentSection === 'diagnosis' && !parsed.diagnosis) {
        parsed.diagnosis = trimmedLine;
      } else if (trimmedLine && currentSection === 'notes') {
        parsed.notes += (parsed.notes ? '\n' : '') + trimmedLine;
      } else if (trimmedLine && currentSection === 'medications' && !trimmedLine.startsWith(isArabic ? 'ملاحظات' : 'Notes')) {
        // أدوية بدون أرقام
        parsed.medications.push(trimmedLine);
      }
    });

    return parsed;
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
        return t('scheduled_appointments_filter');
      case 'completed':
        return t('completed_appointments_filter');
      case 'cancelled':
        return t('cancelled_appointments_filter');
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center py-12 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <LoadingSpinner size="lg" />
        <span className={isRTL ? 'mr-2' : 'ml-2'}>{t('loading_appointments')}</span>
      </div>
    );
  }

  // Always ensure appointments is an array for rendering
  const safeAppointments = Array.isArray(appointments) ? appointments : [];

  return (
    <div className="rtl-support">
      {/* فلتر الحالة */}
      <div className="card mb-6">
        <div className={`flex flex-wrap gap-2 ${isRTL ? 'justify-end' : 'justify-start'}`}>
          {[
            { value: 'all', label: t('all_appointments_filter') },
            { value: 'scheduled', label: t('scheduled_appointments_filter') },
            { value: 'completed', label: t('completed_appointments_filter') },
            { value: 'cancelled', label: t('cancelled_appointments_filter') },
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
        {safeAppointments.map((appointment) => (
          <div key={appointment._id} className="card hover:shadow-lg transition-shadow">
            <div className={`flex flex-col gap-4 lg:flex-row lg:items-stretch lg:justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              {/* معلومات الموعد */}
              <div className="flex-1 min-w-0">
                <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                      {i18n.language === 'ar' ? 'د.' : 'Dr.'} {appointment.doctor?.name}
                    </h3>
                    <p className="text-primary-600 text-xs sm:text-sm truncate">
                      {appointment.specialization?.name}
                    </p>
                  </div>
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${getStatusColor(appointment.status)}`}>
                    {getStatusText(appointment.status)}
                  </span>
                </div>

                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 text-xs sm:text-sm text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div>
                    <span className="font-medium">{t('visit_date')}:</span>{' '}
                    {formatDate(appointment.date)}
                  </div>
                  <div>
                    <span className="font-medium">{t('visit_time')}:</span> {appointment.time}
                  </div>
                  {appointment.notes && (
                    <div className="sm:col-span-2">
                      <span className="font-medium">{t('your_notes')}</span> {appointment.notes}
                    </div>
                  )}
                  {appointment.cancellationReason && (
                    <div className="sm:col-span-2">
                      <span className="font-medium">{t('cancellation_reason')}</span>{' '}
                      {appointment.cancellationReason}
                    </div>
                  )}
                </div>

                {/* زر عرض الروشتة للمواعيد المكتملة */}
                {appointment.status === 'completed' && appointment.prescription && (
                  <div className="mt-4">
                    <button
                      onClick={() => handleShowPrescription(appointment)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      {t('view_prescription')}
                    </button>
                  </div>
                )}
              </div>

              {/* أزرار الإجراءات */}
              {appointment.status === 'scheduled' && (
                <div className={`flex items-center justify-end mt-2 sm:mt-4 lg:mt-0 ${isRTL ? 'lg:ml-4' : 'lg:mr-4'}`}>
                  <button
                    onClick={() => handleCancelAppointment(appointment._id)}
                    disabled={cancelling === appointment._id}
                    className={`bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 w-full sm:w-auto flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    {cancelling === appointment._id ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span>{t('cancelling_appointment')}</span>
                      </>
                    ) : (
                      t('cancel_appointment_btn')
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* نافذة الروشتة */}
      {showPrescription && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPrescription(null);
            }
          }}
        >
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto rtl-support">
            {/* محتوى الروشتة */}
            <div className="p-6 mt-8">
              {(() => {
                const parsedPrescription = parsePrescription(showPrescription.prescription);
                
                return (
                  <div className="bg-white border-2 border-gray-300 rounded-lg p-6 font-sans">
                    {/* ترويسة الروشتة */}
                    <div className={`text-center mb-6 border-b-2 border-gray-400 pb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <h3 className="text-2xl font-bold text-blue-800">
                        {t('medical_prescription')}
                      </h3>
                      <p className="text-gray-600">Medical Prescription</p>
                    </div>
                    
                    {/* معلومات الكشف */}
                    <div className={`mb-6 text-center ${isRTL ? 'text-right' : 'text-left'}`}>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h4 className="font-semibold mb-3 text-green-800">{t('visit_information')}</h4>
                        <div className="space-y-2">
                          <p><strong>{t('doctor_name')}</strong> {showPrescription.doctor?.name}</p>
                          <p><strong>{t('specialization')}:</strong> {showPrescription.specialization?.name}</p>
                          <p><strong>{t('visit_date')}:</strong> {new Date(showPrescription.date).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US')}</p>
                          <p><strong>{t('visit_time')}:</strong> {showPrescription.time}</p>
                        </div>
                      </div>
                    </div>

                    {/* التشخيص */}
                    <div className="mb-6">
                      <h4 className={`font-semibold text-gray-700 mb-3 border-b border-gray-300 pb-2 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-red-500">🩺</span>
                        {t('diagnosis')}:
                      </h4>
                      <p className={`text-gray-800 bg-yellow-50 p-4 rounded border border-yellow-200 text-lg ${isRTL ? 'text-right' : 'text-left'}`}>
                        {parsedPrescription.diagnosis || t('no_diagnosis_specified')}
                      </p>
                    </div>

                    {/* الأدوية */}
                    {parsedPrescription.medications.length > 0 && (
                      <div className="mb-6">
                        <h4 className={`font-semibold text-gray-700 mb-3 border-b border-gray-300 pb-2 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-green-600">💊</span>
                          {t('prescribed_medications_list')}
                        </h4>
                        <div className="space-y-3">
                          {parsedPrescription.medications.map((medication, index) => (
                            <div key={index} className={`flex items-start gap-4 bg-white p-4 rounded border border-green-200 shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                                {index + 1}
                              </span>
                              <div className="flex-1">
                                <p className={`text-gray-800 text-lg leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>{medication}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* التعليمات */}
                    {parsedPrescription.notes && (
                      <div className="mb-6">
                        <h4 className={`font-semibold text-gray-700 mb-3 border-b border-gray-300 pb-2 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-blue-600">📝</span>
                          {t('instructions_guidelines')}
                        </h4>
                        <div className="bg-blue-50 p-4 rounded border border-blue-200">
                          <p className={`text-gray-800 whitespace-pre-wrap leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>{parsedPrescription.notes}</p>
                        </div>
                      </div>
                    )}

                    {/* موعد المتابعة */}
                    {parsedPrescription.followUpDate && (
                      <div className="mb-6">
                        <h4 className={`font-semibold text-gray-700 mb-3 border-b border-gray-300 pb-2 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-purple-600">📅</span>
                          {t('followup_consultation')}:
                        </h4>
                        <div className="bg-purple-50 p-4 rounded border border-purple-200">
                          <p className={`text-gray-800 text-lg font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{parsedPrescription.followUpDate}</p>
                          <p className={isRTL ? 'text-right' : 'text-left'}>{t('confirm_followup_booking')}</p>
                        </div>
                      </div>
                    )}

                    {/* توقيع الطبيب */}
                    <div className={`text-center mt-8 pt-6 border-t-2 border-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <div className="inline-block">
                        <div className="mb-2">
                          <p className="text-gray-700 font-bold text-lg">{t('doctor_name')} {showPrescription.doctor?.name}</p>
                        </div>
                        <div className="border-t-2 border-gray-600 pt-2 mt-2">
                          <p className="text-gray-700 font-semibold">{t('doctor_signature_prescription')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* زر الإغلاق */}
            <div className={`flex justify-end p-6 border-t bg-white sticky bottom-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button
                onClick={() => setShowPrescription(null)}
                className="btn-primary"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* لا توجد مواعيد */}
      {safeAppointments.length === 0 && (
        <div className={`text-center py-12 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className="text-5xl sm:text-6xl mb-4">📅</div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
            {t('no_appointments_message')}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600">
            {filter === 'all' 
              ? t('no_appointments_description')
              : t('no_filtered_appointments', { status: getStatusText(filter) })}
          </p>
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;