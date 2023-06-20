import axios from 'axios';

type ScoreProps = {
  score: number;
  accuracy: number;
  maxCombo: number;
  hits: number;
  miss: number;
  device: string;
};

// Get all the users
export const getUsers = () => {
  const apiUrl = `${import.meta.env.VITE_BASE_URL}/users`;
  return axios.get(apiUrl).then((res) => res.data);
};

// Get the user data by username
export const getUserByUsername = (username: string) => {
  const apiUrl = `${import.meta.env.VITE_BASE_URL}/users/${username}`;
  return axios.get(apiUrl).then((res) => res.data);
};

// Get user data from access token
export const getUserTokens = () => {
  const apiUrl = `${import.meta.env.VITE_BASE_URL}/auth`;
  return axios.get(apiUrl, { withCredentials: true }).then((res) => res.data);
};

// Refresh access token
export const refreshUserTokens = () => {
  const apiUrl = `${import.meta.env.VITE_BASE_URL}/auth/refresh`;
  return axios.get(apiUrl, { withCredentials: true });
};

// Score submission
export const submitScore = async (data: ScoreProps) => {
  const token = await getUserTokens();
  const userId = token.decoded.userId;
  const jwtToken = token.accessToken;
  const postData = { ...data, userId };
  const apiUrl = `${import.meta.env.VITE_BASE_URL}/scores`;
  await axios.post(apiUrl, postData, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });
};
