import React from 'react';
import { Link } from 'react-router-dom';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'عن المركز', path: '/about' },
    { name: 'الخدمات', path: '/services' },
    { name: 'الأطباء', path: '/doctors' },
    { name: 'التخصصات', path: '/specializations' },
    { name: 'اتصل بنا', path: '/contact' }
  ];

  const services = [
    'طب القلب',
    'طب الأطفال',
    'جراحة العظام',
    'طب العيون',
    'طب الأسنان',
    'الطوارئ'
  ];

  // Social links data for more maintainability & valid hrefs
  const socialLinks = [
    {
      href: 'https://facebook.com',
      label: 'فيسبوك',
      icon: (
        <svg fill="currentColor" className="w-5 h-5 text-gray-400 hover:text-primary-400 transition-colors" viewBox="0 0 24 24">
          <path d="M17 2.1h-2.8C11.7 2.1 10 3.6 10 6.1v1.9H7.5A.48.48 0 0 0 7 8.5v2.6c0 .27.22.49.5.49H10v6c0 .27.23.5.51.5h2.63c.28 0 .5-.22.5-.5v-6h1.94c.26 0 .46-.18.49-.44l.3-2.6a.48.48 0 0 0-.12-.39.5.5 0 0 0-.37-.16H13.6V6.41c0-.32.13-.51.53-.51h1.81c.27 0 .49-.23.49-.5V2.6a.49.49 0 0 0-.43-.5Z"/>
        </svg>
      ),
    },
    {
      href: 'https://twitter.com',
      label: 'تويتر',
      icon: (
        <svg fill="currentColor" className="w-5 h-5 text-gray-400 hover:text-primary-400 transition-colors" viewBox="0 0 1200 1227">
          <path d="M1200 24.6 740.6 628.6l458.7 574.6H949.2L608.6 788.7 232.2 1203.2H0l480.6-601.7L36.8 24.6h252.1l296.4 361.4L936.6 24.6H1200ZM885.3 1092.5h107.2L319.6 134.7h-115l680.7 957.8Z" />
        </svg>
      ),
    },
    {
      href: 'https://instagram.com',
      label: 'انستغرام',
      icon: (
        <svg fill="none" stroke="currentColor" className="w-5 h-5 text-gray-400 hover:text-primary-400 transition-colors" viewBox="0 0 24 24">
          <rect width="18" height="18" x="3" y="3" rx="5" strokeWidth="2"/>
          <circle cx="12" cy="12" r="4" strokeWidth="2"/>
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
        </svg>
      ),
    }
  ];

  // Legal/policy links with valid placeholder hrefs
  const legalLinks = [
    {
      name: 'سياسة الخصوصية',
      href: '/privacy-policy'
    },
    {
      name: 'الشروط والأحكام',
      href: '/terms'
    }
  ];

  return (
    <footer className="bg-gradient-to-b from-primary-900 via-gray-900 to-gray-950 text-gray-50 shadow-inner font-arabic z-10 relative">
      <div className="max-w-7xl mx-auto py-14 px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* معلومات المركز */}
          <div className="lg:col-span-1 flex flex-col justify-between h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-primary-600 rounded-full flex items-center justify-center shadow-xlg ring-2 ring-primary-700 ring-offset-2 ">
                <img 
                  src="images/Medical-Logo-Graphics-20827447-1-580x386.jpg" 
                  alt="شعار مركز رعاية"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) {
                      e.target.nextSibling.style.display = 'block';
                    }
                  }}
                />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-primary-100 tracking-tight">مركز رعاية</h3>
                <p className="text-primary-300 text-xs mt-1">"نحن نرعاك والله يشفيك"</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-5 mt-2">
              نقدم أفضل الخدمات الطبية برعاية متخصصة وتقنيات حديثة لضمان حصولكم على أفضل رعاية صحية ممكنة.
            </p>
            <div className="flex gap-4">
              {socialLinks.map(({ href, label, icon }, i) => (
                <a 
                  key={label}
                  href={href}
                  className="hover:bg-primary-700 transition p-2 rounded-full"
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* روابط سريعة */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-primary-100 tracking-wide">روابط سريعة</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-primary-400 transition-colors text-base font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* الخدمات */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-primary-100 tracking-wide">الخدمات</h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <span className="inline-flex items-center gap-2 text-gray-300 hover:text-primary-400 cursor-pointer transition-colors text-base">
                    <span className="w-2 h-2 rounded-full bg-primary-400 inline-block" />
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* معلومات الاتصال */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-primary-100 tracking-wide">تواصل معنا</h3>
            <div className="space-y-3 text-base text-gray-300">
              <div className="flex items-center">
                <PhoneIcon className="w-5 h-5 ml-2 text-primary-400" />
                <span dir="ltr" className="font-medium select-all">0123456789</span>
              </div>
              <div className="flex items-center">
                <EnvelopeIcon className="w-5 h-5 ml-2 text-primary-400" />
                <span dir="ltr" className="font-medium">info@hospital.com</span>
              </div>
              <div className="flex items-center">
                <MapPinIcon className="w-5 h-5 ml-2 text-primary-400" />
                <span>المدينة، الحي، الشارع</span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="w-5 h-5 ml-2 text-primary-400" />
                <span>مفتوح 24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* حقوق النشر */}
        <div className="border-t border-gray-800 mt-12 pt-7 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm font-arabic">
            © {currentYear} مركز رعاية. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-7">
            {legalLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-400 hover:text-primary-400 text-sm transition-colors font-arabic"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;