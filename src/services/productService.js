import api from './api';

export const productService = {
  async getAll(filters = {}) {
    const params = new URLSearchParams();

    if (filters.search) params.append('search', filters.search);
    if (filters.sort_by) params.append('sort_by', filters.sort_by);
    if (filters.sort_order) params.append('sort_order', filters.sort_order);
    if (filters.per_page) params.append('per_page', filters.per_page);
    if (filters.page) params.append('page', filters.page);

    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/products', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};
