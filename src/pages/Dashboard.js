import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../components/admin/AdminDashboard';
import DoctorDashboard from '../components/doctor/DoctorDashboard';
import PatientDashboard from '../components/patient/PatientDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'doctor':
        return <DoctorDashboard />;
      case 'patient':
        return <PatientDashboard />;
      default:
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">لا يوجد صلاحيات</h1>
              <p className="text-gray-600 mt-2">لا تملك صلاحيات للوصول إلى هذه الصفحة</p>
            </div>
          </div>
        );
    }
  };

  return renderDashboard();
};

export default Dashboard;