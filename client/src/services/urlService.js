import api from './api';

export const urlService = {
  create: async (data) => {
    const res = await api.post('/urls', data);
    return res.data;
  },

  getAll: async (params = {}) => {
    const res = await api.get('/urls', { params });
    return res.data;
  },

  getOne: async (id) => {
    const res = await api.get(`/urls/${id}`);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.patch(`/urls/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/urls/${id}`);
    return res.data;
  },

  getAnalytics: async (urlId, days = 30) => {
    const res = await api.get(`/analytics/${urlId}`, { params: { days } });
    return res.data;
  },

  getOverview: async () => {
    const res = await api.get('/analytics/overview');
    return res.data;
  },
};

export default urlService;
