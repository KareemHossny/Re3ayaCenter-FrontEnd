import React, { useState, useEffect } from 'react';
import { doctorAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const CompleteAppointment = ({ appointment, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    prescription: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState(null);

  useEffect(() => {
    if (appointment) {
      fetchAppointmentDetails();
      setFormData({
        prescription: appointment.prescription || '',
        notes: appointment.notes || ''
      });
    }
    // eslint-disable-next-line
  }, [appointment]);

  const fetchAppointmentDetails = async () => {
    try {
      const response = await doctorAPI.getAppointmentDetails(appointment._id);
      setAppointmentDetails(response.data);
    } catch (error) {
      console.error('Error fetching appointment details:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.prescription.trim()) {
      alert('يرجى كتابة الروشتة');
      return;
    }

    setLoading(true);
    try {
      await doctorAPI.completeAppointment(appointment._id, formData);
      alert('تم إكمال الموعد وإضافة الروشتة بنجاح');
      onSuccess();
    } catch (error) {
      alert(error.response?.data?.message || 'فشل في إكمال الموعد');
    } finally {
      setLoading(false);
    }
  };

  if (!appointment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg sm:max-w-xl md:max-w-2xl max-h-[95vh] overflow-y-auto flex flex-col">
        {/* الهيدر */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
            إكمال الموعد وإضافة روشتة
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl sm:text-2xl"
            aria-label="إغلاق"
          >
            ×
          </button>
        </div>

        {/* معلومات المريض */}
        <div className="p-4 sm:p-6 border-b">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
            معلومات المريض
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">الاسم:</span>{' '}
              <span className="text-gray-900 break-words">
                {appointment.patient?.name}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">البريد الإلكتروني:</span>{' '}
              <span className="text-gray-900 break-words">
                {appointment.patient?.email}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">الهاتف:</span>{' '}
              <span className="text-gray-900 break-words">
                {appointment.patient?.phone || 'غير متوفر'}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">التاريخ:</span>{' '}
              <span className="text-gray-900">
                {new Date(appointment.date).toLocaleDateString('ar-EG')}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">الوقت:</span>{' '}
              <span className="text-gray-900">{appointment.time}</span>
            </div>
          </div>
        </div>

        {/* نموذج الروشتة */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 sm:space-y-6 flex-1 flex flex-col">
          {/* الروشتة */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الروشتة الطبية *
            </label>
            <textarea
              name="prescription"
              value={formData.prescription}
              onChange={handleInputChange}
              rows={window.innerWidth < 640 ? 4 : 6}
              className="form-input resize-none w-full"
              placeholder="اكتب الروشتة الطبية هنا..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              اكتب الأدوية والتعليمات الطبية بشكل واضح
            </p>
          </div>

          {/* ملاحظات إضافية */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ملاحظات إضافية
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={window.innerWidth < 640 ? 2 : 3}
              className="form-input resize-none w-full"
              placeholder="أي ملاحظات إضافية تريد إضافتها..."
            />
          </div>

          {/* نصائح للطبيب */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <h4 className="text-xs sm:text-sm font-semibold text-blue-900 mb-1 sm:mb-2">نصائح للروشتة:</h4>
            <ul className="text-blue-800 text-xs sm:text-sm space-y-0.5 sm:space-y-1">
              <li>• اكتب اسم الدواء والجرعة بشكل واضح</li>
              <li>• حدد مدة العلاج</li>
              <li>• اذكر أي تحذيرات أو آثار جانبية</li>
              <li>• حدد موعد المتابعة إذا لزم الأمر</li>
            </ul>
          </div>

          {/* الأزرار */}
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 justify-end pt-3 sm:pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary w-full sm:w-auto"
              disabled={loading}
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full sm:w-auto"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'إكمال الموعد وحفظ الروشتة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteAppointment;