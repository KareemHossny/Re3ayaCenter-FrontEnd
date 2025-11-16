import React, { useState, useEffect } from 'react';
import { specializationAPI, adminAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const SpecializationManagement = () => {
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSpecializations();
    // eslint-disable-next-line
  }, []);

  const fetchSpecializations = async () => {
    try {
      const response = await specializationAPI.getSpecializations();
      setSpecializations(response.data);
    } catch (error) {
      console.error('Error fetching specializations:', error);
    } finally {
      setLoading(false);
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
    setSubmitting(true);

    try {
      if (editing) {
        await specializationAPI.updateSpecialization(editing._id, formData);
        alert('تم تحديث التخصص بنجاح');
      } else {
        await adminAPI.createSpecialization(formData);
        alert('تم إنشاء التخصص بنجاح');
      }

      setFormData({ name: '', description: '' });
      setShowForm(false);
      setEditing(null);

      fetchSpecializations();
    } catch (error) {
      alert(error.response?.data?.message || 'فشل في حفظ التخصص');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (specialization) => {
    setEditing(specialization);
    setFormData({
      name: specialization.name,
      description: specialization.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (specializationId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا التخصص؟')) return;

    try {
      await specializationAPI.deleteSpecialization(specializationId);
      alert('تم حذف التخصص بنجاح');
      fetchSpecializations();
    } catch (error) {
      alert(error.response?.data?.message || 'فشل في حذف التخصص');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
    setFormData({ name: '', description: '' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[250px] py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h2 className="text-2xl font-bold text-gray-900">إدارة التخصصات الطبية</h2>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary w-full sm:w-auto"
        >
          + إضافة تخصص جديد
        </button>
      </div>

      {/* نموذج إضافة/تعديل التخصص */}
      {showForm && (
        <div className="card mb-6 px-3 py-4 max-w-xl mx-auto shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            {editing ? 'تعديل التخصص' : 'إضافة تخصص جديد'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم التخصص <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input w-full"
                placeholder="أدخل اسم التخصص"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الوصف (اختياري)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="form-input w-full"
                placeholder="أدخل وصفاً للتخصص"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
              >
                {submitting ? <LoadingSpinner size="sm" /> : (editing ? 'تحديث' : 'إضافة')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* قائمة التخصصات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {specializations.map((specialization) => (
          <div key={specialization._id} className="card hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between">
            <div>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900 truncate max-w-[70vw]">
                  {specialization.name}
                </h3>
                <div className="flex gap-1 mt-2 sm:mt-0">
                  <button
                    onClick={() => handleEdit(specialization)}
                    className="text-blue-600 hover:text-blue-800 text-xs font-medium border border-blue-100 rounded py-1 px-2 transition-colors"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(specialization._id)}
                    className="text-red-600 hover:text-red-800 text-xs font-medium border border-red-100 rounded py-1 px-2 transition-colors"
                  >
                    حذف
                  </button>
                </div>
              </div>

              {specialization.description && (
                <p className="text-gray-600 text-sm mb-3 break-words">
                  {specialization.description.length > 150
                    ? specialization.description.slice(0, 150) + '...'
                    : specialization.description}
                </p>
              )}
            </div>

            <div className="text-xs text-gray-500 border-t pt-3 mt-auto">
              <div className="flex justify-between flex-wrap gap-x-2">
                <span>تم الإنشاء بواسطة:</span>
                <span className="font-medium text-right truncate max-w-[70%]">
                  {specialization.createdBy?.name || 'النظام'}
                </span>
              </div>
              <div className="flex justify-between flex-wrap mt-1 gap-x-2">
                <span>تاريخ الإنشاء:</span>
                <span className="ltr:ml-auto rtl:mr-auto">
                  {new Date(specialization.createdAt).toLocaleDateString('ar-EG')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {specializations.length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-3 animate-bounce">🏥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            لا توجد تخصصات
          </h3>
          <p className="text-gray-600 mb-4">
            لم يتم إضافة أي تخصصات طبية بعد.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary mt-2"
          >
            إضافة أول تخصص
          </button>
        </div>
      )}

      {/* إحصائيات */}
      <div className="card mt-6 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">معلومات التخصصات</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="text-center p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-primary-600">{specializations.length}</div>
            <div className="text-gray-700 font-medium mt-1">إجمالي التخصصات</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-green-600">
              {specializations.filter(s => s.isActive).length}
            </div>
            <div className="text-gray-700 font-medium mt-1">تخصص نشط</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-blue-600">
              {new Set(specializations.map(s => s.createdBy?._id)).size}
            </div>
            <div className="text-gray-700 font-medium mt-1">مشرف منشئ</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecializationManagement;