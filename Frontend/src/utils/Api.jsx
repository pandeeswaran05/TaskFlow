import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend-0cyi.onrender.com',
  headers: { 'Content-Type': 'application/json' },
});

// 🔐 Attach JWT token
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('sh_token') || sessionStorage.getItem('sh_token');

  if (token) config.headers['Authorization'] = `Bearer ${token}`;

  return config;
});

// 🚨 Auto logout on unauthorized
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (
      err.response?.status === 401 &&
      !err.config.url.includes('/auth/')
    ) {
      localStorage.removeItem('sh_token');
      localStorage.removeItem('sh_user');
      sessionStorage.removeItem('sh_token');
      sessionStorage.removeItem('sh_user');
      window.location.reload();
    }
    return Promise.reject(err);
  }
);

// ── Auth ──
export const loginAPI = (email, password) =>
  api.post('/auth/login', { email, password });

export const signupAPI = (data) =>
  api.post('/auth/signup', data);

// ── Users ──
export const getProfileAPI = () => api.get('/users/me');
export const updateProfileAPI = (data) =>
  api.put('/users/profile', data);

export const changePasswordAPI = (data) =>
  api.put('/users/password', data);

export const getSettingsAPI = () =>
  api.get('/users/settings');

export const updateSettingsAPI = (data) =>
  api.put('/users/settings', data);

export const deleteAccountAPI = () =>
  api.delete('/users/account');

// ── Tasks (UPDATED) ──

// 📥 Get all tasks (with filters)
export const getTasksAPI = (params = {}) =>
  api.get('/tasks', { params });

// ➕ Create task
export const createTaskAPI = (data) =>
  api.post('/tasks', data);

// ✏️ Update task
export const updateTaskAPI = (id, data) =>
  api.put(`/tasks/${id}`, data);

// ❌ Delete task
export const deleteTaskAPI = (id) =>
  api.delete(`/tasks/${id}`);

export default api;
