import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // التحقق من كلمة المرور
    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      setLoading(false);
      return;
    }

    // التحقق من طول كلمة المرور
    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      setLoading(false);
      return;
    }

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone
    };

    const result = await register(userData);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 via-primary-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-8 border border-gray-100">
        <div>
          <h2 className="text-center text-4xl font-extrabold text-primary-700 tracking-tight drop-shadow-sm">
            إنشاء حساب جديد
          </h2>
          <p className="mt-3 text-center text-base text-gray-500">
            لديك حساب بالفعل؟{' '}
            <Link
              to="/login"
              className="font-semibold text-primary-600 hover:text-primary-500 transition-colors duration-200"
            >
              تسجيل الدخول
            </Link>
          </p>
        </div>
        <form className="space-y-6 mt-6 relative" onSubmit={handleSubmit} autoComplete="off">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm text-center shadow-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                الاسم الكامل
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="form-input block w-full rounded-xl border-gray-200 shadow-sm focus:ring-primary-500 focus:border-primary-500 transition"
                placeholder="أدخل اسمك الكامل"
                value={formData.name}
                onChange={handleChange}
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="form-input block w-full rounded-xl border-gray-200 shadow-sm focus:ring-primary-500 focus:border-primary-500 transition"
                placeholder="أدخل بريدك الإلكتروني"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                رقم الهاتف <span className="text-gray-400">(اختياري)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="form-input block w-full rounded-xl border-gray-200 shadow-sm focus:ring-primary-500 focus:border-primary-500 transition"
                placeholder="أدخل رقم هاتفك"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                كلمة المرور
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="form-input block w-full rounded-xl border-gray-200 shadow-sm focus:ring-primary-500 focus:border-primary-500 transition"
                placeholder="كلمة المرور (6 أحرف على الأقل)"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                تأكيد كلمة المرور
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="form-input block w-full rounded-xl border-gray-200 shadow-sm focus:ring-primary-500 focus:border-primary-500 transition"
                placeholder="أعد إدخال كلمة المرور"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              disabled={loading}
              className={`btn-primary w-full py-3 rounded-xl text-base font-bold transition-all duration-200 flex items-center justify-center ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              {loading ? <LoadingSpinner size="sm" /> : 'إنشاء الحساب'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;