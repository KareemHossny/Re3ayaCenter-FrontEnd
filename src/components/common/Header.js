import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheckIcon , UserIcon} from "@heroicons/react/24/outline"

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // نجيب اللينك الحالي
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleText = (role) => {
    const roles = {
      patient: 'مريض',
      doctor: 'طبيب',
      admin: 'مدير'
    };
    return roles[role] || role;
  };

  // اللينكات الأساسية في الهيدر
  const navLinks = [
    { to: '/', label: 'الرئيسية', exact: true },
    { to: '/about', label: 'عن المركز' },
    { to: '/services', label: 'الخدمات' },
    { to: '/doctors', label: 'الأطباء' },
    { to: '/specializations', label: 'التخصصات' },
    { to: '/contact', label: 'اتصل بنا' },
  ];

  // لو أنت في نفس اللينك, خليه مميز بلون ور سبان أو بوردر
  const getNavLinkClass = (to, exact = false) => {
    const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);
    return (
      (isActive
        ? 'text-primary-700 border-b-4 border-primary-700 font-bold rounded'
        : 'text-gray-700 hover:text-primary-600 ')
      + 'font-medium transition-colors duration-200 px-1 pb-0.5'
    );
  };

  return (
    <header className="bg-white sticky top-0 shadow-lg z-[9999]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* الشعار واسم المركز */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <Link to="/" className="flex items-center space-x-3 space-x-reverse">
              <div className="w-12 h-12 rounded-full flex items-center justify-center ">
                <img 
                  src="images\Medical-Logo-Graphics-20827447-1-580x386.jpg" 
                  alt="شعار مركز رعاية"
                  className="w-full h-full rounded-full object-cover shadow-xlg ring-1 ring-primary-00 ring-offset-2"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <span className="text-white font-bold text-lg hidden">🏥</span>
              </div>
              <div className="text-right">
                <h1 className="text-xl font-bold text-gray-900">مركز رعاية</h1>
                <p className="text-sm text-primary-600 font-arabic">نحن نرعاك والله يشفيك</p>
              </div>
            </Link>
          </div>

          {/* قائمة التنقل - تظهر للجميع */}
          <nav className="hidden lg:flex items-center space-x-8 space-x-reverse">
            {navLinks.map(({ to, label, exact }) => (
              <Link
                key={to}
                to={to}
                className={getNavLinkClass(to, exact)}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* الجزء الأيمن (المستخدم أو تسجيل الدخول) */}
          <div className="hidden lg:flex items-center space-x-4 space-x-reverse">
            {user ? (
              <>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{getRoleText(user.role)}</p>
                  </div>
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    {user.role === 'doctor' ? '🥼' : 
                     user.role === 'admin' ? <ShieldCheckIcon class="h-6 w-6 text-gray-500" /> : <UserIcon class="h-6 w-6 text-gray-500" />}
                  </div>
                </div>
                <div className="flex space-x-2 space-x-reverse">
                  <Link
                    to="/dashboard"
                    className={
                      location.pathname.startsWith('/dashboard')
                        ? "bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                        : "bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    }
                  >
                    لوحة التحكم
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                  >
                    تسجيل الخروج
                  </button>
                </div>
              </>
            ) : (
              <div className="flex space-x-3 space-x-reverse">
                <Link
                  to="/login"
                  className={location.pathname === '/login'
                    ? "text-primary-700 border-b-2 border-primary-700 font-bold  px-1 pb-0.5"
                    : "text-gray-700 hover:text-primary-600 font-medium"}
                >
                  تسجيل الدخول
                </Link>
                <Link
                  to="/register"
                  className={location.pathname === '/register'
                    ? "bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                    : "bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"}
                >
                  إنشاء حساب
                </Link>
              </div>
            )}
          </div>
          {/* زر القائمة للموبايل */}
          <button
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="text-2xl">☰</span>
          </button>
        </div>

        {/* القائمة المتنقلة للموبايل */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              {navLinks.map(({ to, label, exact }) => (
                <Link
                  key={to}
                  to={to}
                  className={getNavLinkClass(to, exact)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
              {user && (
                <>
                  <Link
                    to="/dashboard"
                    className={
                      location.pathname.startsWith('/dashboard')
                        ? "text-primary-700 border-b-2 border-primary-700 font-bold  px-1 pb-0.5"
                        : "text-gray-700 hover:text-primary-600 font-medium"
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    لوحة التحكم
                  </Link>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="text-right text-gray-700 hover:text-primary-600 font-medium"
                  >
                    تسجيل الخروج
                  </button>
                </>
              )}
              {!user && (
                <>
                  <Link
                    to="/login"
                    className={location.pathname === '/login'
                      ? "text-primary-700 border-b-2 border-primary-700 font-bold px-1 pb-0.5"
                      : "text-gray-700 hover:text-primary-600 font-medium"}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    to="/register"
                    className={location.pathname === '/register'
                      ? "bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                      : "bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    إنشاء حساب
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;