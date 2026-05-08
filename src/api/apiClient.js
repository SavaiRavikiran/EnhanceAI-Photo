import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Create the Axios instance
const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor — attach auth token
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('app_access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor — unwrap data, handle errors
axiosClient.interceptors.response.use(
    (response) => {
        // Guard: Vite dev server may serve its SPA HTML for unknown routes (200 OK, text/html).
        // Detect this and treat it as a missing-backend error instead of returning HTML as data.
        const contentType = response.headers?.['content-type'] || '';
        if (contentType.includes('text/html') && typeof response.data === 'string') {
            const err = new Error('API endpoint not available (received HTML instead of JSON)');
            err.status = 502;
            return Promise.reject(err);
        }
        return response.data;
    },
    (error) => {
        const status = error.response?.status;
        const data = error.response?.data;

        // Surface error with status for callers to handle
        const apiError = new Error(data?.message || error.message);
        apiError.status = status;
        apiError.data = data;
        return Promise.reject(apiError);
    }
);

// ---------- Auth API ----------
const auth = {
    me: () => axiosClient.get('/api/auth/me'),

    updateMe: (data) => axiosClient.put('/api/auth/me', data),

    logout: (redirectUrl) => {
        localStorage.removeItem('app_access_token');
        if (redirectUrl) {
            window.location.href = `/login?redirect=${encodeURIComponent(redirectUrl)}`;
        }
    },

    redirectToLogin: (redirectUrl) => {
        window.location.href = `/login${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`;
    },
};

// ---------- Entity API ----------
function createEntityClient(entityName) {
    const basePath = `/api/entities/${entityName}`;

    return {
        list: (sort = '-created_date', limit = 50) =>
            axiosClient.get(basePath, { params: { sort, limit } }),

        get: (id) =>
            axiosClient.get(`${basePath}/${id}`),

        create: (data) =>
            axiosClient.post(basePath, data),

        update: (id, data) =>
            axiosClient.put(`${basePath}/${id}`, data),

        delete: (id) =>
            axiosClient.delete(`${basePath}/${id}`),
    };
}

const entities = {
    EnhancementJob: createEntityClient('EnhancementJob'),
    CreditTransaction: createEntityClient('CreditTransaction'),
    User: createEntityClient('User'),
};

// ---------- Integrations API ----------
const integrations = {
    Core: {
        UploadFile: async ({ file }) => {
            const formData = new FormData();
            formData.append('file', file);
            return axiosClient.post('/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        },

        GenerateImage: (params) =>
            axiosClient.post('/api/generate-image', params),
    },
};

// ---------- Unified API Client ----------
export const api = {
    auth,
    entities,
    integrations,
};

export default axiosClient;
