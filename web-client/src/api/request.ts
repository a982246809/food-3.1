import axios from 'axios';
import { showNotify } from 'vant';

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    const res = response.data;
    // Unwrap our standard backend response
    if (res && res.code) {
      if (res.code === '0000') {
        return res.data;
      } else {
        showNotify({ type: 'danger', message: res.msg || '请求失败，请稍后再试' });
        return Promise.reject(new Error(res.msg || 'Error'));
      }
    }
    return res;
  },
  (error) => {
    const errorMsg = error.response?.data?.message || '请求失败，请稍后再试';
    showNotify({ type: 'danger', message: errorMsg });
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default request;
