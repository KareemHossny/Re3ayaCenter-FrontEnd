import React, { useState, useEffect, useCallback } from 'react';
import { doctorAPI, specializationAPI, uploadAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const MAX_IMAGE_SIZE_MB = 5;

const DoctorProfile = () => {
  const { user, setUser } = useAuth(); // استخدام setUser بدلاً من updateUser
  const [profile, setProfile] = useState(null);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Data fetching
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await doctorAPI.getProfile();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error(t('error_loading_data'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const fetchSpecializations = useCallback(async () => {
    try {
      const response = await specializationAPI.getSpecializations();
      
      let specializationsData = [];
      
      if (Array.isArray(response.data)) {
        specializationsData = response.data;
      } else if (response.data && Array.isArray(response.data.specializations)) {
        specializationsData = response.data.specializations;
      } else if (response.data && Array.isArray(response.data.data)) {
        specializationsData = response.data.data;
      } else if (Array.isArray(response)) {
        specializationsData = response;
      }
      
      setSpecializations(specializationsData);
    } catch (error) {
      console.error('Error fetching specializations:', error);
      toast.error(t('error_loading_specializations'));
      setSpecializations([]);
    }
  }, [t]);

  useEffect(() => {
    fetchProfile();
    fetchSpecializations();
  }, [fetchProfile, fetchSpecializations]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSpecializationChange = (e) => {
    const newSpecializationId = e.target.value;
    setProfile((prev) => ({
      ...prev,
      specialization: newSpecializationId ? { _id: newSpecializationId } : null
    }));
  };

  // دالة واحدة لحفظ جميع التحديثات
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updateData = {
        name: profile.name,
        phone: profile.phone,
        experienceYears: profile.experienceYears,
        specialization: profile.specialization?._id || null
      };

      const { data } = await doctorAPI.updateProfile(updateData);
      setProfile(data.data);
      
      // تحديث بيانات المستخدم في context باستخدام setUser
      if (setUser) {
        setUser(prevUser => ({
          ...prevUser,
          ...data.data
        }));
      }
      
      toast.success(t('success_updated'));
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || t('error_updating_profile'));
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error(t('image_file_only'));
      return;
    }
    
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      toast.error(t('image_size_limit', { size: MAX_IMAGE_SIZE_MB }));
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      console.log('Uploading image...', file.name);
      const { data } = await uploadAPI.uploadProfileImage(formData);
      
      if (data.success) {
        console.log('Image uploaded successfully:', data.profileImage);
        
        // تحديث الصورة في الـ state
        setProfile((prev) => ({
          ...prev,
          profileImage: data.profileImage
        }));
        
        // تحديث المستخدم في context باستخدام setUser
        if (setUser) {
          setUser(prevUser => ({
            ...prevUser,
            profileImage: data.profileImage
          }));
        }
        
        toast.success(data.message || t('success_uploaded'));
      } else {
        console.error('Upload failed:', data.message);
        toast.error(data.message || t('error_uploading_image'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.message || error.message || t('error_uploading_image');
      toast.error(errorMessage);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDeleteImage = async () => {
    if (!window.confirm(t('confirm_delete_image'))) return;

    setUploading(true);
    try {
      const { data } = await uploadAPI.deleteProfileImage();
      
      if (data.success) {
        setProfile((prev) => ({
          ...prev,
          profileImage: null
        }));
        
        // تحديث المستخدم في context باستخدام setUser
        if (setUser) {
          setUser(prevUser => ({
            ...prevUser,
            profileImage: null
          }));
        }
        
        toast.success(data.message || t('success_deleted'));
      } else {
        toast.error(data.message || t('error_deleting_image'));
      }
    } catch (error) {
      console.error('Delete error:', error);
      const errorMessage = error.response?.data?.message || error.message || t('error_deleting_image');
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  // دالة محسنة لعرض الصورة - تأكد من أن الرابط صحيح
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    console.log('Original image path:', imagePath);
    
    // إذا كان الرابط يحتوي على http فهو رابط كامل من Cloudinary
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // إذا كان مساراً نسبياً، أضف الـ base URL
    const baseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
    
    // تنظيف المسار - إزالة الـ / الزائدة
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    const fullUrl = `${baseUrl}/${cleanPath}`;
    
    console.log('Final image URL:', fullUrl);
    return fullUrl;
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
        <p className="text-gray-600">{t('error_loading_data')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-2 md:px-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <h2 className={`text-2xl font-bold text-gray-900 mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        {t('profile')}
      </h2>

      <div className="card p-3 sm:p-6 transition-all duration-300">
        {/* Profile Image */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative inline-block">
            <div className="w-28 h-28 xs:w-32 xs:h-32 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
              {profile.profileImage ? (
                <img
                  src={getImageUrl(profile.profileImage)}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Image load error:', profile.profileImage);
                    console.error('Generated URL:', getImageUrl(profile.profileImage));
                    e.target.style.display = 'none';
                    // إظهار الصورة البديلة عند الخطأ
                    const fallback = e.target.parentElement.querySelector('.fallback-icon');
                    if (fallback) fallback.style.display = 'flex';
                  }}
                  onLoad={() => console.log('Image loaded successfully:', getImageUrl(profile.profileImage))}
                />
              ) : null}
              
              {/* Fallback icon - يظهر فقط عندما لا توجد صورة أو فشل تحميلها */}
              <div 
                className="fallback-icon w-full h-full flex items-center justify-center"
                style={{ display: profile.profileImage ? 'none' : 'flex' }}
              >
                <span className="text-3xl xs:text-4xl text-gray-400" role="img" aria-label="doctor">
                  👨‍⚕️
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <label className="btn-primary cursor-pointer inline-flex items-center justify-center min-w-[120px]">
                {uploading ? <LoadingSpinner size="sm" /> : t('change_image')}
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
                  type="button"
                  onClick={handleDeleteImage}
                  disabled={uploading}
                  className="btn-secondary min-w-[120px]"
                >
                  {t('delete_image')}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 gap-y-6">
            {/* Name */}
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
                {t('full_name')} <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={profile.name || ''}
                onChange={handleInputChange}
                className="form-input transition-all duration-200"
                required
                autoComplete="name"
                maxLength={60}
                dir="auto"
              />
            </div>

            {/* Email */}
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                {t('email')}
              </label>
              <input
                id="email"
                type="email"
                value={profile.email}
                className="form-input bg-gray-100"
                disabled
                readOnly
                dir="ltr"
              />
              <p className="text-xs text-gray-500 mt-1">{t('cannot_change_email')}</p>
            </div>

            {/* Phone */}
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="phone">
                {t('phone_number')}
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={profile.phone || ''}
                onChange={handleInputChange}
                className="form-input transition-all duration-200"
                placeholder={t('enter_phone')}
                maxLength={20}
                autoComplete="tel"
                dir="ltr"
              />
            </div>

            {/* Experience Years */}
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="experienceYears">
                {t('experience_years')} <span className="text-red-500">*</span>
              </label>
              <input
                id="experienceYears"
                type="number"
                name="experienceYears"
                value={profile.experienceYears || 0}
                onChange={handleInputChange}
                min={0}
                max={60}
                className="form-input transition-all duration-200"
                required
                dir="ltr"
              />
              <p className="text-xs text-gray-500 mt-1">
                {t('experience_description')}
              </p>
            </div>

            {/* Specialization */}
            <div className={`sm:col-span-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="specialization">
                {t('specialization')} <span className="text-red-500">*</span>
              </label>
              <select
                id="specialization"
                value={profile.specialization?._id || ''}
                onChange={handleSpecializationChange}
                className="form-input flex-1 min-w-0 transition-all duration-200"
                required
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                <option value="">{t('choose_specialization')}</option>
                {Array.isArray(specializations) && specializations.map((spec) => (
                  <option key={spec._id} value={spec._id}>
                    {spec.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {profile.specialization?.name
                  ? `${t('current_specialization')} ${profile.specialization.name}`
                  : t('no_specialization_chosen')}
              </p>
            </div>
          </div>

          {/* Role */}
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="role">
              {t('role')}
            </label>
            <input
              id="role"
              type="text"
              value={t('doctor_role')}
              className="form-input bg-gray-100"
              disabled
              readOnly
              dir="auto"
            />
          </div>

          {/* Join Date */}
          {profile.createdAt && (
            <div className={`text-sm text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}>
              <p>{t('joined_at')} {new Date(profile.createdAt).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US')}</p>
            </div>
          )}

          {/* Save Button */}
          <div className={`flex justify-center sm:justify-end pt-4 ${isRTL ? 'sm:justify-start' : 'sm:justify-end'}`}>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary w-full sm:w-auto min-w-[140px] flex items-center justify-center gap-2"
            >
              {saving && <LoadingSpinner size="sm" />}
              {saving ? t('saving') : t('save_all_data')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorProfile;