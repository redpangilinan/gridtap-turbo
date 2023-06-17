import { NavigateFunction } from 'react-router-dom';
import axios from 'axios';
axios.defaults.withCredentials = true;

type Inputs = {
  username: string;
  password: string;
};

export const login = async (data: Inputs) => {
  await new Promise((resolve) => setTimeout(resolve, 350));

  const apiUrl = `${import.meta.env.VITE_BASE_URL}/users/login`;
  await axios.post(apiUrl, data, { withCredentials: true });

  window.location.reload();
};

export const logout = async () => {
  const apiUrl = `${import.meta.env.VITE_BASE_URL}/cookies/delete`;
  await axios.delete(apiUrl, { withCredentials: true });

  sessionStorage.clear();
};

// Redirect to homepage when login or register is accessed while token is active
export const validateLogin = async (navigate: NavigateFunction) => {
  const apiUrl = `${import.meta.env.VITE_BASE_URL}/cookies`;
  try {
    await axios.get(apiUrl, { withCredentials: true });
    navigate('/');
  } catch (error) {
    console.log('Not logged in');
  }
};
