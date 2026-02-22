import axios from 'axios';

const api = axios.create({
    baseURL: 'https://ecommerce.routemisr.com/api/v1',
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('userToken');
        if (token) config.headers.token = token;
    }
    return config;
});

export default api;
