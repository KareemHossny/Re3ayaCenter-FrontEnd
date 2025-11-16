import React, { useState } from 'react';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  MapIcon
} from '@heroicons/react/24/outline';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // محاكاة إرسال البيانات
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 2000);
  };

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: 'هاتف المركز',
      details: ['0123456789', '0123456790'],
      description: 'متاح 24 ساعة'
    },
    {
      icon: EnvelopeIcon,
      title: 'البريد الإلكتروني',
      details: ['info@hospital.com', 'support@hospital.com'],
      description: 'رد خلال 24 ساعة'
    },
    {
      icon: MapPinIcon,
      title: 'العنوان',
      details: ['المدينة، الحي الرئيسي', 'شارع المستشفى، بجوار المركز التجاري'],
      description: 'مواقف سيارات مجانية'
    },
    {
      icon: ClockIcon,
      title: 'ساعات العمل',
      details: ['السبت - الخميس: 8 صباحاً - 10 مساءً', 'الجمعة: 4 مساءً - 10 مساءً'],
      description: 'طوارئ 24 ساعة'
    }
  ];

  const emergencyContacts = [
    { department: 'الطوارئ', number: '0123456111' },
    { department: 'الإسعاف', number: '0123456222' },
    { department: 'الاستقبال', number: '0123456333' },
    { department: 'المواعيد', number: '0123456444' }
  ];

  return (
    <div className="min-h-screen">
      {/* الهيرو */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-yellow-300 drop-shadow-[0_2px_12px_rgba(250,200,50,0.3)]">اتصل بنا</h1>
            <p className="text-xl md:text-2xl mb-8 font-arabic">
              "نحن نرعاك والله يشفيك"
            </p>
            <p className="text-lg max-w-3xl mx-auto leading-relaxed">
              نحن هنا لمساعدتك والإجابة على جميع استفساراتك. لا تتردد في التواصل معنا 
              عبر أي من قنوات الاتصال المتاحة، فريقنا جاهز لخدمتكم على مدار الساعة.
            </p>
          </div>
        </div>
      </section>

      {/* معلومات الاتصال */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-primary-900 mb-5">
              معلومات التواصل مع مركز رعاية
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto font-light">
              يمكنك التواصل معنا عبر القنوات التالية، يسعد فريقنا بخدمتكم دائماً
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
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
                    {info.title}
                  </h3>
                  <div className="space-y-1 mb-3">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-700 font-medium">
                        {detail}
                      </p>
                    ))}
                  </div>
                  <p className="text-sm text-primary-600">
                    {info.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* أرقام الطوارئ */}
      <section className="py-16 bg-red-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-red-900 mb-2">أرقام الطوارئ</h2>
            <p className="text-red-700">للحالات الطارئة على مدار 24 ساعة</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="bg-white rounded-lg p-4 text-center border-2 border-red-200">
                <div className="text-red-600 font-semibold mb-2">{contact.department}</div>
                <div className="text-lg font-bold text-red-700">{contact.number}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* نموذج الاتصال */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-primary-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-8">
          <div className="bg-white rounded-3xl shadow-2xl p-10 sm:p-12 border border-primary-100">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-primary-900 mb-3 leading-tight drop-shadow-sm">
                أرسل رسالة
              </h2>
              <p className="text-gray-500 text-lg">
                سنرد عليك في أقرب وقت ممكن
              </p>
            </div>

            {submitted ? (
              <div className="text-center py-12">
                <div className="flex justify-center mb-5">
                  <CheckCircleIcon className="w-20 h-20 text-green-500 drop-shadow" />
                </div>
                <h3 className="text-2xl font-bold text-primary-900 mb-3">
                  شكراً لتواصلك معنا
                </h3>
                <p className="text-gray-600 mb-4">
                  تم استلام رسالتك بنجاح.<br />
                  سنتواصل معك في أقرب وقت.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-primary mt-2 px-8 py-3 rounded-lg text-lg font-semibold shadow hover:bg-green-600 hover:text-white focus:outline-primary-500 transition"
                >
                  إرسال رسالة أخرى
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <div>
                    <label className="block text-md font-semibold text-gray-700 mb-2">
                      الاسم الكامل <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input focus:ring-primary-500 focus:border-primary-500 transition"
                      required
                      placeholder="مثال: محمد أحمد"
                    />
                  </div>
                  <div>
                    <label className="block text-md font-semibold text-gray-700 mb-2">
                      البريد الإلكتروني <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input focus:ring-primary-500 focus:border-primary-500 transition"
                      required
                      placeholder="you@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <div>
                    <label className="block text-md font-semibold text-gray-700 mb-2">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input focus:ring-primary-500 focus:border-primary-500 transition"
                      placeholder="01XXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-md font-semibold text-gray-700 mb-2">
                      موضوع الرسالة <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="form-input focus:ring-primary-500 focus:border-primary-500 transition"
                      required
                    >
                      <option value="">اختر الموضوع</option>
                      <option value="استفسار عام">استفسار عام</option>
                      <option value="موعد">حجز موعد</option>
                      <option value="شكوى">شكوى أو اقتراح</option>
                      <option value="تعاون">فرص تعاون</option>
                      <option value="وظائف">التوظيف</option>
                      <option value="آخرى">آخرى</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-md font-semibold text-gray-700 mb-2">
                    الرسالة <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="6"
                    className="form-input focus:ring-primary-500 focus:border-primary-500 transition"
                    placeholder="اكتب رسالتك هنا..."
                    required
                  ></textarea>
                </div>

                <div className="text-center mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`btn-primary px-12 py-3 rounded-lg text-lg font-bold shadow transition-colors ${
                      loading
                        ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                        : "hover:bg-primary-700 hover:text-white"
                    }`}
                  >
                    {loading ? (
                      <span>
                        <span className="animate-spin inline-block mr-2 align-middle">&#9696;</span>
                        جاري الإرسال...
                      </span>
                    ) : (
                      'إرسال الرسالة'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* الخريطة ومعلومات إضافية */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* تفاصيل الوصول وزيارة المستشفى */}
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-primary-900 mb-7 drop-shadow-sm">
                زورونا في المركز
              </h2>
              <div className="space-y-7">
                {/* العنوان */}
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-primary-100 shadow-md rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPinIcon className="w-7 h-7 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">العنوان</h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      المدينة، الحي الرئيسي<br />
                      شارع المستشفى، بجوار المركز التجاري<br />
                      صندوق بريد: 12345
                    </p>
                  </div>
                </div>
                {/* مواقف السيارات */}
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-green-100 shadow-md rounded-full flex items-center justify-center flex-shrink-0">
                    <TruckIcon className="w-7 h-7 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">مواقف السيارات</h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      مواقف مجانية متاحة للمرضى والزوار<br />
                      مواقف خاصة لذوي الاحتياجات الخاصة<br />
                      خدمة Valet parking متاحة
                    </p>
                  </div>
                </div>
                {/* وسائل المواصلات */}
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-blue-100 shadow-md rounded-full flex items-center justify-center flex-shrink-0">
                    <TruckIcon className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">وسائل المواصلات</h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      موقف حافلات أمام المركز<br />
                      سيارات أجرة متاحة 24 ساعة<br />
                      خدمة النقل للمرضى (حسب الحاجة)
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* صندوق الخريطة */}
            <div className="bg-gradient-to-br from-primary-50 via-white to-primary-100 rounded-3xl shadow-lg p-10 border border-primary-100">
              <div className="text-center text-primary-800">
                <div className="flex justify-center mb-4">
                  <MapIcon className="w-16 h-16 text-primary-500" />
                </div>
                <p className="text-2xl font-extrabold mb-1">خريطة الموقع</p>
                <p className="text-primary-700 text-lg mt-2 mb-6">سيتم إضافة الخريطة التفاعلية قريباً</p>
                <a
                  href="https://www.google.com/maps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-7 py-3 rounded-lg bg-gradient-to-r from-primary-500 to-primary-700 text-white font-bold shadow hover:from-primary-600 hover:to-primary-800 hover:scale-105 transition-all duration-150 text-base"
                >
                  <svg className="w-5 h-5 ltr:mr-2 rtl:ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A2 2 0 013 15.382V6a2 2 0 012-2h14a2 2 0 012 2v9.382a2 2 0 01-.553 1.894L15 20m-6 0v-4a2 2 0 012-2h2a2 2 0 012 2v4M7 8h.01M7 12h.01M11 12h2" />
                  </svg>
                  عرض على Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;