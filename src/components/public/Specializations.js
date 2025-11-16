import React, { useState, useEffect } from 'react';
import { publicAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { Link } from 'react-router-dom';
import {
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

// Images for specializations (make sure these paths/images exist)
const specializationImages = {
  'القلب والأوعية الدموية': '/images/OIP.webp',
  'أطفال': '/images/male-doctor-gently-cradles-baby-his-lap-while-providing-tender-care-support-pediatrician-playing-with-child-ai-generated_585735-10327.avif',
  'جراحة العظام': '/images/OIP (1).webp',
  'عيون': '/images/download.webp',
  'أسنان': '/images/R.jpg',
  'مخ وأعصاب': '/images/Neurology.avif',
  'الجراحة العامة': '/images/download (2).webp',
  'نساء والتوليد': '/images/OIP (2).webp',
  'جلدية': '/images/OIP (5).webp',
  'باطنة': '/images/OIP (3).webp',
  'أنف وأذن وحنجره': '/images/download (1).webp',
  'الجهاز الهضمي': '/images/OIP (4).webp'
};
const defaultSpecializationImage = '/images/istockphoto-1409442714-612x612.jpg';

const Specializations = () => {
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSpecializations();
  }, []);

  const fetchSpecializations = async () => {
    try {
      const response = await publicAPI.getSpecializations();
      setSpecializations(response.data);
    } catch (error) {
      console.error('Error fetching specializations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSpecializations = specializations.filter(spec =>
    spec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (spec.description && spec.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Return the image path for a specialization name
  const getSpecializationImage = (specializationName) => {
    return specializationImages[specializationName] || defaultSpecializationImage;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* الهيرو */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-yellow-300 drop-shadow-[0_2px_12px_rgba(250,200,50,0.3)]">التخصصات الطبية</h1>
            <p className="text-xl md:text-2xl mb-8 font-arabic">
              "نحن نرعاك والله يشفيك"
            </p>
            <p className="text-lg max-w-3xl mx-auto leading-relaxed">
              اكتشف مجموعة التخصصات الطبية الشاملة التي نقدمها، حيث يمتلك كل تخصص فريقاً 
              طبياً متخصصاً وأجهزة متطورة لتقديم أفضل رعاية طبية ممكنة.
            </p>
          </div>
        </div>
      </section>

      {/* البحث */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-black text-primary-900 mb-4 drop-shadow-sm">ابحث عن التخصص المناسب</h2>
            <p className="text-gray-600">
              ابحث بالاسم أو الوصف للعثور على التخصص الطبي الذي تبحث عنه
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="ابحث عن تخصص طبي..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input text-lg py-3"
            />
          </div>
        </div>
      </section>

      {/* قائمة التخصصات */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-primary-900 mb-2 tracking-tight drop-shadow-sm">
              تخصصاتنا الطبية المتنوعة
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-light">
              نحن نغطي جميع التخصصات الطبية الهامة لتلبية كافة احتياجاتكم الصحية، مع خبراء في كل مجال.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredSpecializations.map((specialization) => (
              <div
                key={specialization._id}
                className="relative bg-white rounded-2xl shadow-xl group overflow-hidden border border-primary-100 hover:border-primary-500 hover:shadow-2xl hover:scale-105 transition-all duration-200"
              >
                <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-primary-200 to-primary-100 group-hover:from-primary-600 group-hover:to-primary-400 transition-all" />
                <div className="flex flex-col items-center p-0">
                  <div className="mb-4 w-full h-44 flex-shrink-0">
                    <img
                      src={getSpecializationImage(specialization.name)}
                      alt={specialization.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-7 w-full flex flex-col items-center">
                    <h3 className="text-2xl font-extrabold text-primary-900 mb-2 group-hover:text-primary-700 transition-all">
                      {specialization.name}
                    </h3>
                    {specialization.description && (
                      <p className="text-gray-600 text-center mb-5 px-2 leading-relaxed font-light">
                        {specialization.description}
                      </p>
                    )}
                    <Link
                      to="/doctors"
                      className="mt-4 inline-flex items-center justify-center gap-2 px-7 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-700 text-white font-bold shadow hover:from-primary-600 hover:to-primary-800 hover:scale-105 transition-all duration-150 text-base"
                    >
                      <span>عرض الأطباء المتخصصين</span>
                      <svg className="w-5 h-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSpecializations.length === 0 && (
            <div className="text-center py-16">
              <div className="flex justify-center mb-4">
                <MagnifyingGlassIcon className="w-20 h-20 text-primary-200" />
              </div>
              <h3 className="text-2xl font-bold text-primary-800 mb-3">
                لا توجد نتائج
              </h3>
              <p className="text-primary-700 text-lg">
                {searchTerm 
                  ? 'لم نجد تخصصات تطابق بحثك. حاول كلمات بحث أخرى أو تأكد من صحة الكتابة.'
                  : 'لا توجد تخصصات متاحة حالياً، يرجى المحاولة لاحقاً.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* معلومات إضافية */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* أسباب اختيار التخصص الصحيح */}
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-primary-900 mb-7 drop-shadow-sm">
                لماذا من المهم اختيار التخصص الطبي المناسب؟
              </h2>
              <div className="space-y-7">
                {/* خطوة 1 */}
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-primary-100 shadow-md rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-primary-600">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">معرفة حالتك الصحية بدقة</h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      تحديد الأعراض بدقة يساعدك في الوصول إلى التخصص الأنسب لعلاج حالتك بكفاءة.
                    </p>
                  </div>
                </div>
                {/* خطوة 2 */}
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-green-100 shadow-md rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-green-600">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">استشارة المختصين</h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      استشر طبيب الأسرة أو الاستقبال الطبي ليتم توجيهك بشكل سليم.
                    </p>
                  </div>
                </div>
                {/* خطوة 3 */}
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-blue-100 shadow-md rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-blue-600">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">اختيار الطبيب المناسب</h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      بعد تحديد التخصص، اختر من بين نخبة الأطباء المعتمدين لضمان نتائج أفضل لعلاجك.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* صندوق استفسار ومساعدة */}
            <div className="bg-gradient-to-br from-primary-50 via-white to-primary-100 rounded-3xl shadow-lg p-10 border border-primary-100">
              <h3 className="text-3xl font-extrabold text-primary-900 mb-5 tracking-tight">
                تحتاج مساعدة في اختيار التخصص؟
              </h3>
              <p className="text-primary-800 mb-8 text-lg leading-relaxed">
                فريقنا الطبي مستعد لتقديم الدعم لمساعدتك في تحديد التخصص الأنسب لحالتك الصحية والإجابة على جميع استفساراتك.
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
                    <ChatBubbleLeftRightIcon className="w-6 h-6 text-primary-600" />
                  </span>
                  <span>استشارة طبية مجانية</span>
                </div>
                <div className="flex items-center text-primary-800 text-base font-semibold">
                  <span className="bg-primary-200 p-2 rounded-lg mr-2 flex items-center justify-center">
                    <ClockIcon className="w-6 h-6 text-primary-600" />
                  </span>
                  <span>خدمة الاستقبال: <b>24/7</b></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* دعوة للعمل */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">وجدت التخصص المناسب؟</h2>
          <p className="text-xl mb-8 opacity-90 text-white">
            اختر التخصص الطبي المناسب لحالتك وابدأ رحلتك نحو صحة أفضل مع فريقنا المتخصص
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/doctors"
              className="bg-yellow-400 hover:bg-transparent border-2 border-yellow-400 hover:border-white hover:text-white text-primary-900 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              عرض الأطباء المتخصصين
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white hover:bg-yellow-400 hover:text-primary-900 hover:border-yellow-400 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-color"
            >
              استشارة طبية
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Specializations;