import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/users/auth/login`, credentials);
    return response.data.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};