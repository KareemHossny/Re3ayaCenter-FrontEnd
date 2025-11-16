import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartIcon,
  UserIcon,
  ScissorsIcon,
  EyeIcon,
  CpuChipIcon,
  BuildingOfficeIcon,
  BeakerIcon,
  CameraIcon,
  TrophyIcon,
  AcademicCapIcon,
  ComputerDesktopIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Services = () => {
  const medicalServices = [
    {
      icon: HeartIcon,
      title: 'طب القلب والأوعية الدموية',
      description: 'تشخيص وعلاج أمراض القلب والشرايين بأحدث التقنيات',
      features: ['قسطرة قلبية', 'فحوصات إيكو', 'متابعة ضغط الدم']
    },
    {
      icon: UserIcon,
      title: 'طب الأطفال',
      description: 'رعاية شاملة للأطفال من الولادة حتى المراهقة',
      features: ['تطعيمات', 'متابعة النمو', 'رعاية حديثي الولادة']
    },
    {
      icon: ScissorsIcon,
      title: 'جراحة العظام',
      description: 'علاج إصابات وأمراض الجهاز العضلي الهيكلي',
      features: ['جراحات المفاصل', 'علاج الكسور', 'عمليات العمود الفقري']
    },
    {
      icon: EyeIcon,
      title: 'طب العيون',
      description: 'رعاية شاملة لصحة العين والإبصار',
      features: ['فحوصات النظر', 'جراحات الساد', 'علاج أمراض الشبكية']
    },
    {
      icon: ScissorsIcon,
      title: 'طب الأسنان',
      description: 'خدمات طب الأسنان الشاملة للعائلة',
      features: ['حشوات وعلاج جذور', 'تركيبات الأسنان', 'تقويم الأسنان']
    },
    {
      icon: CpuChipIcon,
      title: 'طب الأعصاب',
      description: 'تشخيص وعلاج أمراض الجهاز العصبي',
      features: ['علاج الصداع', 'رعاية مرضى السكتة', 'تخطيط الأعصاب']
    }
  ];

  const supportServices = [
    {
      icon: BuildingOfficeIcon,
      title: 'طوارئ 24 ساعة',
      description: 'خدمة طوارئ متاحة على مدار الساعة لجميع الحالات الطارئة'
    },
    {
      icon: BeakerIcon,
      title: 'المختبرات',
      description: 'مختبرات مجهزة بأحدث الأجهزة للتحاليل الدقيقة'
    },
    {
      icon: CameraIcon,
      title: 'الأشعة والتشخيص',
      description: 'أقسام الأشعة المتكاملة بأحدث أجهزة التصوير الطبي'
    },
    {
      icon: BeakerIcon,
      title: 'الصيدلية',
      description: 'صيدلية داخلية توفر جميع الأدوية والوصفات الطبية'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* الهيرو */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-yellow-300 drop-shadow-[0_2px_12px_rgba(250,200,50,0.3)]">خدماتنا الطبية</h1>
            <p className="text-xl md:text-2xl mb-8 font-arabic">
              "نحن نرعاك والله يشفيك"
            </p>
            <p className="text-lg max-w-3xl mx-auto leading-relaxed">
              نقدم مجموعة شاملة من الخدمات الطبية المتخصصة التي تغطي جميع احتياجاتكم الصحية، 
              من خلال فريق طبي متميز وتقنيات حديثة في بيئة علاجية متكاملة.
            </p>
          </div>
        </div>
      </section>

      {/* الخدمات الطبية الرئيسية */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-primary-900 mb-4 drop-shadow-sm">الخدمات الطبية المتخصصة</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              اكتشف مجموعة الخدمات الطبية الشاملة التي نقدمها بأعلى معايير الجودة
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {medicalServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-primary-50/70 via-white to-primary-100/60 border border-primary-100 shadow-lg hover:shadow-2xl transition-all rounded-2xl p-8 relative overflow-visible group hover:-translate-y-1"
                >
                  {/* Decorative Glow Ring */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-0 w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-300/30 via-primary-200/20 to-yellow-200/20 blur-2xl opacity-70 pointer-events-none"></div>
                  {/* Icon Circle */}
                  <div className="flex justify-center mb-6 relative z-10">
                    <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-100 via-primary-100 to-white shadow-lg group-hover:scale-110 transition-transform p-4 border-2 border-primary-200/40">
                      <IconComponent className="w-12 h-12 text-primary-700" />
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-primary-900 mb-2 drop-shadow-sm group-hover:text-yellow-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-700 mb-5 leading-relaxed font-light text-base min-h-[56px]">
                    {service.description}
                  </p>
                  {service.features && service.features.length > 0 && (
                    <ul className="space-y-2 mb-4">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-600 font-medium">
                          <span className="text-green-500 ml-2">✔</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-4 flex justify-center">
                    <Link
                      to="/doctors"
                      className="inline-flex items-center gap-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow group-hover:from-yellow-400 group-hover:to-yellow-500 group-hover:text-primary-900 transition-all"
                    >
                      <span>تعرف على أطباء هذا التخصص</span>
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* زر الانتقال إلى جميع التخصصات */}
          <div className="flex justify-center mt-16">
            <Link
              to="/specializations"
              className="group inline-block bg-yellow-400 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 hover:from-primary-900 hover:to-primary-700 hover:text-yellow-300 text-primary-900 px-12 py-4 rounded-2xl text-2xl font-extrabold shadow-xl shadow-yellow-200/40 border border-yellow-400 hover:border-primary-700 transition-all duration-200 ring-1 ring-yellow-100 hover:ring-primary-700/40 focus:outline-none focus:ring-4 focus:ring-yellow-300/40"
              style={{
                letterSpacing: '0.035em',
                boxShadow: '0 6px 28px 0 rgba(255,215,85,0.16), 0 2px 10px 0 rgba(25,65,133,0.08)'
              }}
            >
              <span className="inline-flex items-center gap-3">
                <span style={{ textShadow: '0 1.5px 8px #fff6,0 1.5px 10px #f8d46455' }}>
                  تصفح جميع التخصصات
                </span>
              </span>
            </Link>
          </div>
          
        </div>
      </section>

      {/* خدمات الدعم */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-primary-900 mb-5">خدمات الدعم والرعاية</h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto font-light">
              خدمات متكاملة تدعم الرعاية الطبية الرئيسية وتضمن تجربة علاجية شاملة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportServices.map((service, index) => {
              const IconComponent = service.icon;
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
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed font-light text-sm md:text-base">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* مزايا إضافية */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Why Choose Us */}
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-primary-900 mb-7 drop-shadow-sm">
                لماذا تختار خدماتنا؟
              </h2>
              <div className="space-y-7">
                {/* Feature 1 */}
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-primary-100 shadow-md rounded-full flex items-center justify-center flex-shrink-0">
                    <TrophyIcon className="w-7 h-7 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">جودة معتمدة</h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      جميع خدماتنا معتمدة محلياً ودولياً وتتبع أعلى معايير الجودة والسلامة.
                    </p>
                  </div>
                </div>
                {/* Feature 2 */}
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-green-100 shadow-md rounded-full flex items-center justify-center flex-shrink-0">
                    <AcademicCapIcon className="w-7 h-7 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">خبراء متخصصون</h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      فريق طبي من الاستشاريين والأخصائيين ذوي الخبرة الواسعة في تخصصاتهم.
                    </p>
                  </div>
                </div>
                {/* Feature 3 */}
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-blue-100 shadow-md rounded-full flex items-center justify-center flex-shrink-0">
                    <ComputerDesktopIcon className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">تقنيات متطورة</h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      نستخدم أحدث الأجهزة والتقنيات الطبية لتشخيص وعلاج دقيق وفعال.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Services Inquiry */}
            <div className="bg-gradient-to-br from-primary-50 via-white to-primary-100 rounded-3xl shadow-lg p-10 border border-primary-100">
              <h3 className="text-3xl font-extrabold text-primary-900 mb-5 tracking-tight">
                استفسارات الخدمات
              </h3>
              <p className="text-primary-800 mb-8 text-lg leading-relaxed">
                لديك استفسار عن خدمة معينة أو تريد معرفة المزيد عن تفاصيل العلاج؟
                <br />
                فريقنا الطبي جاهز للإجابة على جميع استفساراتكم.
              </p>
              <div className="space-y-5">
                <div className="flex items-center text-primary-800 text-base font-semibold">
                  <span className="bg-primary-200 p-2 rounded-lg mr-2 flex items-center justify-center">
                    <PhoneIcon className="w-6 h-6 text-primary-600" />
                  </span>
                  <span dir="ltr" className="select-all">0123456789</span>
                </div>
                <div className="flex items-center text-primary-800 text-base font-semibold">
                  <span className="bg-primary-200 p-2 rounded-lg mr-2 flex items-center justify-center">
                    <EnvelopeIcon className="w-6 h-6 text-primary-600" />
                  </span>
                  <span dir="ltr">services@hospital.com</span>
                </div>
                <div className="flex items-center text-primary-800 text-base font-semibold">
                  <span className="bg-primary-200 p-2 rounded-lg mr-2 flex items-center justify-center">
                    <ClockIcon className="w-6 h-6 text-primary-600" />
                  </span>
                  <span>خدمة العملاء: <b>24/7</b></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* دعوة للعمل */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            مستعد لبدء رحلتك العلاجية؟
          </h2>
          <p className="text-xl mb-8 opacity-90">
            اختر الخدمة التي تحتاجها وسنساعدك في الحصول على أفضل رعاية طبية
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/doctors"
              className="bg-yellow-400 hover:bg-transparent border-2 border-yellow-400 hover:border-white hover:text-white text-primary-900 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              احجز موعد الآن
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white hover:bg-yellow-400 hover:text-primary-900 hover:border-yellow-400 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              استفسر عن خدمة
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;