import React, { useState, useEffect } from 'react';
import { doctorAPI } from '../../services/api';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const CompleteAppointment = ({ appointment, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    prescription: '',
    notes: '',
    diagnosis: '',
    followUpDate: '',
    medications: ['']
  });
  const [loading, setLoading] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('prescription');
  
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    if (appointment) {
      fetchAppointmentDetails();
      if (appointment.prescription) {
        setFormData({
          prescription: appointment.prescription || '',
          notes: appointment.notes || '',
          diagnosis: '',
          followUpDate: '',
          medications: ['']
        });
      }
    }
    // eslint-disable-next-line
  }, [appointment]);

  const fetchAppointmentDetails = async () => {
    try {
      const response = await doctorAPI.getAppointmentDetails(appointment._id);
      setAppointmentDetails(response.data);
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      toast.error(t('error_loading_data'));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMedicationChange = (index, value) => {
    const newMedications = [...formData.medications];
    newMedications[index] = value;
    setFormData(prev => ({
      ...prev,
      medications: newMedications
    }));
  };

  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      medications: [...prev.medications, '']
    }));
  };

  const removeMedication = (index) => {
    if (formData.medications.length > 1) {
      const newMedications = formData.medications.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        medications: newMedications
      }));
    }
  };

  const generatePrescriptionText = () => {
    let prescription = `${t('diagnosis')}: ${formData.diagnosis || t('no_diagnosis_specified')}\n\n`;
    prescription += `${t('prescribed_medications')}:\n`;
    
    formData.medications.forEach((med, index) => {
      if (med.trim()) {
        prescription += `${index + 1}. ${med}\n`;
      }
    });
    
    if (formData.notes) {
      prescription += `\n${t('additional_notes')}:\n${formData.notes}`;
    }
    
    if (formData.followUpDate) {
      prescription += `\n\n${t('followup_date')}: ${new Date(formData.followUpDate).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US')}`;
    }
    
    return prescription;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.diagnosis.trim()) {
      toast.error(t('write_diagnosis'));
      return;
    }

    const hasMedications = formData.medications.some(med => med.trim());
    if (!hasMedications) {
      toast.error(t('add_at_least_one_medication'));
      return;
    }

    setLoading(true);
    try {
      const finalPrescription = generatePrescriptionText();
      
      await doctorAPI.completeAppointment(appointment._id, {
        prescription: finalPrescription,
        notes: formData.notes
      });
      
      toast.success(t('success_saved'));
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || t('error_updating_profile'));
    } finally {
      setLoading(false);
    }
  };

  if (!appointment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>

        {/* معلومات المريض */}
        <div className="p-4 sm:p-6 border-b bg-gray-50 mt-16">
          <h3 className={`text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className="text-blue-600"></span>
            {t('patient_information')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-sm">
            <div className="bg-white p-3 rounded-lg border">
              <span className="font-medium text-gray-700">{t('patient_name')}</span>{' '}
              <span className="text-gray-900 font-semibold">{appointment.patient?.name}</span>
            </div>
            <div className="bg-white p-3 rounded-lg border">
              <span className="font-medium text-gray-700">{t('patient_email')}</span>{' '}
              <span className="text-gray-900 break-words">{appointment.patient?.email}</span>
            </div>
            <div className="bg-white p-3 rounded-lg border">
              <span className="font-medium text-gray-700">{t('patient_phone')}</span>{' '}
              <span className="text-gray-900">{appointment.patient?.phone || t('not_available')}</span>
            </div>
            <div className="bg-white p-3 rounded-lg border">
              <span className="font-medium text-gray-700">{t('patient_age')}</span>{' '}
              <span className="text-gray-900">{appointment.patient?.age || '--'} {t('years')}</span>
            </div>
            <div className="bg-white p-3 rounded-lg border">
              <span className="font-medium text-gray-700">{t('appointment_date')}</span>{' '}
              <span className="text-gray-900">{new Date(appointment.date).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US')}</span>
            </div>
            <div className="bg-white p-3 rounded-lg border">
              <span className="font-medium text-gray-700">{t('appointment_time')}</span>{' '}
              <span className="text-gray-900 font-semibold">{appointment.time}</span>
            </div>
          </div>
        </div>

        {/* تبويبات الروشتة */}
        <div className="border-b">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('prescription')}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'prescription'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('write_prescription')}
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'preview'
                  ? 'border-green-600 text-green-600 bg-green-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('preview_prescription')}
            </button>
          </div>
        </div>

        {/* نموذج الروشتة */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 flex-1 flex flex-col">
          
          {activeTab === 'prescription' ? (
            <>
              {/* التشخيص */}
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-red-500">🩺</span>
                  {t('diagnosis_required')}
                </label>
                <textarea
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleInputChange}
                  rows={3}
                  className="form-input resize-none w-full border-2 border-gray-300 focus:border-blue-500"
                  placeholder={t('enter_diagnosis')}
                  required
                />
              </div>

              {/* الأدوية */}
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <span className="text-green-600">💊</span>
                    {t('prescribed_medications')} *
                  </label>
                  <button
                    type="button"
                    onClick={addMedication}
                    className="text-sm bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {t('add_medication')}
                  </button>
                </div>
                
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {formData.medications.map((medication, index) => (
                    <div key={index} className={`flex gap-2 items-start ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={medication}
                          onChange={(e) => handleMedicationChange(index, e.target.value)}
                          className="form-input w-full"
                          placeholder={`${t('prescribed_medications')} ${index + 1} (${t('write_medication_name')})`}
                        />
                      </div>
                      {formData.medications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMedication(index)}
                          className="text-red-600 hover:text-red-800 p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {t('medication_example')}
                </p>
              </div>

              {/* موعد المتابعة */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <span className="text-purple-600">📅</span>
                    {t('followup_optional')}
                  </label>
                  <input
                    type="date"
                    name="followUpDate"
                    value={formData.followUpDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="form-input w-full"
                  />
                </div>
              </div>

              {/* ملاحظات إضافية */}
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-blue-600">📝</span>
                  {t('additional_notes')}
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="form-input resize-none w-full"
                  placeholder={t('enter_notes')}
                />
              </div>
            </>
          ) : (
            /* معاينة الروشتة */
            <div className="bg-white border-2 border-gray-300 rounded-lg p-6 font-sans" dir={isRTL ? 'rtl' : 'ltr'}>
              <div className="text-center mb-6 border-b-2 border-gray-400 pb-4">
                <h3 className="text-xl font-bold text-blue-800">{t('medical_prescription')}</h3>
                <p className="text-gray-600 text-sm">Medical Prescription</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h4 className="font-semibold text-gray-700 mb-2">{t('patient_information')}:</h4>
                  <p><strong>{t('patient_name')}</strong> {appointment.patient?.name}</p>
                  <p><strong>{t('appointment_date')}</strong> {new Date().toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US')}</p>
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h4 className="font-semibold text-gray-700 mb-2">{t('doctor_information')}:</h4>
                  <p><strong>د.</strong> [اسم الطبيب]</p>
                  <p><strong>{t('specialization')}:</strong> {appointment.specialization?.name}</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-2 border-b border-gray-300 pb-1">{t('diagnosis')}:</h4>
                <p className="text-gray-800 bg-yellow-50 p-3 rounded border border-yellow-200">
                  {formData.diagnosis || t('no_diagnosis_specified')}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-2 border-b border-gray-300 pb-1">{t('treatment')}:</h4>
                <div className="space-y-3">
                  {formData.medications.map((medication, index) => (
                    medication.trim() && (
                      <div key={index} className="flex items-start gap-3 bg-green-50 p-3 rounded border border-green-200">
                        <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mt-1 flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-gray-800">{medication}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>

              {formData.notes && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-2 border-b border-gray-300 pb-1">{t('instructions')}:</h4>
                  <p className="text-gray-800 bg-blue-50 p-3 rounded border border-blue-200 whitespace-pre-wrap">
                    {formData.notes}
                  </p>
                </div>
              )}

              {formData.followUpDate && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-2 border-b border-gray-300 pb-1">{t('followup_date')}:</h4>
                  <p className="text-gray-800 bg-purple-50 p-3 rounded border border-purple-200">
                    {new Date(formData.followUpDate).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US')}
                  </p>
                </div>
              )}

              <div className="text-center mt-8 pt-4 border-t-2 border-gray-400">
                <div className="inline-block border-t-2 border-gray-600 pt-2">
                  <p className="text-gray-700 font-semibold">{t('doctor_signature')}</p>
                </div>
              </div>
            </div>
          )}

          {/* نصائح للطبيب */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className={`text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              {t('prescription_tips')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-blue-800 text-sm">
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <span className="text-green-600">•</span>
                <span>{t('write_medication_name')}</span>
              </div>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <span className="text-green-600">•</span>
                <span>{t('specify_treatment_duration')}</span>
              </div>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <span className="text-green-600">•</span>
                <span>{t('mention_usage_method')}</span>
              </div>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <span className="text-green-600">•</span>
                <span>{t('set_followup_if_needed')}</span>
              </div>
            </div>
          </div>

          {/* الأزرار */}
          <div className={`flex flex-col-reverse sm:flex-row gap-3 justify-between items-center pt-4 border-t ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'prescription' ? 'preview' : 'prescription')}
                className="btn-secondary"
              >
                {activeTab === 'prescription' ? t('preview_prescription') : t('edit_prescription')}
              </button>
            </div>
            
            <div className={`flex flex-col-reverse sm:flex-row gap-2 w-full sm:w-auto ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary w-full sm:w-auto"
                disabled={loading}
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full sm:w-auto"
              >
                {loading ? <LoadingSpinner size="sm" /> : t('save_prescription_complete')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteAppointment;