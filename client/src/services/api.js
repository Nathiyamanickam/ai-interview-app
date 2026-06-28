import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const startInterview = (data) => API.post('/interview/start', data);
export const submitAnswers = (data) => API.post('/interview/submit', data);
export const createReport = (data) => API.post('/report/create', data);
export const getMyReports = () => API.get('/report/my');