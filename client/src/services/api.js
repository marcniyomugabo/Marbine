import axios from 'axios';

const publicAxios = axios.create({ baseURL: '/api' });

const authAxios = axios.create({ baseURL: '/api' });

authAxios.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const loginAPI = {
  register: (data) => publicAxios.post('/auth/register', data),
  login: (data) => publicAxios.post('/auth/login', data),
};

export const authAPI = {
  getProfile: () => authAxios.get('/auth/profile'),
  updateProfile: (data) => authAxios.put('/auth/profile', data),
  getUsers: () => authAxios.get('/auth/users'),
  changePassword: (data) => authAxios.put('/auth/change-password', data),
};

export const publicAPI = {
  getMemories: () => publicAxios.get('/memories'),
  getGallery: () => publicAxios.get('/gallery'),
  getTimeline: () => publicAxios.get('/timeline'),
  getGoals: () => publicAxios.get('/goals'),
  getAnniversary: () => publicAxios.get('/anniversary'),
};

export const memoriesAPI = {
  getAll: () => authAxios.get('/memories'),
  getMemories: () => authAxios.get('/memories'),
  create: (data) => authAxios.post('/memories', data),
  update: (id, data) => authAxios.put(`/memories/${id}`, data),
  like: (id) => authAxios.put(`/memories/${id}/like`),
  remove: (id) => authAxios.delete(`/memories/${id}`),
};

export const galleryAPI = {
  getAll: () => authAxios.get('/gallery'),
  getGallery: () => authAxios.get('/gallery'),
  upload: (data) => authAxios.post('/gallery/upload', data),
  remove: (id) => authAxios.delete(`/gallery/${id}`),
};

export const messagesAPI = {
  getAll: () => authAxios.get('/messages'),
  create: (data) => authAxios.post('/messages', data),
  remove: (id) => authAxios.delete(`/messages/${id}`),
};

export const timelineAPI = {
  getAll: () => authAxios.get('/timeline'),
  getTimeline: () => authAxios.get('/timeline'),
  create: (data) => authAxios.post('/timeline', data),
  update: (id, data) => authAxios.put(`/timeline/${id}`, data),
  remove: (id) => authAxios.delete(`/timeline/${id}`),
};

export const goalsAPI = {
  getAll: () => authAxios.get('/goals'),
  getGoals: () => authAxios.get('/goals'),
  create: (data) => authAxios.post('/goals', data),
  update: (id, data) => authAxios.put(`/goals/${id}`, data),
  remove: (id) => authAxios.delete(`/goals/${id}`),
};

export const contactAPI = {
  submit: (data) => publicAxios.post('/contact', data),
  getAll: () => authAxios.get('/contact'),
  remove: (id) => authAxios.delete(`/contact/${id}`),
};

export const getAnniversary = () => publicAxios.get('/anniversary');

export default authAxios;
