import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../services/api';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(localStorage.getItem('token') || null);

  const isAuthenticated = computed(() => !!token.value);

  if (token.value) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
  }

  async function login(credentials) {
    try {
      const response = await api.post('/login', credentials);
      const { user: userData, access_token } = response.data;

      token.value = access_token;
      user.value = userData;

      localStorage.setItem('token', access_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async function register(userData) {
    try {
      const response = await api.post('/register', userData);
      const { user: newUser, access_token } = response.data;

      token.value = access_token;
      user.value = newUser;

      localStorage.setItem('token', access_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async function logout() {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      token.value = null;
      user.value = null;
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  }

  async function fetchUser() {
    try {
      const response = await api.get('/user');
      user.value = response.data.data;
      return response.data;
    } catch (error) {
      await logout();
      throw error;
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser
  };
});
