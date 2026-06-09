import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const publicAxios = axios.create({ baseURL: BASE_URL });

const authAxios = axios.create({ baseURL: BASE_URL });

authAxios.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const loginAPI = {
  login: (data) => publicAxios.post('/auth/login', data),
  register: (data) => publicAxios.post('/auth/register', data),
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

export const analyticsAPI = {
  getStats: () => authAxios.get('/analytics/stats'),
  getLoveStats: () => authAxios.get('/analytics/love-stats'),
};

export const usersAPI = {
  getAll: () => authAxios.get('/users'),
  create: (data) => authAxios.post('/users', data),
  updateRole: (id, data) => authAxios.put(`/users/${id}/role`, data),
  remove: (id) => authAxios.delete(`/users/${id}`),
};

export const getAnniversary = () => publicAxios.get('/anniversary');

export const reactionsAPI = {
  getByMemory: (memoryId) => publicAxios.get(`/reactions/${memoryId}`),
  toggle: (memoryId, emoji) => authAxios.post(`/reactions/${memoryId}`, { emoji }),
};

export const loveLettersAPI = {
  getAll: () => authAxios.get('/love-letters'),
  create: (data) => authAxios.post('/love-letters', data),
  markOpened: (id) => authAxios.put(`/love-letters/${id}/open`),
  unlockByPassword: (id, password) => authAxios.post(`/love-letters/${id}/unlock`, { password }),
  remove: (id) => authAxios.delete(`/love-letters/${id}`),
};

export const wishlistAPI = {
  getAll: () => authAxios.get('/wishlist'),
  create: (data) => authAxios.post('/wishlist', data),
  markPurchased: (id) => authAxios.put(`/wishlist/${id}/purchase`),
  remove: (id) => authAxios.delete(`/wishlist/${id}`),
};

export const songsAPI = {
  getAll: () => publicAxios.get('/songs'),
  create: (data) => authAxios.post('/songs', data),
  remove: (id) => authAxios.delete(`/songs/${id}`),
};

export const reasonsAPI = {
  getAll: () => authAxios.get('/reasons'),
  getRandom: () => authAxios.get('/reasons/random'),
  create: (data) => authAxios.post('/reasons', data),
  remove: (id) => authAxios.delete(`/reasons/${id}`),
};

export const moodAPI = {
  getByUser: () => authAxios.get('/moods'),
  getByDateRange: (start, end) => authAxios.get(`/moods/range?start=${start}&end=${end}`),
  createOrUpdate: (data) => authAxios.post('/moods', data),
  remove: (id) => authAxios.delete(`/moods/${id}`),
};

export const dailyMessagesAPI = {
  getRandom: () => authAxios.get('/daily-messages/random'),
  getAll: () => authAxios.get('/daily-messages'),
  create: (data) => authAxios.post('/daily-messages', data),
  remove: (id) => authAxios.delete(`/daily-messages/${id}`),
};

export const romanticAPI = {
  getDailyMessage: (mood, specialDay) => {
    const params = new URLSearchParams();
    if (mood) params.append('mood', mood);
    if (specialDay) params.append('special_day', specialDay);
    return authAxios.get(`/romantic/daily-message?${params}`);
  },
  checkSpecialDay: () => authAxios.get('/romantic/check-special-day'),
};

export const quizAPI = {
  getQuestions: () => authAxios.get('/quiz/questions'),
  submit: (answers) => authAxios.post('/quiz/submit', { answers }),
  getHistory: () => authAxios.get('/quiz/history'),
};

export default authAxios;
