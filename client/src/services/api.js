import axios from 'axios';

console.log("API URL:", import.meta.env.VITE_API_URL);

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (user.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }

  return req;
});
console.log("API URL:", import.meta.env.VITE_API_URL);
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const startInterview = (data) => API.post('/interview/start', data);
export const submitAnswers = (data) => API.post('/interview/submit', data);
export const createReport = (data) => API.post('/report/create', data);
export const getMyReports = () => API.get('/report/my');