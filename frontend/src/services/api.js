import axios from 'axios';

const api = axios.create({
    baseURL: 'https://internal-productivity-backend.onrender.com',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getDashboardData = (range = '') => api.get(`/dashboard?range=${range}`);
export const getKpis = (range = '') => api.get(`/dashboard/kpis?range=${range}`);
export const getInsights = () => api.get('/dashboard/insights');
export const getCommits = (range = '') => api.get(`/dashboard/commits?range=${range}`);
export const getBugs = (range = '') => api.get(`/dashboard/bugs?range=${range}`);
export const getTimeLogs = (range = '') => api.get(`/dashboard/timelogs?range=${range}`);

// User management endpoints (admin only)
export const getUsers = () => api.get('/users');
export const updateUser = (userId, userData) => api.put(`/users/${userId}`, userData);
export const deleteUser = (userId) => api.delete(`/users/${userId}`);

export const exportReport = async (format) => {
    const token = localStorage.getItem('token');
    const response = await api.get(`/dashboard/export/${format}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        responseType: 'blob', 
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `report.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
};

export const register = (userData) => api.post('/auth/register', userData);

export default api; 
