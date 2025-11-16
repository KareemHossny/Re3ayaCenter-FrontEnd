import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UserIcon,
  PhoneIcon,
  ClockIcon,
  AcademicCapIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BuildingOfficeIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline';
import { publicAPI } from '../../services/publicAPI';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const heroImage = '/images/istockphoto-1409442714-612x612.jpg';

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  useEffect(() => {
    fetchDoctors();
    // eslint-disable-next-line
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await publicAPI.getDoctors();
      setDoctors(response.data); // Load all doctors!
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const features = [
    {
      icon: AcademicCapIcon,
      title: 'أفضل الأطباء',
      description: 'فريق من أفضل الأطباء المتخصصين في مختلف المجالات الطبية',
    },
    {
      icon: ClockIcon,
      title: 'حجز مواعيد أونلاين',
      description: 'احجز موعدك بسهولة من خلال نظامنا الإلكتروني المتطور',
    },
    {
      icon: BuildingOfficeIcon,
      title: 'تخصصات متنوعة',
      description: 'نغطي جميع التخصصات الطبية لتلبية جميع احتياجاتك الصحية',
    },
    {
      icon: DevicePhoneMobileIcon,
      title: 'خدمة 24/7',
      description: 'خدمة متاحة على مدار الساعة لتقديم أفضل رعاية طبية',
    },
  ];

  const stats = [
    { number: '50+', label: 'طبيب متخصص' },
    { number: '25+', label: 'تخصص طبي' },
    { number: '3000+', label: 'مريض راضٍ' },
    { number: '15+', label: 'عام من الخبرة' },
  ];

  return (
    <div>
      {/* الهيرو مع صورة خلفية مع تحسين بصري */}
      <section
        className="relative text-white min-h-[520px] flex items-center py-16 md:py-28"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-700/70 to-primary-900/80 z-0 pointer-events-none" />
        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
            <h1 className="text-5xl md:text-7xl font-black font-arabic mb-8 drop-shadow-lg">
              مركز{' '}
              <span className="text-yellow-300 drop-shadow-[0_2px_12px_rgba(250,200,50,0.3)]">
                رعاية
              </span>
            </h1>
            <p className="text-2xl md:text-3xl mb-10 font-arabic font-semibold opacity-90">
              "نحن نرعاك والله يشفيك"
            </p>
            <p className="text-lg md:text-2xl mb-10 max-w-2xl mx-auto font-light opacity-95 shadow-sm shadow-primary-900/10">
              نقدم لكم أفضل الخدمات الطبية برعاية متخصصة وتقنيات حديثة لضمان حصولكم على أفضل رعاية صحية ممكنة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link
                to="/doctors"
                className="bg-gradient-to-r from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-primary-900 px-10 py-3 rounded-xl text-xl font-bold shadow-lg shadow-yellow-300/30 border-2 border-yellow-200 transition-all duration-200"
              >
                احجز موعدك الآن
              </Link>
              <Link
                to="/about"
                className="border-2 border-white hover:bg-white hover:text-primary-700 text-white px-10 py-3 rounded-xl text-xl font-semibold transition-colors shadow-md"
              >
                تعرف علينا
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* الإحصائيات مع لمسة حديثة */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-primary-100 via-white to-primary-50 p-7 rounded-2xl shadow transition-all hover:scale-105 hover:shadow-lg"
              >
                <div className="text-4xl md:text-5xl font-extrabold text-primary-700 mb-2 drop-shadow-sm">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* المميزات بتصميم حديث وبطاقات أيقونية أكثر احترافية */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-primary-900 mb-5">
              لماذا تختار مركز رعاية؟
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto font-light">
              نتميز بتقديم خدمات طبية متكاملة تجمع بين الخبرة والتميز والتقنية الحديثة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-lg text-center group hover:shadow-2xl hover:-translate-y-2 transition-all border-t-4 hover:border-primary-600 border-transparent"
                >
                  <div className="flex justify-center mb-6">
                    <span className="inline-flex items-center justify-center rounded-full bg-primary-50 group-hover:bg-primary-100 transition-all duration-200 p-4 shadow">
                      <IconComponent className="w-12 h-12 text-primary-600" />
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-all">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed font-light">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* قسم الأطباء مع نمط حديث وكاروسيل باستخدام Swiper */}
      {!loadingDoctors && doctors.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-white via-primary-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-primary-900 mb-4 drop-shadow-sm">
                فريقنا الطبي المتميز
              </h2>
              <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto font-light">
                تعرف على أطبائنا المتخصصين الذين يقدمون أفضل رعاية صحية
              </p>
            </div>
            <div className="relative group">
              {/* Swiper Carousel */}
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                slidesPerView={1}
                spaceBetween={20}
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 24 },
                  1024: { slidesPerView: 3, spaceBetween: 32 },
                  1280: { slidesPerView: 4, spaceBetween: 36 },
                }}
                navigation={{
                  prevEl: '.doctors-swiper-prev',
                  nextEl: '.doctors-swiper-next',
                }}
                pagination={{
                  clickable: true,
                  el: '.doctors-swiper-pagination',
                  bulletClass: 'swiper-pagination-bullet custom-dot',
                  bulletActiveClass: 'swiper-pagination-bullet-active custom-dot-active',
                }}
                autoplay={{
                  delay: 3200,
                  disableOnInteraction: false,
                }}
                loop={doctors.length > 4}
                className="mySwiper"
              >
                {/* Navigation Buttons */}
                <button
                  className="doctors-swiper-prev absolute top-1/2 right-4 -translate-y-1/2 z-20 bg-white/90 group-hover:bg-primary-100/90 hover:bg-primary-200 transition-all duration-200 rounded-full shadow-xl border-2 border-primary-100 p-2 flex items-center justify-center"
                  aria-label="السابق"
                  style={{ boxShadow: "0 6px 20px 0 rgba(60, 100, 150, 0.15)" }}
                  type="button"
                  tabIndex={0}
                >
                  <ChevronRightIcon className="w-7 h-7 text-yellow-400" />
                </button>
                <button
                  className="doctors-swiper-next absolute top-1/2 left-4 -translate-y-1/2 z-20 bg-white/90 group-hover:bg-primary-100/90 hover:bg-primary-200 transition-all duration-200 rounded-full shadow-xl border-2 border-primary-100 p-2 flex items-center justify-center"
                  aria-label="التالي"
                  style={{ boxShadow: "0 6px 20px 0 rgba(60, 100, 150, 0.15)" }}
                  type="button"
                  tabIndex={0}
                >
                  <ChevronLeftIcon className="w-7 h-7 text-yellow-400" />
                </button>

                {doctors.map((doctor) => (
                  <SwiperSlide key={doctor._id}>
                    <div className="flex flex-col h-full bg-white shadow-xl hover:shadow-2xl rounded-2xl border border-primary-100 transition-all duration-300 overflow-hidden group/card mx-0">
                      {/* صورة الطبيب */}
                      <div className="relative flex items-center justify-center h-48 bg-gradient-to-tr from-primary-50 via-primary-100 to-white">
                        {doctor.profileImage ? (
                          <img
                            src={`http://localhost:5000/${doctor.profileImage}`}
                            alt={doctor.name}
                            className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg mx-auto my-6 ring-4 ring-yellow-300 group-hover/card:ring-primary-500 transition-all duration-200"
                          />
                        ) : (
                          <div className="w-28 h-28 bg-primary-200 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                            <UserIcon className="w-14 h-14 text-primary-700" />
                          </div>
                        )}
                        <div className="absolute left-4 top-4 px-3 py-1.5 rounded-full bg-yellow-400 text-xs text-primary-900 font-bold shadow-md hidden md:block group-hover/card:scale-110 transition-all">
                          ⭐ طبيب متميز
                        </div>
                      </div>

                      {/* معلومات الطبيب */}
                      <div className="flex-1 flex flex-col justify-between p-5 md:p-6 text-center">
                        <div>
                          <h3 className="text-lg md:text-xl font-extrabold text-primary-900 mb-1">
                            {doctor.name}
                          </h3>
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <AcademicCapIcon className="w-5 h-5 text-primary-600" />
                            <p className="text-primary-600 text-sm font-medium">
                              {doctor.specialization?.name || 'بدون تخصص'}
                            </p>
                          </div>
                          {doctor.phone && (
                            <div className="flex items-center justify-center gap-2 mb-2 text-primary-400">
                              <PhoneIcon className="w-4 h-4" />
                              <span className="text-xs">{doctor.phone}</span>
                            </div>
                          )}
                          {doctor.availability && doctor.availability.length > 0 && (
                            <div className="flex items-center justify-center gap-2 text-primary-400 mb-2">
                              <ClockIcon className="w-4 h-4" />
                              <span className="text-xs">
                                {doctor.availability.length} يوم عمل
                              </span>
                            </div>
                          )}
                        </div>
                        <Link
                          to="/doctors"
                          className="block w-full mt-5 rounded-lg bg-gradient-to-r from-primary-700 to-primary-900 text-white font-bold text-base py-2.5 shadow hover:bg-primary-800 hover:from-primary-800 hover:to-primary-900 transition-colors"
                        >
                          عرض الملف الشخصي
                        </Link>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
                {/* Pagination */}
                <div className="doctors-swiper-pagination flex justify-center gap-3 mt-8 pb-0" />
              </Swiper>
              {/* Swiper custom styles for bullet */}
              <style>
                {`
                  .custom-dot {
                    width: 0.75rem;
                    height: 0.625rem;
                    background: #dbeafe;
                    border-radius: 9999px;
                    margin: 0 4px;
                    transition: all 0.2s;
                    display: inline-block;
                  }
                  .custom-dot-active {
                    background: #194185;
                    width: 2rem;
                    box-shadow: 0 2px 10px 0 rgba(25,65,133,0.22);
                    transform: scale(1.12);
                  }
                `}
              </style>
            </div>

            <div className="text-center mt-12">
              <Link
                to="/doctors"
                className="group inline-block bg-yellow-400 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 hover:from-primary-900 hover:to-primary-700 hover:text-yellow-300 text-primary-900 px-12 py-4 rounded-2xl text-2xl font-extrabold shadow-xl shadow-yellow-200/40 border border-yellow-400 hover:border-primary-700 transition-all duration-200 ring-1 ring-yellow-100 hover:ring-primary-700/40 focus:outline-none focus:ring-4 focus:ring-yellow-300/40"
                style={{
                  letterSpacing: '0.035em',
                  boxShadow: '0 6px 28px 0 rgba(255,215,85,0.16), 0 2px 10px 0 rgba(25,65,133,0.08)'
                }}
              >
                <span className="inline-flex items-center gap-3">
                  <span style={{ textShadow: '0 1.5px 8px #fff6,0 1.5px 10px #f8d46455' }}>
                    عرض جميع الأطباء
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* دعوة للعمل (CTA) مع تعزيز العناصر البصرية */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            مستعد لبدء رحلتك الصحية؟
          </h2>
          <p className="text-xl mb-8 opacity-90 text-white">
            انضم إلى آلاف المرضى الذين يثقون بخدماتنا الطبية المتميزة
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-yellow-400 hover:bg-transparent border-2 border-yellow-400 hover:border-white hover:text-white text-primary-900 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              إنشاء حساب جديد
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white hover:bg-yellow-400 hover:text-primary-900 hover:border-yellow-400 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-color"
            >
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;