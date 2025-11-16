import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  updateUserRole: (userId, role) => api.put(`/admin/users/${userId}/role`, { role }),
  createSpecialization: (data) => api.post('/admin/specializations', data),
  getStats: () => api.get('/admin/stats'),
};

export const doctorAPI = {
  getProfile: () => api.get('/doctor/profile'),
  updateProfile: (data) => api.put('/doctor/profile', data),
  getAppointments: (params) => api.get('/doctor/appointments', { params }),
  cancelAppointment: (appointmentId, reason) => 
    api.put(`/doctor/appointments/${appointmentId}/cancel`, { cancellationReason: reason }),
  getStats: () => api.get('/doctor/stats'),
  getAvailability: () => api.get('/doctor/availability'),
  updateAvailability: (availability) => api.put('/doctor/availability', { availability }),
   updateSpecialization: (specializationId) => 
    api.put('/doctor/specialization', { specialization: specializationId }),
     getAppointmentDetails: (appointmentId) => 
    api.get(`/doctor/appointments/${appointmentId}`),
  
  completeAppointment: (appointmentId, data) => 
    api.put(`/doctor/appointments/${appointmentId}/complete`, data),
};

export const patientAPI = {
  getDoctors: (params) => api.get('/patient/doctors', { params }),
  getDoctorDetails: (doctorId) => api.get(`/patient/doctors/${doctorId}`),
  getAvailableSlots: (doctorId, date) => 
    api.get(`/patient/available-slots/${doctorId}?date=${date}`),
  bookAppointment: (data) => api.post('/patient/appointments', data),
  getAppointments: (params) => api.get('/patient/appointments', { params }),
  cancelAppointment: (appointmentId, reason) => 
    api.put(`/patient/appointments/${appointmentId}/cancel`, { cancellationReason: reason }),
  getStats: () => api.get('/patient/stats'),
};

export const specializationAPI = {
  getSpecializations: () => api.get('/specializations'),
  updateSpecialization: (specializationId, data) => api.put(`/specializations/${specializationId}`, data),
  deleteSpecialization: (specializationId) => api.delete(`/specializations/${specializationId}`),
};

export const uploadAPI = {
  uploadProfileImage: (formData) => api.post('/upload/profile-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteProfileImage: () => api.delete('/upload/profile-image'),
};

export { publicAPI } from './publicAPI';
export default api;