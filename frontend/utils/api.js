import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add auth token
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

// Response interceptor - handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Handle 401 Unauthorized - only redirect if not on public pages
            if (error.response.status === 401) {
                const publicPaths = ['/', '/books', '/login', '/signup'];
                const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

                // Only redirect to login if not already on a public page
                if (!publicPaths.some(path => currentPath.startsWith(path))) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
                }
            }

            // Suppress logging for expected errors (validation failures and missing resources)
            // 400 = validation errors, 404 = not found (e.g., invalid payment references)
            const suppressedStatuses = [400, 404];
            const isPaymentEndpoint = error.config?.url?.includes('/payments/');

            // Only log if it's NOT a suppressed status OR NOT a payment endpoint
            const shouldLog = !(suppressedStatuses.includes(error.response.status) && isPaymentEndpoint);

            if (shouldLog) {
                const errorData = error.response.data;
                const errorMessage = errorData?.message || errorData?.error || JSON.stringify(errorData);
                console.error(`API Error (${error.response.status}):`, errorMessage);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
