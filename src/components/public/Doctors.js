import React, { useState, useEffect } from 'react';
import { publicAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { Link } from 'react-router-dom';
import {
  PhoneIcon,
  ClockIcon,
  UserIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

const getDoctorIcon = (specializationName) => {
  // This mapping can be expanded for more personalization
  const icons = {
    'طب القلب': UserIcon,
    'طب الأطفال': UserIcon,
    'جراحة العظام': UserIcon,
    'طب العيون': UserIcon,
    'طب الأسنان': UserIcon,
    'طب الأعصاب': UserIcon,
    'الجراحة العامة': UserIcon,
    'النساء والتوليد': UserIcon,
    'الجلدية': UserIcon,
    'الباطنة': UserIcon,
    'الأنف والأذن': UserIcon,
    'الجهاز الهضمي': UserIcon,
  };
  const IconComponent = icons[specializationName] || BuildingOfficeIcon;
  return <IconComponent className="w-12 h-12 text-primary-600" />;
};

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');

  useEffect(() => {
    fetchDoctors();
    fetchSpecializations();
    // eslint-disable-next-line
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await publicAPI.getDoctors();
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecializations = async () => {
    try {
      const response = await publicAPI.getSpecializations();
      setSpecializations(response.data);
    } catch (error) {
      console.error('Error fetching specializations:', error);
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization =
      !selectedSpecialization ||
      doctor.specialization?._id === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  const getDaysCount = (availability) => {
    return availability ? availability.length : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden"> 
      {/* الهيرو */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-yellow-300 drop-shadow-[0_2px_12px_rgba(250,200,50,0.3)]">فريق الأطباء</h1>
            <p className="text-xl md:text-2xl mb-8 font-arabic">
              "نحن نرعاك والله يشفيك"
            </p>
            <p className="text-lg max-w-3xl mx-auto leading-relaxed">
              تعرف على نخبة الأطباء في كافة التخصصات الطبية، واختر الطبيب الأنسب لرعايتك وتلبية احتياجاتك الصحية في مركز رعاية.
            </p>
          </div>
        </div>
      </section>

      {/* البحث والتصفية */}
      <section className="py-12 bg-white relative z-10" style={{ marginTop: '-60px' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-6 rounded-xl shadow-lg">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="ابحث عن طبيب بالاسم..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input text-lg py-3"
                />
              </div>
              <div className="sm:w-64">
                <select
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="form-input text-lg py-3"
                >
                  <option value="">جميع التخصصات</option>
                  {specializations.map((spec) => (
                    <option key={spec._id} value={spec._id}>
                      {spec.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* قائمة الأطباء */}
      <section className="py-24 bg-gradient-to-bl from-primary-50 via-white to-primary-100 min-h-[60vh] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-4 md:px-6 lg:px-8 relative z-10"> 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 lg:gap-12"> 
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor._id}
                className="relative group overflow-visible min-h-[420px]"
              >
                {/* Decorative border & glow */}
                <div className="absolute -inset-1 top-3.5 left-3.5 z-0 rounded-2xl bg-gradient-to-br from-primary-200/60 to-yellow-100/30 to-90% blur-[2px] opacity-80 pointer-events-none transition-all group-hover:-inset-2 group-hover:opacity-100 group-hover:blur-lg"></div>
                {/* Card */}
                <div className="relative bg-white rounded-2xl shadow-xl border border-primary-100 group-hover:border-primary-300/80 transition-all duration-200 p-6 md:p-8 min-h-[410px] flex flex-col justify-between"> {/* p-6 للشاشات الصغيرة */}
                  {/* Avatar circle with ring */}
                  <div className="flex flex-col items-center mb-4 -mt-14">
                    <div className="relative mb-1">
                      <span className="absolute -inset-2 rounded-full bg-gradient-to-br from-yellow-300/70 via-primary-100/70 to-yellow-100/50 blur-lg opacity-65"></span>
                      <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full ring-4 ring-primary-200 shadow-md z-10 bg-gradient-to-br from-primary-50 via-white to-primary-200 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-200">
                        {doctor.profileImage ? (
                          <img
                            src={`http://localhost:5000/${doctor.profileImage}`}
                            alt={doctor.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          getDoctorIcon(doctor.specialization?.name)
                        )}
                      </div>
                    </div>
                    <h3 className="mt-2 text-xl md:text-2xl font-extrabold text-primary-800 mb-1 drop-shadow-sm">{doctor.name}</h3>
                    <span className="text-primary-700 font-semibold text-base md:text-lg px-3 py-1 rounded-full bg-yellow-100 bg-opacity-60 border border-yellow-200/40 shadow-sm">
                      {doctor.specialization?.name}
                    </span>
                  </div>
                  {/* Details */}
                  <div className="text-base text-gray-700 font-medium mt-5 mb-8 text-center space-y-2">
                    {doctor.phone && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary-50/90 border border-primary-100 text-primary-800 shadow-sm text-base font-bold transition">
                        <PhoneIcon className="w-5 h-5 text-primary-700" />
                        <span dir="ltr" style={{ direction: "ltr" }}>{doctor.phone}</span>
                      </div>
                    )}
                    {doctor.availability && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-yellow-50/70 border border-yellow-100 text-yellow-900 shadow-sm text-base font-semibold transition">
                        <ClockIcon className="w-5 h-5 text-yellow-600" />
                        <span>{getDaysCount(doctor.availability)} يوم عمل</span>
                      </div>
                    )}
                  </div>
                  {/* Book button */}
                  <div className="mt-auto pt-3 text-center relative">
                    <Link
                      to="/login"
                      className="inline-flex justify-center items-center gap-2 w-full rounded-xl bg-gradient-to-r from-primary-700 to-primary-900 text-yellow-300 font-bold text-lg py-3 shadow-md hover:from-yellow-400 hover:to-yellow-500 hover:text-primary-900 hover:scale-105 transition-all duration-150 ring-1 ring-primary-900/10 focus:outline-none focus:ring-4 focus:ring-yellow-300/20"
                      style={{
                        letterSpacing: '0.02em'
                      }}
                    >
                      <span className="font-bold">احجز موعد</span>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </Link>
                    <span className="block mt-2 text-xs text-gray-400">* يتطلب تسجيل الدخول</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* No results */}
          {filteredDoctors.length === 0 && (
            <div className="text-center py-20">
              <div className="flex justify-center mb-4">
                <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" /></svg>
              </div>
              <h3 className="text-xl font-extrabold text-primary-800 mb-2">
                لا توجد نتائج
              </h3>
              <p className="text-gray-600 text-lg">
                {searchTerm || selectedSpecialization
                  ? 'لم نتمكن من العثور على أطباء يتطابقون مع بحثك.'
                  : 'لا يوجد أطباء متاحون حالياً.'}
              </p>
            </div>
          )}
        </div>
        {/* Background Decorative SVGs */}
        <svg className="hidden sm:block absolute opacity-50 left-0 top-0 w-48 md:w-64 rotate-12 -translate-y-12 -translate-x-10 pointer-events-none" viewBox="0 0 181 170" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="90.5" cy="85" rx="90.5" ry="85" fill="#e0e7ff" fillOpacity="0.08"/>
        </svg>
        <svg className="hidden sm:block absolute opacity-50 right-0 bottom-0 w-52 md:w-80 -rotate-12 translate-y-16 translate-x-8 pointer-events-none" viewBox="0 0 217 170" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="108" cy="85" rx="108" ry="85" fill="#fde68a" fillOpacity="0.07"/>
        </svg>
      </section>

      {/* دعوة للتسجيل */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            انضم إلى عائلة مركز رعاية
          </h3>
          <p className="text-xl mb-8 opacity-90 text-white">
            سجل الآن واحصل على أفضل الخدمات الطبية مع فريقنا المتخصص
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-yellow-400 hover:bg-transparent border-2 border-yellow-400 hover:border-white hover:text-white text-primary-900 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              إنشاء حساب جديد
            </Link>
            <Link
              to="/login"
              className="border-2 border-white hover:bg-yellow-400 hover:text-primary-900 hover:border-yellow-400 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Doctors;