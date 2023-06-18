import axios from 'axios';

export const getUsers = () => {
  const apiUrl = `${import.meta.env.VITE_BASE_URL}/users`;
  return axios.get(apiUrl).then((res) => res.data);
};
