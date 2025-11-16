import React, { useState, useEffect } from 'react';
import { doctorAPI, specializationAPI, uploadAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const DoctorProfile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSpecialization, setSavingSpecialization] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
    fetchSpecializations();
    // eslint-disable-next-line
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await doctorAPI.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecializations = async () => {
    try {
      const response = await specializationAPI.getSpecializations();
      setSpecializations(response.data);
    } catch (error) {
      console.error('Error fetching specializations:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // دالة منفصلة لحفظ البيانات الأساسية
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const updateData = {
        name: profile.name,
        phone: profile.phone
      };

      const response = await doctorAPI.updateProfile(updateData);
      setProfile(response.data.doctor);
      updateUser(response.data.doctor);
      setMessage('تم تحديث الملف الشخصي بنجاح');
    } catch (error) {
      setMessage(error.response?.data?.message || 'فشل في تحديث الملف الشخصي');
    } finally {
      setSaving(false);
    }
  };

  // دالة منفصلة لتحديث التخصص
  const handleSpecializationChange = async (e) => {
    const newSpecializationId = e.target.value;
    setSavingSpecialization(true);
    setMessage('');

    try {
      const response = await doctorAPI.updateSpecialization(newSpecializationId);
      setProfile(response.data.doctor);
      updateUser(response.data.doctor);
      setMessage('تم تحديث التخصص بنجاح');
    } catch (error) {
      setMessage(error.response?.data?.message || 'فشل في تحديث التخصص');
    } finally {
      setSavingSpecialization(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage('يرجى اختيار ملف صورة فقط');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage('حجم الصورة يجب أن يكون أقل من 5MB');
      return;
    }

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const response = await uploadAPI.uploadProfileImage(formData);
      setProfile(prev => ({
        ...prev,
        profileImage: response.data.profileImage
      }));
      setMessage('تم رفع الصورة بنجاح');
    } catch (error) {
      setMessage(error.response?.data?.message || 'فشل في رفع الصورة');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!window.confirm('هل تريد حذف الصورة الشخصية؟')) return;

    setUploading(true);
    try {
      await uploadAPI.deleteProfileImage();
      setProfile(prev => ({
        ...prev,
        profileImage: null
      }));
      setMessage('تم حذف الصورة بنجاح');
    } catch (error) {
      setMessage(error.response?.data?.message || 'فشل في حذف الصورة');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">حدث خطأ في تحميل البيانات</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-2 md:px-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center md:text-right">الملف الشخصي</h2>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.includes('نجاح') 
            ? 'bg-green-100 text-green-700 border border-green-200' 
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <div className="card p-3 sm:p-6">
        {/* صورة البروفايل */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative inline-block">
            <div className="w-28 h-28 xs:w-32 xs:h-32 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
              {profile.profileImage ? (
                <img
                  src={`http://localhost:5000/${profile.profileImage}`}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl xs:text-4xl">👨‍⚕️</span>
              )}
            </div>
            
            <div className="mt-4 flex flex-wrap justify-center gap-x-2 gap-y-2">
              <label className="btn-primary cursor-pointer inline-block w-max">
                {uploading ? <LoadingSpinner size="sm" /> : 'تغيير الصورة'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              
              {profile.profileImage && (
                <button
                  onClick={handleDeleteImage}
                  disabled={uploading}
                  className="btn-secondary w-max"
                >
                  حذف الصورة
                </button>
              )}
            </div>
          </div>
        </div>

        {/* نموذج البيانات */}
        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
            {/* الاسم */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الاسم الكامل *
              </label>
              <input
                type="text"
                name="name"
                value={profile.name || ''}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            {/* البريد الإلكتروني */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={profile.email}
                className="form-input bg-gray-100"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">لا يمكن تغيير البريد الإلكتروني</p>
            </div>

            {/* رقم الهاتف */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الهاتف
              </label>
              <input
                type="tel"
                name="phone"
                value={profile.phone || ''}
                onChange={handleInputChange}
                className="form-input"
                placeholder="أدخل رقم الهاتف"
              />
            </div>

            {/* التخصص */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                التخصص *
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={profile.specialization?._id || ''}
                  onChange={handleSpecializationChange}
                  disabled={savingSpecialization}
                  className="form-input flex-1 min-w-0"
                  required
                >
                  <option value="">اختر التخصص</option>
                  {specializations.map((spec) => (
                    <option key={spec._id} value={spec._id}>
                      {spec.name}
                    </option>
                  ))}
                </select>
                {savingSpecialization && (
                  <LoadingSpinner size="sm" />
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                التخصص الحالي: {profile.specialization?.name || 'لم يتم اختيار تخصص'}
              </p>
            </div>
          </div>

          {/* الدور */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الدور
            </label>
            <input
              type="text"
              value="طبيب"
              className="form-input bg-gray-100"
              disabled
            />
          </div>

          {/* تاريخ الإنشاء */}
          {profile.createdAt && (
            <div className="text-sm text-gray-500 text-center sm:text-right">
              <p>انضم في: {new Date(profile.createdAt).toLocaleDateString('ar-EG')}</p>
            </div>
          )}

          {/* زر الحفظ */}
          <div className="flex justify-center sm:justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary w-full sm:w-auto"
            >
              {saving ? <LoadingSpinner size="sm" /> : 'حفظ البيانات الأساسية'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorProfile;