import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('shiftexa_token');
  const orgId = localStorage.getItem('shiftexa_org_id');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (orgId) {
    config.headers['x-organization-id'] = orgId;
  }
  return config;
});

export default api;
