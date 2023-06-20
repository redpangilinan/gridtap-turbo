import axios from 'axios';
axios.defaults.withCredentials = true;

type Inputs = {
  username: string;
  password: string;
};

// Core user authentication
export const signup = (data: Inputs) => {
  const apiUrl = `${import.meta.env.VITE_BASE_URL}/users`;
  return axios.post(apiUrl, data);
};

export const login = (data: Inputs) => {
  const apiUrl = `${import.meta.env.VITE_BASE_URL}/auth/login`;
  return axios.post(apiUrl, data, { withCredentials: true });
};

export const logout = () => {
  const apiUrl = `${import.meta.env.VITE_BASE_URL}/auth/logout`;
  return axios.delete(apiUrl, { withCredentials: true });
};
