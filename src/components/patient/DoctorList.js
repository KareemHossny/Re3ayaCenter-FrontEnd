import React, { useState, useEffect } from 'react';
import { patientAPI, specializationAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import AppointmentBooking from './AppointmentBooking';
import { EnvelopeIcon , PhoneIcon } from "@heroicons/react/24/outline";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    fetchDoctors();
    fetchSpecializations();
    // eslint-disable-next-line
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedSpecialization) params.specialization = selectedSpecialization;

      const response = await patientAPI.getDoctors(params);
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
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

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBooking(true);
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
      {/* شريط البحث والتصفية */}
      <div className="card mb-6">
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="flex-1 min-w-0">
            <input
              type="text"
              placeholder="ابحث عن طبيب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input w-full"
            />
          </div>
          <div className="sm:w-64 w-full">
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="form-input w-full"
            >
              <option value="">جميع التخصصات</option>
              {specializations.map((spec) => (
                <option key={spec._id} value={spec._id}>
                  {spec.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="btn-primary sm:w-32 w-full sm:w-auto"
          >
            بحث
          </button>
        </form>
      </div>

      {/* قائمة الأطباء */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {doctors.map((doctor) => (
          <div
            key={doctor._id}
            className="card rounded-2xl shadow-xl hover:shadow-2xl border border-gray-200 hover:border-primary-500 transition-all flex flex-col h-full bg-gradient-to-tr from-white via-primary-50 to-white relative overflow-hidden"
          >
            {/* شريط زخرفة خلفي */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-40 h-32 bg-primary-100 opacity-10 rounded-full z-0"></div>

            {/* محتوى الطبيب */}
            <div className="flex flex-col xs:flex-row sm:flex-row items-center gap-4 py-7 px-6 z-10 relative">
              {/* صورة الطبيب */}
              <div className="flex-shrink-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-primary-50 border-4 border-primary-200 shadow-lg rounded-full flex items-center justify-center overflow-hidden ring-4 ring-primary-100">
                  {doctor.profileImage ? (
                    <img
                      src={`http://localhost:5000/${doctor.profileImage}`}
                      alt={doctor.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-[2.5rem] leading-none">👨‍⚕️</span>
                  )}
                </div>
              </div>

              {/* معلومات الطبيب */}
              <div className="flex-1 text-center xs:text-right">
                <h3 className="text-xl font-extrabold text-primary-900 mb-0.5 tracking-tight">{doctor.name}</h3>
                <p className="text-primary-700 font-semibold text-base mb-0.5">
                  {doctor.specialization?.name || 'بدون تخصص'}
                </p>
                <div className="mt-2 flex flex-col gap-1 items-center xs:items-end text-[0.85rem] text-gray-700">
                  <span className="break-words flex items-center gap-2">
                    <EnvelopeIcon className="w-4 h-4 text-primary-500" />
                    <span>{doctor.email}</span>
                  </span>
                  {doctor.phone && (
                    <span className="break-words flex items-center gap-2">
                      <PhoneIcon className="w-4 h-4 text-green-600" />
                      <span>{doctor.phone}</span>
                    </span>
                  )}
                </div>

              </div>
            </div>
            {/* خط فاصل زخرفي سفلي */}
            <div className="w-full h-[2px] bg-gradient-to-r from-primary-100 via-primary-300 to-primary-100 mb-3" />

            {/* أيام العمل */}
            {doctor.availability && doctor.availability.length > 0 && (
              <div className="px-6 mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M4 4v16h16V4H4Zm2 2h12v12H6V6Z"></path></svg>
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">أيام العمل:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {doctor.availability.slice(0, 3).map((day, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary-50 text-primary-800 text-xs rounded-lg font-semibold border border-primary-200 shadow-sm"
                    >
                      {getDayName(day.day)}
                    </span>
                  ))}
                  {doctor.availability.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg font-bold border border-gray-200 shadow-sm">
                      +{doctor.availability.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* زر الحجز */}
            <div className="px-6 pb-6 mt-auto">
              <button
                onClick={() => handleBookAppointment(doctor)}
                className="btn-primary w-full rounded-lg py-2 text-base font-extrabold shadow-lg transition duration-150 hover:bg-primary-800 hover:scale-[1.03] focus:ring-2 focus:ring-primary-300"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"></path></svg>
                  حجز موعد
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {doctors.length === 0 && (
        <div className="text-center py-16 px-8 bg-white shadow rounded-2xl border border-gray-200 flex flex-col items-center mx-auto max-w-lg mt-12">
          <div className="text-[4.5rem] mb-4 animate-bounce-slow">🔍</div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            لا توجد نتائج
          </h3>
          <p className="text-gray-600 text-lg sm:text-xl mb-1.5">
            لم نتمكن من العثور على أطباء يتطابقون مع بحثك.
          </p>
          <p className="text-gray-400 text-base">حاول تغيير كلمات البحث أو التخصص.</p>
        </div>
      )}

      {/* نافذة الحجز */}
      {showBooking && selectedDoctor && (
        <AppointmentBooking
          doctor={selectedDoctor}
          onClose={() => {
            setShowBooking(false);
            setSelectedDoctor(null);
          }}
          onSuccess={() => {
            setShowBooking(false);
            setSelectedDoctor(null);
          }}
        />
      )}
    </div>
  );
};

// دالة لتحويل اسم اليوم بالإنجليزية إلى العربية
const getDayName = (englishDay) => {
  const days = {
    sunday: 'الأحد',
    monday: 'الإثنين',
    tuesday: 'الثلاثاء',
    wednesday: 'الأربعاء',
    thursday: 'الخميس',
    friday: 'الجمعة',
    saturday: 'السبت'
  };
  return days[englishDay] || englishDay;
};

export default DoctorList;