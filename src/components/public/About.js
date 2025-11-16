import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrophyIcon,
  HeartIcon,
  BeakerIcon,
  UserGroupIcon,
  EyeIcon
} from '@heroicons/react/24/solid';

const values = [
  {
    icon: <TrophyIcon className="w-12 h-12 mx-auto text-primary-600" />,
    title: 'التميز الطبي',
    description: 'نسعى لتحقيق أعلى معايير الجودة في الخدمات الطبية المقدمة',
  },
  {
    icon: <HeartIcon className="w-12 h-12 mx-auto text-red-500" />,
    title: 'رعاية المريض أولاً',
    description: 'نضع صحة ورضا المريض في مقدمة أولوياتنا',
  },
  {
    icon: <BeakerIcon className="w-12 h-12 mx-auto text-green-600" />,
    title: 'التطوير المستمر',
    description: 'نواكب أحدث التطورات الطبية والتقنيات الحديثة',
  },
  {
    icon: <UserGroupIcon className="w-12 h-12 mx-auto text-blue-500" />,
    title: 'العمل بروح الفريق',
    description: 'نعمل كفريق متكامل لتحقيق أفضل النتائج',
  },
];

const About = () => {
  const milestones = [
    { year: '2009', event: 'تأسيس المركز' },
    { year: '2012', event: 'اعتماد المركز من الهيئة الصحية' },
    { year: '2015', event: 'توسعة المركز وإضافة أقسام جديدة' },
    { year: '2018', event: 'الحصول على شهادة الجودة الدولية' },
    { year: '2021', event: 'إطلاق النظام الإلكتروني للحجوزات' },
    { year: '2024', event: 'تطوير قسم الطوارئ والعناية المركزة' }
  ];
  const stats = [
    { number: '50+', label: 'طبيب متخصص' },
    { number: '25+', label: 'تخصص طبي' },
    { number: '3000+', label: 'مريض راضٍ' },
    { number: '15+', label: 'عام من الخبرة' }
  ];
  return (
    <div className="min-h-screen">
      {/* الهيرو */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-yellow-300 drop-shadow-[0_2px_12px_rgba(250,200,50,0.3)]">عن مركز رعاية</h1>
            <p className="text-xl md:text-2xl mb-8 font-arabic">
              "نحن نرعاك والله يشفيك"
            </p>
            <p className="text-lg max-w-3xl mx-auto leading-relaxed">
              منذ تأسيسنا في عام 2009، ونحن نعمل برؤية واضحة لتقديم أفضل الخدمات الطبية 
              التي تجمع بين الخبرة الطبية المتميزة والتقنيات الحديثة، مع الحفاظ على القيم 
              الإنسانية والأخلاق الطبية الراسخة.
            </p>
          </div>
        </div>
      </section>

      {/* رؤيتنا ورسالتنا */}
      <section className="py-24 bg-gradient-to-br from-white via-primary-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* رؤيتنا */}
            <div className="relative bg-white rounded-3xl shadow-lg p-10 group hover:shadow-2xl transition-all overflow-hidden border border-primary-100">
              <div className="absolute left-0 top-0 w-2 h-16 bg-gradient-to-b from-primary-600 to-primary-400 rounded-br-3xl group-hover:h-24 transition-all"></div>
              <div className="flex justify-center mb-6">
                <span className="inline-flex items-center justify-center rounded-full bg-primary-50 group-hover:bg-primary-100 transition-all duration-200 shadow p-5">
                  <EyeIcon className="w-14 h-14 text-primary-600 drop-shadow" />
                </span>
              </div>
              <h2 className="text-3xl font-extrabold text-primary-900 mb-4 tracking-tight drop-shadow-sm">
                رؤيتنا
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg font-light">
                أن يكون المركز الرائد في تقديم الرعاية الصحية المتكاملة على مستوى المنطقة،
                من خلال بناء أفضل الممارسات الطبية والاستثمار في الكوادر البشرية والتقنيات الحديثة،
                لتحقيق أعلى معدلات الرضا للمرضى والتميز في النتائج العلاجية.
              </p>
            </div>

            {/* رسالتنا */}
            <div className="relative bg-white rounded-3xl shadow-lg p-10 group hover:shadow-2xl transition-all overflow-hidden border border-green-100">
              <div className="absolute right-0 top-0 w-2 h-16 bg-gradient-to-b from-green-500 to-green-300 rounded-bl-3xl group-hover:h-24 transition-all"></div>
              <div className="flex justify-center mb-6">
                <span className="inline-flex items-center justify-center rounded-full bg-green-50 group-hover:bg-green-100 transition-all duration-200 shadow p-5">
                  <HeartIcon className="w-14 h-14 text-red-500 drop-shadow" />
                </span>
              </div>
              <h2 className="text-3xl font-extrabold text-green-800 mb-4 tracking-tight drop-shadow-sm">
                رسالتنا
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg font-light">
                تقديم رعاية صحية شاملة ومتميزة من خلال فريق طبي متخصص وبيئة علاجية متطورة،
                مع التركيز على الجودة والسلامة والرعاية المرتكزة حول المريض،
                والإسهام في تطوير المجتمع الصحي من خلال البرامج التوعوية والبحث العلمي.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* قيمنا */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-primary-900 mb-4 drop-shadow-sm">
              قيمنا الأساسية
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto font-light">
              قيم راسخة توجه عملنا اليومي وتشكل هويتنا المؤسسية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-lg text-center group hover:shadow-2xl hover:-translate-y-2 transition-all border-t-4 hover:border-primary-600 border-transparent"
                >
                  <div className="flex justify-center mb-6">
                    <span className="inline-flex items-center justify-center rounded-full bg-primary-50 group-hover:bg-primary-100 transition-all duration-200 p-4 shadow">
                      {/* If value.icon is a React component, render as <IconComponent /> */}
                      {typeof IconComponent === 'function' ? <IconComponent className="w-12 h-12 text-primary-600" /> : IconComponent}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-all">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed font-light">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* محطات تاريخية */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-primary-900 mb-4 drop-shadow-sm">محطات في رحلتنا</h2>
            <p className="text-lg text-gray-600">مسيرة من العطاء والتميز الطبي</p>
          </div>

          <div className="relative">
            {/* الخط الزمني */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-primary-200 h-full"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* المحطة */}
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                      <div className="text-2xl font-bold text-primary-600 mb-2">
                        {milestone.year}
                      </div>
                      <p className="text-gray-700 font-medium">
                        {milestone.event}
                      </p>
                    </div>
                  </div>

                  {/* النقطة على الخط */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* إحصائيات */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gradient-to-br from-primary-100 via-white to-primary-50 p-7 rounded-2xl shadow transition-all hover:scale-105 hover:shadow-lg">
                <div className="text-4xl md:text-5xl font-extrabold text-primary-700 mb-2 drop-shadow-sm">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* دعوة للتواصل */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">نرحب بزيارتكم</h2>
          <p className="text-xl mb-8 opacity-90 text-white">
            نحن هنا لخدمتكم وتقديم أفضل رعاية طبية. لا تتردد في التواصل معنا 
            لمعرفة المزيد عن خدماتنا أو لزيارتنا في المركز.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-yellow-400 hover:bg-transparent border-2 border-yellow-400 hover:border-white hover:text-white text-primary-900 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              تواصل معنا
            </Link>
            <Link
              to="/doctors"
              className="border-2 border-white hover:bg-yellow-400 hover:text-primary-900 hover:border-yellow-400 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-color"
            >
              تعرف على أطبائنا
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;